const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "6.0.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with an intelligent bot",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// এআই থেকে উত্তর আনার মূল ফাংশন
async function getAiReply(userMessage) {
  try {
    const encodedMessage = encodeURIComponent(userMessage);
    const url = `https://api.kenliejugarap.com/ai/?text=${encodedMessage}`;
    const response = await axios.get(url);
    
    // এপিআই থেকে সরাসরি রেসপন্স টেক্সট রিড করা
    const reply = response.data?.response || response.data?.result || response.data?.message;
    if (reply) {
      return reply;
    }
    return "বলো জানু, শুনছি তো! 😌";
  } catch (error) {
    console.error("API Error:", error.message);
    return "আরে একটু সমস্যা হচ্ছে, পরে আবার বলো! 💝";
  }
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  
  // এখানে কমান্ডের পরের অংশ অথবা পুরো বডি টেক্সট পারফেক্টলি ক্যাচ করা হচ্ছে
  let query = args.join(" ");
  if (!query && event.body) {
    const prefixMatch = event.body.trim();
    // যদি প্রিফিক্স বা কমান্ড নাম বাদ দিতে হয়
    query = prefixMatch.startsWith("bot") ? prefixMatch.slice(3).trim() : prefixMatch;
  }

  api.getUserInfo(senderID, async (err, result) => {
    if (err) return console.error(err);
    const userName = result[senderID]?.name || "Janu";

    if (!query) {
      return api.sendMessage(`${userName}, কিছু একটা লিখে বলো জানু! 😌`, threadID, messageID);
    }

    const aiResponse = await getAiReply(query);
    const finalReply = `${userName}, ${aiResponse}`;

    api.sendMessage(finalReply, threadID, (err, info) => {
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

    const aiResponse = await getAiReply(body);
    const finalReply = `${userName}, ${aiResponse}`;

    api.sendMessage(finalReply, threadID, (err, info) => {
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
      console.error(err);
    }
  }
};
