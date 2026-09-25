const { GoogleGenAI } = require("@google/genai");

// তোমার দেওয়া অথরাইজেশন এপিআই কি এখানে সেট করা হলো
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6IDdMi_r1vZx7PsFSUyCxMyDK_5HxuKKyzBYlXI3HNcdg" });

module.exports.config = {
  name: "bot",
  version: "7.1.0",
  permission: 0,
  credits: "VAI",
  description: "Smart AI Chatbot powered by Google Gemini API",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// বটের মূল ব্যক্তিত্ব বা নির্দেশিকা (যাতে সে শাকিব বস এবং তোমার দেওয়া স্টাইলে কথা বলে)
const systemInstruction = "You are a smart, funny, and slightly sassy Messenger chat bot. You speak in a mix of Bengali, English, and Banglish (like a Gen-Z Messenger user). You occasionally mention your boss 'Sakib' and give witty, cute, or sarcastic replies.";

async function getGeminiReply(userMessage) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 150,
        temperature: 0.9,
      }
    });
    
    return response.text || "Bolo janu, sunchi toh! 😌";
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "Babu, ekhonktu byasto achi, pore kotha bolbo! 🙈";
  }
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.getUserInfo(senderID, (err, result) => {
      if (err) return console.error(err);
      const userName = result[senderID].name;
      
      const defaultReply = `${userName}, বলো জানু কি বলবা? 😌`;
      api.sendMessage({
        body: defaultReply,
        mentions: [{ tag: userName, id: senderID }]
      }, threadID, (err, info) => {
        if (err) return;
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID
        });
      }, messageID);
    });
  }

  const reply = await getGeminiReply(query);

  api.sendMessage(reply, threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID
    });
  }, messageID);
};

module.exports.handleReply = async ({ api, event }) => {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const reply = await getGeminiReply(body);

  api.sendMessage(reply, threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID
    });
  }, messageID);
};

module.exports.handleReaction = async ({ api, event }) => {
  const { reaction, messageReply } = event;

  if (reaction === '😡') {
    try {
      api.unsendMessage(messageReply.messageID);
    } catch (err) {
      console.error("Failed to unsend message:", err.message);
    }
  }
};
