const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "needbf",
  version: "3.1.0",
  permission: 0,
  credits: "SAKIB",
  description: "সিঙ্গেলদের জন্য র‍্যান্ডম কার্টুন/Anime BF 😎💞",
  prefix: true,
  category: "fun",
  usages: "-needbf",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event }) {
  try {
    const userID = event.senderID;
    const cacheDir = path.join(__dirname, "cache");

    // cache ফোল্ডার না থাকলে তৈরি করে নেবে
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const cacheFile = path.join(cacheDir, "cache.json");
    let cache = {};
    if (fs.existsSync(cacheFile)) {
      try {
        cache = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      } catch (e) {
        cache = {};
      }
    }

    // Unsplash বন্ধ থাকায় বিকল্প একটি ভালো অ্যানিমে বয় এপিআই ব্যবহার করা হয়েছে
    // আপনি চাইলে অন্য কোনো কাজ করা API লিংকও এখানে বসাতে পারেন
    const res = await axios.get("https://nekos.best/api/v2/husbando"); // অথবা অন্য কোনো সোর্স
    const imageUrl = res.data.results[0].url;

    // cache আপডেট
    cache[userID] = imageUrl;
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));

    // ডাউনলোড path
    const imgPath = path.join(cacheDir, `${userID}_bf.jpg`);

    // ডাউনলোড
    const imgResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, imgResponse.data);

    // পাঠানো
    api.sendMessage({
      body: "তোমার নতুন কার্টুন BF হাজির 😎💞",
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, event.messageID);

  } catch (err) {
    console.error("❌ Full Error:", err);
    api.sendMessage("দুঃখিত ভাই 😅, এখন একটু সমস্যা হচ্ছে!", event.threadID, event.messageID);
  }
};
