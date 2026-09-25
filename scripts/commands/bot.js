const { GoogleGenAI } = require("@google/genai");

// অফিশিয়াল জেমিনি ক্লায়েন্ট ইনিশিয়ালাইজ করা
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6IDdMi_r1vZx7PsFSUyCxMyDK_5HxuKKyzBYlXI3HNcdg" });

module.exports.config = {
  name: "bot",
  version: "7.0.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with an intelligent bot powered by Gemini API",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// জেমিনি এপিআই থেকে সরাসরি চ্যাট রেসপন্স আনার ফাংশন
async function getGeminiReply(userMessage, userName) {
  try {
    const prompt = `তুমি একজন চতুর ও মিষ্টি এআই চ্যাটবট। ব্যবহারকারীর নাম "${userName}"। সে তোমাকে মেসেজ দিয়েছে: "${userMessage}"। খুব সংক্ষিপ্ত, সাবলীল এবং কিছুটা মজার ভাষায় বাংলায় তার উত্তর দাও।`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "বলো জানু, শুনছি তো! 😌";
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return `আরে ${userName}, একটু টেকনিক্যাল সমস্যা হচ্ছে! তবুও বলো কেমন আছো? 💝`;
  }
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  
  let query = args.join(" ");
  if (!query && event.body) {
    const text = event.body.trim();
    query = text.toLowerCase().startsWith("bot") ? text.slice(3).trim() : text;
  }

  api.getUserInfo(senderID, async (err, result) => {
    if (err) return console.error(err);
    const userName = result[senderID]?.name || "Janu";

    if (!query || query === "") {
      return api.sendMessage(`${userName}, কিছু একটা লিখে বলো জানু! 😌`, threadID, messageID);
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
      console.error(err);
    }
  }
};
