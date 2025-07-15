const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "7116358231:AAH2qjhYh_oWcgbJuiwDqSMz_Oqj_WJKNa4";
const WEB_LINK = "https://your-react-site.netlify.app/";
const SPRING_BOOT_API = "http://localhost:8080/api/v1";

const bot = new Telegraf(BOT_TOKEN);

let users = [];  // for buyer session
let sessions = {}; // for seller product adding

// =========== BUYER FLOW ===========
bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username || "NoUsername";
  const chatId = ctx.chat.id.toString();

  let existingUser;
  try {
    const res = await axios.get(`${SPRING_BOOT_API}/user/exists/${telegramId}`);
    existingUser = res.data;
  } catch (err) {
    console.error("❌ Check user:", err.message);
    return ctx.reply("❌ Could not check registration.");
  }

  if (!existingUser.exists) {
    users.push({
      telegramId, chatId, username,
      role: null, stage: "awaiting_role", telegramChannel: null
    });

    return ctx.reply(
      `👋 Welcome @${username}! Choose your role:`,
      Markup.inlineKeyboard([
        [Markup.button.callback("🛍 Buyer", "select_buyer")],
        [Markup.button.callback("🏪 Seller", "select_seller")]
      ])
    );
  } else {
    const { role, telegramChannel = "none" } = existingUser;
    const link = `${WEB_LINK}${role.toLowerCase()}?username=${username}&role=${role}&channel=${encodeURIComponent(telegramChannel)}`;

    return ctx.reply(
      `✅ Already registered as ${role}. Open your app:`,
      Markup.inlineKeyboard([[Markup.button.url("🚀 Open Web App", link)]])
    );
  }
});

bot.action(["select_buyer", "select_seller"], async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = users.find(u => u.telegramId === telegramId);
  if (!user) return;

  if (ctx.callbackQuery.data === "select_buyer") {
    user.role = "BUYER";
    user.stage = "awaiting_channel";
    await ctx.reply("📢 Send me the Telegram channel you found this bot on (like `@MyStoreChannel`):", { parse_mode: "Markdown" });
  } else {
    user.role = "SELLER";
    user.stage = "awaiting_channel";
    await ctx.reply("📢 Send me your selling channel (like `@MyStoreChannel`):", { parse_mode: "Markdown" });
  }
  await ctx.answerCbQuery();
});

bot.on("text", async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const user = users.find(u => u.telegramId === telegramId);
  if (user && user.stage === "awaiting_channel") {
    user.telegramChannel = ctx.message.text;
    user.stage = null;

    try {
      await axios.post(`${SPRING_BOOT_API}/user/new`, {
        telegramId: user.telegramId,
        chatId: user.chatId,
        username: user.username,
        role: user.role,
        telegramChannel: user.telegramChannel
      });

      const link = `${WEB_LINK}${user.role.toLowerCase()}?username=${user.username}&role=${user.role}&channel=${encodeURIComponent(user.telegramChannel)}`;

      await ctx.reply(`✅ Registration complete! Open your app:`,
        Markup.inlineKeyboard([[Markup.button.url("🚀 Open Web App", link)]]));

    } catch (err) {
      console.error("❌ Saving user:", err.message);
      await ctx.reply("❌ Failed to save. Try again.");
    }
    return;
  }

  // =========== SELLER PRODUCT FLOW ===========
  const session = sessions[ctx.from.id];
  if (!session) return;

  const text = ctx.message.text;
  if (session.step === "channelId") {
    session.data.channelId = text;
    session.step = "productName";
    ctx.reply("📝 Enter *Product Name*:", { parse_mode: "Markdown" });
  } else if (session.step === "productName") {
    session.data.productName = text;
    session.step = "description";
    ctx.reply("✏️ Enter *Description*:", { parse_mode: "Markdown" });
  } else if (session.step === "description") {
    session.data.description = text;
    session.step = "price";
    ctx.reply("💰 Enter *Price*:", { parse_mode: "Markdown" });
  } else if (session.step === "price") {
    if (isNaN(text)) return ctx.reply("⚠️ Price must be a number.");
    session.data.price = parseFloat(text);
    session.step = "category";
    ctx.reply("🏷 Enter *Category*:", { parse_mode: "Markdown" });
  } else if (session.step === "category") {
    session.data.category = text;
    session.step = "stockQuantity";
    ctx.reply("📦 Enter *Stock Quantity*:", { parse_mode: "Markdown" });
  } else if (session.step === "stockQuantity") {
    if (isNaN(text)) return ctx.reply("⚠️ Stock must be a number.");
    session.data.stockQuantity = parseInt(text);
    session.step = "photo";
    ctx.reply("📸 Now send a *photo* of the product.", { parse_mode: "Markdown" });
  }
});

bot.on("photo", async (ctx) => {
  const session = sessions[ctx.from.id];
  if (!session || session.step !== "photo") return;

  try {
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileId = photo.file_id;
    const file = await bot.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    session.data.image = fileUrl;

    const { channelId, productName, description, price, category, stockQuantity, image } = session.data;
    const username = ctx.from.username;

    // Post to Telegram channel
    await bot.telegram.sendPhoto(
      channelId,
      image,
      {
        caption:
          `🛍 *New Product!*\n\n` +
          `*Name:* ${productName}\n` +
          `*Desc:* ${description}\n` +
          `*Price:* ${price} birr\n` +
          `*Category:* ${category}\n` +
          `*Stock:* ${stockQuantity}`,
        parse_mode: "Markdown"
      }
    );

    // Save to backend
    await axios.post(`${SPRING_BOOT_API}/product/add/${username}`, {
      productName, description, price, category, stockQuantity, image, channelId
    });

    ctx.reply("✅ Product posted & saved.");
  } catch (err) {
    console.error("❌ Error posting product:", err.message);
    ctx.reply("❌ Failed to post. Try again.");
  }

  delete sessions[ctx.from.id];
});

// Seller command
bot.command("newproduct", async (ctx) => {
  const username = ctx.from.username || "NoUsername";
  try {
    const res = await axios.get(`${SPRING_BOOT_API}/user/exists/${username}`);
    if (!res.data.exists || res.data.role !== "SELLER") {
      return ctx.reply("❌ You are not authorized as a seller.");
    }
    sessions[ctx.from.id] = { step: "channelId", data: {}, username };
    ctx.reply("📢 Enter your *Channel ID* (like `@MyStoreChannel`):", { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Check seller:", err.message);
    ctx.reply("❌ Could not verify seller.");
  }
});

app.get("/", (req, res) => res.send("✅ Bot server is running"));
app.listen(5500, () => console.log("🚀 Express on http://localhost:5500"));
bot.launch();
