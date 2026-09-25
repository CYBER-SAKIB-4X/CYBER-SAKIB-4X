const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.5.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with an intelligent bot powered by Gemini API",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// শুধুমাত্র কমান্ড বা খালি মেসেজের জন্য ফানি রিপ্লাই
const cuteReplies = [
  "I love you 💝",
  "এ বেডা তোগো GC এর C E O শাকিব কই😌",
  "তোর বাড়ি কি উগান্ডা এখানে হুম",
  "Bot না জানু,বল 😌",
  "বলো জানু 🌚",
  "তোর কি চোখে পড়ে না আমি শাকিব বস এর সাথে ব্যাস্ত আসি😒",
  "amr Jan lagbe,Tumi ki single aso?",
  "babu khuda lagse🥺", "Hop beda😾,Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘", "🐒🐒🐒"
];

// সরাসরি জেমিনি এপিআই থেকে উত্তর আনার ফাংশন
async function getGeminiReply(userMessage, userName) {
  try {
    const apiKey = "AQ.Ab8RN6IDdMi_r1vZx7PsFSUyCxMyDK_5HxuKKyzBYlXI3HNcdg";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `তুমি একজন চতুর ও মিষ্টি এআই চ্যাটবট। ব্যবহারকারীর নাম "${userName}"। সে তোমাকে মেসেজ দিয়েছে: "${userMessage}"। খুব সংক্ষিপ্ত, সাবলীল এবং কিছুটা মজার বা চটপটে ভাষায় বাংলায় তার উত্তর দাও।`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "Bolo janu, sunchi toh! 😌";
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return null; // এপিআই ফেইল করলে যাতে বোঝা যায়
  }
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  api.getUserInfo(senderID, async (err, result) => {
    if (err) return console.error(err);
    const userName = result[senderID]?.name || "Janu";

    // যদি ইউজার কোনো লেখা না লিখে শুধু বট লেখে, তবেই শুধু ফানি লিস্ট থেকে দিবে
    if (!query) {
      const randomReply = cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
      return api.sendMessage({
        body: `${userName}, ${randomReply}`,
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

    // জেমিনি এপিআই কল করা
    const reply = await getGeminiReply(query, userName);
    const finalReply = reply || `${userName}, বলো জানু শুনছি তো! 😌`;

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

    const reply = await getGeminiReply(body, userName);
    const finalReply = reply || `${userName}, বলো জানু শুনছি তো! 😌`;

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
      console.error("Failed to unsend message:", err.message);
    }
  }
};
