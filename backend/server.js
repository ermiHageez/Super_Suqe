const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const BOT_TOKEN = "7116358231:AAH2qjhYh_oWcgbJuiwDqSMz_Oqj_WJKNa4";
const WEB_LINK = "https://dancing-florentine-e4a567.netlify.app/";
const SPRING_API = "http://localhost:8080/api/v1";

const app = express();
app.use(express.json());

const bot = new Telegraf(BOT_TOKEN);

let sellerState = {};
let productState = {};

// ✅ /start — Register seller
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || "NoUsername";
  const chatId = ctx.chat.id;

  try {
    await axios.post(`${SPRING_API}/user/new`, {
      telegramId: userId,
      username,
      chatId,
      role: "SELLER",
    });

    const userData = await axios
      .get(`${SPRING_API}/user/exists/${username}`)
      .then((res) => res.data);

    const link = `${WEB_LINK}${userData.role.toLowerCase()}?username=${username}&role=${userData.role}&channel=${encodeURIComponent(userData.telegramChannel || "")}`;

    await ctx.reply(
      `✅ You are registered as ${userData.role}`,
      Markup.inlineKeyboard([[Markup.button.url("🚀 Open Web App", link)]])
    );

    sellerState[userId] = { step: 1 };
    await ctx.reply("📢 Send your Telegram Channel username (e.g. @MyShopChannel)");
  } catch (err) {
    console.error("Registration error:", err.message);
    ctx.reply("❌ Registration failed. Try again later.");
  }
});

// ✅ Start product creation
bot.command("newproduct", (ctx) => {
  const userId = ctx.from.id;
  productState[userId] = { step: 1 };
  ctx.reply("📦 Enter product name:");
});

// ✅ Handle text input
bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || "NoUsername";
  const text = ctx.message.text;

  const regState = sellerState[userId];
  const prodState = productState[userId];

  // Seller info steps
  if (regState) {
    if (regState.step === 1) {
      if (!text.startsWith("@")) return ctx.reply("❌ Channel must start with '@'.");
      regState.channel = text;
      regState.step = 2;
      await ctx.reply("📞 Now send your phone number:");
    } else if (regState.step === 2) {
      regState.phone = text;

      await axios
        .post(`${SPRING_API}/user/new`, {
          telegramId: userId,
          username,
          phone: regState.phone,
          role: "SELLER",
          telegramChannel: regState.channel,
        })
        .catch((err) => console.log("Error saving seller:", err.message));

      await ctx.reply(`✅ Seller registered as @${username}!\nUse /newproduct to add products.`);
      delete sellerState[userId];
    }
    return;
  }

  // Product creation steps
  if (prodState) {
    switch (prodState.step) {
      case 1:
        prodState.name = text;
        prodState.step = 2;
        await ctx.reply("📝 Enter product description:");
        break;
      case 2:
        prodState.description = text;
        prodState.step = 3;
        await ctx.reply("💲 Enter product price:");
        break;
      case 3:
        const price = parseFloat(text);
        if (isNaN(price)) return ctx.reply("❌ Invalid price. Enter a number.");
        prodState.price = price;
        prodState.step = 4;
        await ctx.reply("📦 Enter product stock:");
        break;
      case 4:
        const stock = parseInt(text);
        if (isNaN(stock)) return ctx.reply("❌ Invalid stock. Enter a whole number.");
        prodState.stock = stock;
        prodState.step = 5;
        await ctx.reply("📂 Enter product category:");
        break;
      case 5:
        prodState.category = text;
        prodState.step = 6;
        await ctx.reply("🖼️ Now send the product image:");
        break;
    }
  }
});

// ✅ Handle photo (product image)
bot.on("photo", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || "NoUsername";
  const prodState = productState[userId];

  if (!prodState || prodState.step !== 6) {
    return ctx.reply("ℹ️ Please start with /newproduct to add a product.");
  }

  const fileId = ctx.message.photo.at(-1).file_id;

  try {
    const sellerInfo = await axios
      .get(`${SPRING_API}/user/exists/${username}`)
      .then((res) => res.data);

    const product = {
      productName: prodState.name,
      description: prodState.description,
      price: prodState.price,
      stockQuantity: prodState.stock,
      category: prodState.category,
      image: fileId,
      sellerUsername: username,
    };

    await axios.post(`${SPRING_API}/product/add/${username}`, product);
    await ctx.reply("✅ Product added successfully!/n And now posting to Telegram... check your channel.");

    const channel = sellerInfo.telegramChannel;

    if (!channel || !channel.startsWith("@")) {
      return ctx.reply("⚠️ Product saved, but Telegram Channel is missing or invalid. Use /start to update it.");
    }

    const buyLink = `${WEB_LINK}buyer?username=BuyerUser&role=BUYER&channel=${encodeURIComponent(channel)}`;

    await bot.telegram.sendPhoto(channel, fileId, {
      caption: `🛍 *${product.productName}*\n${product.description}\n💵 ${product.price} ETB\n📦 Stock: ${product.stockQuantity}`,
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([Markup.button.url("🛒 Buy Now", buyLink)]),
    });
  } catch (err) {
    console.error("Image upload failed:", err.message);
    ctx.reply("❌ Failed to post product. Try again.");
  }

  delete productState[userId];
});

// ✅ Start Express server
app.listen(5500, () => console.log("🚀 Express server running on port 5500"));
bot.launch();
console.log("🤖 Telegram bot is live!");
