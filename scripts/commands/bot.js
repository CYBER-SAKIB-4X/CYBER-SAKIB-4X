const { GoogleGenAI } = require("@google/genai");

// জেমিনি এপিআই কি সহ ইনিশিয়ালাইজ করা
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6IDdMi_r1vZx7PsFSUyCxMyDK_5HxuKKyzBYlXI3HNcdg" });

module.exports.config = {
  name: "bot",
  version: "3.0.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with an intelligent bot powered by Gemini API",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// Cute/funny fallback replies (যদি জেমিনি এপিআইতে কখনো সমস্যা হয়)
const cuteReplies = [
  "I love you 💝",
  "এ বেডা তোগো GC এর C E O শাকিব কই😌",
  "তোর বাড়ি কি উগান্ডা এখানে হুম",
  "Bot না জানু,বল 😌",
  "বলো জানু 🌚",
  "তোর কি চোখে পড়ে না আমি শাকিব বস এর সাথে ব্যাস্ত আসি😒",
  "𝙏𝙢𝙧 𝙣𝙖𝙣𝙞 𝙧 𝐨𝐢 𝐭𝐚  😑🥺",
  "amr Jan lagbe,Tumi ki single aso?",
  "𝙏𝙪𝙢𝙖𝙧 BF 𝙣𝙖𝙞 ,𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤?😂😂😂",
  "babu khuda lagse🥺", "Hop beda😾,Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘", "🐒🐒🐒"
];

// জেমিনি থেকে উত্তর জেনারেট করার ফাংশন
async function getGeminiReply(userMessage, userName) {
  try {
    const prompt = `তুমি একজন চতুর ও মিষ্টি এআই চ্যাটবট। ব্যবহারকারীর নাম "${userName}"। সে তোমাকে মেসেজ দিয়েছে: "${userMessage}"। খুব সংক্ষিপ্ত, সাবলীল এবং কিছুটা মজার বা চটপটে ভাষায় বাংলায় তার উত্তর দাও।`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Bolo janu, sunchi toh! 😌";
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    // এরর হলে লোকাল লিস্ট থেকে রেন্ডম একটি ফানি রিপ্লাই দিয়ে দিবে
    return cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
  }
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  api.getUserInfo(senderID, async (err, result) => {
    if (err) return console.error(err);
    const userName = result[senderID]?.name || "Janu";

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
