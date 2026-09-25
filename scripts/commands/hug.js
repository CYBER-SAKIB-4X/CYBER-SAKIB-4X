module.exports.config = {
  name: "hug",
  version: "1.0.3",
  permission: 0,
  credits: "IMRAN",
  description: "Send hug using mention or message reply",
  prefix: false,
  category: "fun",
  usages: "hug [@mention / reply]",
  cooldowns: 5,
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let mentionID = "";
  let mentionName = "your friend";

  // ১) মেনশন করা আছে কি না চেক করা
  const mentionIDs = Object.keys(mentions || {});
  if (mentionIDs.length > 0) {
    mentionID = mentionIDs[0];
    mentionName = (mentions[mentionID] || "").replace(/@/g, "").trim();
  } 
  // ২) যদি মেনশন না করে কারো মেসেজে রিপ্লাই করা হয়
  else if (messageReply) {
    mentionID = messageReply.senderID;
    try {
      const userInfo = await api.getUserInfo(mentionID);
      mentionName = userInfo[mentionID]?.name || "friend";
    } catch (e) {
      mentionName = "friend";
    }
  }

  // যদি দুটোই না থাকে (কাউকে মেনশন বা রিপ্লাই না করে থাকে)
  if (!mentionID) {
    return api.sendMessage("❌ অনুগ্রহ করে কাউকে মেনশন করুন অথবা তার মেসেজে রিপ্লাই দিয়ে 'hug' লিখুন!", threadID, messageID);
  }

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
