const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.2.0",
  permission: 0,
  credits: "SAKIB AI",
  description: "Chat with Notrack AI API",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

const apiKey = "sk-notrack-1d64df196c71b3f8a0ea3980cc184351ee23439e457f67c2";
const apiURL = "https://notrack.ai/v1/chat/completions";

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage("মামা, কিছু তো লিখবি নাকি শুধু ডাকিস? 😌", threadID, messageID);
  }

  try {
    const response = await axios.post(apiURL, {
      model: "notrack-uncensored",
      messages: [{ role: "user", content: query }]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      timeout: 15000
    });

    const reply = response.data.choices[0].message.content.trim();

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);

  } catch (error) {
    console.error("Notrack API Error:", error.response?.data || error.message);
    api.sendMessage("মামা, এপিআই সার্ভার থেকে রেসপন্স আসছে না, একটু পরে ট্রাই কর! 🥱", threadID, messageID);
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
      },
      timeout: 15000
    });

    const reply = response.data.choices[0].message.content.trim();

    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }, messageID);

  } catch (error) {
    console.error("Notrack API Error:", error.response?.data || error.message);
    api.sendMessage("মামা, এপিআই সার্ভার থেকে রেসপন্স আসছে না, একটু পরে ট্রাই কর! 🥱", threadID, messageID);
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
