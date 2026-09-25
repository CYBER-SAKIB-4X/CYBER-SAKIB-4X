const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "5.0.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with an intelligent bot",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// সরাসরি এপিআই থেকে চ্যাট রেসপন্স আনার ফাংশন
async function getAiReply(userMessage, userName) {
  try {
    // একটি ফ্রি এবং ফাস্ট পাবলিক এআই এন্ডপয়েন্ট যা সরাসরি চটপটে বাংলায় উত্তর দেয়
    const encodedMessage = encodeURIComponent(userMessage);
    const url = `https://api.kenliejugarap.com/ai/?text=${encodedMessage}`;

    const response = await axios.get(url);
    let reply = response.data?.response || response.data?.result || response.data?.message;

    if (reply) {
      // উত্তরটিকে একটু শাকিবের স্টাইলের মতো মিষ্টি ও চটপটে করে নেওয়া
      return `${reply} 😌`;
    }
    
    return `বলো ${userName}, শুনছি তো! 🥱`;
  } catch (error) {
    console.error("AI API Error:", error.message);
    return `আরে ${userName}, একটু নেটওয়ার্কে সমস্যা করছে! তবুও বলো কেমন আছো? 💝`;
  }
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  api.getUserInfo(senderID, async (err, result) => {
    if (err) return console.error(err);
    const userName = result[senderID]?.name || "Janu";

    if (!query) {
      return api.sendMessage({
        body: `${userName}, কিছু একটা লিখে বলো জানু! 😌`,
        mentions: [{ tag: userName, id: senderID }]
      }, threadID, (err, info) => {
        if (err) return;
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID
        });
      }, messageID);
    }

    const reply = await getAiReply(query, userName);

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  });
};

module.exports.handleReply = async ({ api, event }) => {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  api.getUserInfo(senderID, async (err, result) => {
    if (err) return console.error(err);
    const userName = result[senderID]?.name || "Janu";

    const reply = await getAiReply(body, userName);

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);
  });
};

module.exports.handleReaction = async ({ api, event }) => {
  const { reaction, messageReply } = event;

  if (reaction === '😡' && messageReply) {
    try {
      await api.unsendMessage(messageReply.messageID);
    } catch (err) {
      console.error("Failed to unsend message:", err.message);
    }
  }
};
