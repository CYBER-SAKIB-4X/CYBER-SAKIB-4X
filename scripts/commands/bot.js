const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.1.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with Notrack AI",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// তোমার Notrack AI এপিআই কি
const apiKey = "sk-notrack-1d64df196c71b3f8a0ea3980cc184351ee23439e457f67c2";

// Notrack AI এর সঠিক চ্যাট কমপ্লিশন এন্ডপয়েন্ট
const apiURL = "https://notrack.ai/v1/chat/completions"; 

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage("❌ অনুগ্রহ করে কিছু লিখে বটকে ডাকুন!", threadID, messageID);
  }

  try {
    const response = await axios.post(apiURL, {
      model: "notrack-uncensored",
      messages: [{ role: "user", content: query }]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const reply = response.data.choices[0].message.content.trim() || "I didn't get that!";

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    api.sendMessage("❌ Notrack এপিআই কানেক্ট করতে সমস্যা হচ্ছে!", threadID, messageID);
  }
};

module.exports.handleReply = async ({ api, event }) => {
  const { threadID, messageID, senderID, body } = event;

  if (!body) return;

  try {
    const response = await axios.post(apiURL, {
      model: "notrack-uncensored",
      messages: [{ role: "user", content: body }]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const reply = response.data.choices[0].message.content.trim() || "I didn't get that!";

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    api.sendMessage("❌ Notrack এপিআই কানেক্ট করতে সমস্যা হচ্ছে!", threadID, messageID);
  }
};

module.exports.handleReaction = async ({ api, event }) => {
  const { reaction, messageReply } = event;

  if (reaction === '😡') {
    try {
      await api.unsendMessage(messageReply.messageID);
    } catch (err) {
      console.error("Failed to unsend message:", err.message);
    }
  }
};
