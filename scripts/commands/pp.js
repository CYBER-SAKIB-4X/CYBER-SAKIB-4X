const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "pp",
  version: "1.0.4",
  permission: 0,
  credits: "SAKIB AI",
  prefix: true,
  description: "Send profile picture using UID, mention or reply",
  category: "image",
  usages: "[uid/reply/mention]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  let uid;

  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else if (Object.keys(event.mentions || {}).length > 0) {
    uid = Object.keys(event.mentions)[0];
  } else if (args[0] && /^\d+$/.test(args[0])) {
    uid = args[0];
  } else {
    uid = event.senderID;
  }

  try {
    const imageUrl = `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const filePath = path.join(__dirname, "cache", `${uid}.jpg`);

    const response = await axios.get(imageUrl, { responseType: "stream" });
    await fs.ensureDir(path.dirname(filePath));
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `━━ ❖ 𝑷𝑹𝑶𝑭𝑰𝑳𝑬 𝑷𝑰𝑪 ❖ ━━`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    });
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ প্রোফাইল পিকচার আনতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
