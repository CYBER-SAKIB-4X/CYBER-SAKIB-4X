module.exports.config = {
  name: "cummah",
  version: "1.0.3",
  permission: 0,
  credits: "SAKIB AI",
  description: "উম্মাহ বার্তা ও মিষ্টি কথা",
  prefix: true,
  category: "fun",
  usages: "@mention",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, mentions, body } = event;

  // মেনশন চেক করার নিরাপদ পদ্ধতি
  let mentionID = "";
  let mentionName = "";

  if (mentions && Object.keys(mentions).length > 0) {
    mentionID = Object.keys(mentions)[0];
    mentionName = mentions[mentionID];
  } else if (event.messageReply) {
    // যদি কেউ রিপ্লাই করে কমান্ড দেয়
    mentionID = event.messageReply.senderID;
    try {
      const userInfo = await api.getUserInfo(mentionID);
      mentionName = userInfo[mentionID]?.name || "User";
    } catch (e) {
      mentionName = "User";
    }
  }

  if (!mentionID) {
    return api.sendMessage("❌ আগে কাউকে মেনশন করো বা কারো মেসেজে রিপ্লাই দিয়ে কমান্ডটি ব্যবহার করো।", threadID, messageID);
  }

  // নাম থেকে যদি @ চিহ্ন থাকে তা রিমোভ করে দেওয়া
  mentionName = mentionName.replace(/@/g, "").trim();
  const tag = { tag: mentionName, id: mentionID };

  const messages = [
    `${mentionName} শাকিব ভাইয়ের পক্ষ থেকে এতোগুলো উম্মাহ তুমার জন্য শুধু😽😻`,
    `${mentionName} তুমার গালে উম্মাহ 😘`,
    `${mentionName} তুমার ঠোঁটে উম্মাহ 😚`,
    `${mentionName} তুমার উপরে উম্মাহ 😍`,
    `${mentionName} তুমার কপালে উম্মাহ 🥰`,
    `${mentionName} তুমার গলায় উম্মাহ 😘`,
    `${mentionName} তুমার চোখে উম্মাহ 😌`,
    `${mentionName} তুমার হৃদয়ে উম্মাহ ❤️`,
    `${mentionName} তুমার নাকে উম্মাহ 💋`,
    `${mentionName} তুমার হাতের তালুতে উম্মাহ 🤲`,
    `${mentionName} তুমার কানে উম্মাহ 👂😘`,
    `${mentionName} তুমার গালের ডিম্পলে উম্মাহ 😳`,
    `${mentionName} তুমার চিনিতে উম্মাহ 😋`,
    `${mentionName} তুমার কোমরে উম্মাহ 🔥`,
    `${mentionName} তুমার পিঠে উম্মাহ 💞`,
    `${mentionName} তুমার ঘাড়ে উম্মাহ 😈`,
    `${mentionName} তুমার বুকের বামে উম্মাহ 💓`,
    `${mentionName} তুমার বুকের ডানে উম্মাহ 💗`,
    `${mentionName} তুমার পায়ের আঙুলে উম্মাহ 🦶💋`,
    `${mentionName} তুমার হৃদয়ের গভীরে উম্মাহ 🫀`,
    `${mentionName} তুমার আত্মায় উম্মাহ 👻❤️`,
    `${mentionName} তুমার শ্বাসে উম্মাহ 😮‍💨`,
    `${mentionName} তুমার কল্পনায় উম্মাহ 🤤`,
    `${mentionName} তুমার ছায়ায় উম্মাহ 🌑`,
    `${mentionName} তুমার সব কথায় উম্মাহ 🎤💋`,
    `${mentionName} শাকিব ভাই কে এখন পটাও🤭🤭`,
  ];

  for (let i = 0; i < messages.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await api.sendMessage(
      {
        body: messages[i],
        mentions: [tag],
      },
      threadID
    );
  }
};
