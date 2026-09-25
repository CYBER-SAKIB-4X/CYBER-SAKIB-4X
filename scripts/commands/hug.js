module.exports.config = {
  name: "hug",
  version: "1.0.2",
  permission: 0,
  credits: "IMRAN",
  description: "Send hug using canvas API",
  prefix: false,
  category: "fun",
  usages: "hug @mention",
  cooldowns: 5,
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID, mentions } = event;

  // নিখুঁতভাবে মেনশন চেক করার লজিক
  const mentionIDs = Object.keys(mentions || {});
  if (mentionIDs.length === 0) {
    return api.sendMessage("❌ অনুগ্রহ করে কাউকে মেনশন করুন Hug দেওয়ার জন্য!", threadID, messageID);
  }

  const mentionID = mentionIDs[0];
  const mentionName = mentions[mentionID].replace(/@/g, "").trim();

  // সরাসরি ক্যানভাস এপিআই লিংক (অথва তোমার নিজস্ব এপিআই বসাতে পারো)
  const imgURL = `https://api.vyturex.com/hug?one=${encodeURIComponent(senderID)}&two=${encodeURIComponent(mentionID)}`;

  try {
    const resp = await axios.get(imgURL, {
      responseType: "arraybuffer",
      timeout: 20000,
      validateStatus: () => true
    });

    if (resp.status !== 200) {
      return api.sendMessage(`❌ Hug API error: HTTP ${resp.status}.`, threadID, messageID);
    }

    const ctype = String(resp.headers["content-type"] || "").toLowerCase();
    if (!ctype.startsWith("image/")) {
      return api.sendMessage("❌ এপিআই থেকে কোনো ছবি পাওয়া যায়নি!", threadID, messageID);
    }

    const tmpFile = path.join(os.tmpdir(), `hug_${Date.now()}.png`);
    fs.writeFileSync(tmpFile, Buffer.from(resp.data));

    api.sendMessage({
      body: `🤗 ${mentionName}, তুমি একটি সুন্দর হাগ (Hug) পেয়েছো! 💕`,
      attachment: fs.createReadStream(tmpFile)
    }, threadID, (err) => {
      fs.unlink(tmpFile, () => {});
      if (err) {
        api.sendMessage("❌ ছবি পাঠানো যায়নি।", threadID);
      }
    }, messageID);

  } catch (err) {
    console.error("hug command error:", err?.message);
    return api.sendMessage(`Something went wrong.\n${err?.message || ""}`, threadID, messageID);
  }
};
