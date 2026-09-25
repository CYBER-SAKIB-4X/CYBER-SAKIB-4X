const axios = require('axios');
const fs = require('fs'); 
const path = require('path');

module.exports.config = {
  name: "bot",
  version: "1.0.0",
  aliases: ["mim"],
  permission: 0,
  credits: "SAKIB AI",
  description: "talk with bot",
  prefix: false,
  category: "talk",
  usages: "hi",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const msg = args.join(" ");
    const apiData = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
    const apiUrl = apiData.data.sim;

    if (!msg) {
      const greetings = [
        "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
        "কি গো সোনা আমাকে ডাকছ কেনো",
        "বার বার আমাকে ডাকস কেন😡",
        "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
        "হুম জান তোমার অইখানে উম্মমাহ😷😘",
        "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
        "আমাকে এতো না ডেকে বসকে একটা গফ দে 🙄"
      ];
      
      api.getUserInfo(event.senderID, (err, userInfo) => {
        const name = userInfo[event.senderID]?.name || "User";
        const rand = greetings[Math.floor(Math.random() * greetings.length)];
        
        return api.sendMessage(`${name}, ${rand}`, event.threadID, (error, info) => {
          if (error) return;
          global.client.handleReply.push({
            type: 'reply',
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            head: msg,
          });
        }, event.messageID);
      });
      return;
    }

    // নরমাল চ্যাট রেসপন্স
    const response = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(msg)}`);
    const replyMessage = response.data.data.msg || "বলো সোনা, শুনছি! 😌";

    api.sendMessage(replyMessage, event.threadID, (error, info) => {
      if (error) {
        return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
      }

      global.client.handleReply.push({
        type: 'reply',
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        head: msg,
      });
    }, event.messageID);

  } catch (error) {
    console.log(error);
    api.sendMessage('An error has occurred, please try again later.', event.threadID, event.messageID);
  }
};

module.exports.handleReply = async ({ api, event }) => {
  try {
    if (!event.body) return;
    const apiData = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
    const apiUrl = apiData.data.sim;

    const response = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(event.body)}`);
    const result = response.data.data.msg || "বলো জানু! 🥰";

    api.sendMessage(result, event.threadID, (error, info) => {
      if (error) return;
      global.client.handleReply.push({
        type: 'reply',
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        head: event.body
      });
    }, event.messageID);

  } catch (error) {
    console.error('Error in handleReply:', error);
  }
};
