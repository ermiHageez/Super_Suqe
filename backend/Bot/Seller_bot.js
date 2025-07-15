const { Telegraf } = require("telegraf");
const axios = require("axios");

const BOT_TOKEN = "7987673804:AAHYIRBYSSD_dje6wnp6768chBDnJpb2oD4";
const SPRING_BOOT_API = "http://localhost:8080/api/v1";
const bot = new Telegraf(BOT_TOKEN);

let sessions = {}; // { telegramId: { step, data, username } }

// Start
bot.start((ctx) => {
  ctx.reply("👋 Welcome Seller Bot. Use /newproduct to add your product.");
});

// Start new product
bot.command("newproduct", async (ctx) => {
  const username = ctx.from.username || "NoUsername";

  try {
    const res = await axios.get(`${SPRING_BOOT_API}/user/exists/${username}`);
    const userData = res.data; // expects { exists: true, role: "SELLER" }

    if (!userData.exists || userData.role !== "SELLER") {
      return ctx.reply("❌ You are not authorized as a seller.");
    }

    // Valid seller
    sessions[ctx.from.id] = {
      step: "channelId",
      data: {},
      username
    };
    ctx.reply("📢 Enter your *Channel ID* (like `@MyStoreChannel`):", { parse_mode: "Markdown" });

  } catch (err) {
    console.error("❌ Error verifying seller:", err.message);
    ctx.reply("❌ Could not verify your seller status. Try again later.");
  }
});

// Handle text
bot.on("text", async (ctx) => {
  const session = sessions[ctx.from.id];
  if (!session) return;

  const text = ctx.message.text;

  if (session.step === "channelId") {
    session.data.channelId = text;
    session.step = "productName";
    ctx.reply("📝 Enter the *Product Name*:", { parse_mode: "Markdown" });
  }
  else if (session.step === "productName") {
    session.data.productName = text;
    session.step = "description";
    ctx.reply("✏️ Enter the *Description*:", { parse_mode: "Markdown" });
  }
  else if (session.step === "description") {
    session.data.description = text;
    session.step = "price";
    ctx.reply("💰 Enter the *Price*:", { parse_mode: "Markdown" });
  }
  else if (session.step === "price") {
    if (isNaN(text)) return ctx.reply("⚠️ Price must be a number.");
    session.data.price = parseFloat(text);
    session.step = "category";
    ctx.reply("🏷 Enter the *Category*:", { parse_mode: "Markdown" });
  }
  else if (session.step === "category") {
    session.data.category = text;
    session.step = "stockQuantity";
    ctx.reply("📦 Enter the *Stock Quantity*:", { parse_mode: "Markdown" });
  }
  else if (session.step === "stockQuantity") {
    if (isNaN(text)) return ctx.reply("⚠️ Stock must be a number.");
    session.data.stockQuantity = parseInt(text);
    session.step = "photo";
    ctx.reply("📸 Now send a *photo* of the product.", { parse_mode: "Markdown" });
  }
});

// Handle photo
bot.on("photo", async (ctx) => {
  const session = sessions[ctx.from.id];
  if (!session || session.step !== "photo") return;

  try {
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileId = photo.file_id;
    const file = await bot.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    session.data.image = fileUrl;

    const { username } = session;
    const { channelId, productName, description, price, category, stockQuantity, image } = session.data;

    // 1️⃣ Post to their channel
    await bot.telegram.sendPhoto(
      channelId,
      image,
      {
        caption:
          `🛍 *New Product!*\n\n` +
          `*Name:* ${productName}\n` +
          `*Description:* ${description}\n` +
          `*Price:* ${price} birr\n` +
          `*Category:* ${category}\n` +
          `*Stock:* ${stockQuantity}`,
        parse_mode: "Markdown"
      }
    );
    ctx.reply(`✅ Product posted to your channel ${channelId}`);

    // 2️⃣ Save to backend
    await axios.post(`${SPRING_BOOT_API}/product/add/${username}`, {
      productName,
      description,
      price,
      category,
      stockQuantity,
      image,
      channelId
    });
    ctx.reply("✅ Product saved to database under your account.");

  } catch (err) {
    console.error("❌ Error:", err.message);
    ctx.reply("❌ Failed to post or save. Try again later.");
  }

  delete sessions[ctx.from.id];
});

bot.launch();
console.log("🚀 Seller Bot running with DB seller check...");
