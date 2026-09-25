const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "4.0.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with an intelligent bot powered by Gemini API",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// সরাসরি জেমিনি এপিআই থেকে উত্তর আনার ফাংশন
async function getGeminiReply(userMessage, userName) {
  try {
    const apiKey = "AQ.Ab8RN6IDdMi_r1vZx7PsFSUyCxMyDK_5HxuKKyzBYlXI3HNcdg";
    // জেমিনির সঠিক এবং বর্তমান স্ট্যাবল এন্ডপয়েন্ট
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    const prompt = `তুমি একজন চতুর ও মিষ্টি এআই চ্যাটবট। ব্যবহারকারীর নাম "${userName}"। সে তোমাকে মেসেজ দিয়েছে: "${userMessage}"। খুব সংক্ষিপ্ত, সাবলীল এবং কিছুটা মজার বা চটপটে ভাষায় বাংলায় তার উত্তর দাও।`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) return reply;
    
    return "বলো জানু, শুনছি তো! 😌";
  } catch (error) {
    // ডিবাগ করার জন্য কনসোলে রিয়েল এরর প্রিন্ট করবে
    console.error("Gemini API Detailed Error:", error.response?.data || error.message);
    return `আরে ${userName}, একটু টেকনিক্যাল সমস্যা হচ্ছে! তবুও বলো কেমন আছো? 😌`;
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
        body: `${userName}, কিছু একটা লিখেবলো জানu! 😌`,
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

    const reply = await getGeminiReply(query, userName);

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

    const reply = await getGeminiReply(body, userName);

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
