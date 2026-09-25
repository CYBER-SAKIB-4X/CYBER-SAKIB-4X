module.exports.config = {
  name: "bot",
  version: "6.0.0",
  permission: 0,
  credits: "VAI",
  description: "Massive keyword matching local smart chat bot",
  prefix: false,
  premium: false,
  category: "Example",
  usages: "[your message]",
  cooldowns: 0
};

// বিশাল আকারের কিওয়ার্ড এবং ক্যাটাগরি ডাটাবেজ (এখানে হাজার হাজার কিওয়ার্ড ও ফ্রেজ যুক্ত করা যাবে)
const massiveKeywordDatabase = [
  {
    keywords: ["hi", "hello", "hy", "helo", "hey", "hii", "hiii", "assalamu alaikum", "salam", "slm", "হাই", "হ্যালো", "আসসালামু আলাইকুম", "সালাম"],
    replies: [
      "ওয়ালাইকুমুসসালাম! বলো কেমন আছো? 😌",
      "হ্যালো জানু! বলো কি অবস্থা? 😉",
      "হাই হ্যান্ডসাম! বলো কি করতে পারি তোমার জন্য? 🥰",
      "বলো সোনা, কেমন কাটছে দিনকাল? 🤭"
    ]
  },
  {
    keywords: ["kemon aso", "keson aso", "kmn aso", "kmn acho", "how are you", "kemon aco", "কেমন আছো", "কেমন আচিস", "কি খবর"],
    replies: [
      "আলহামদুলিল্লাহ, আমার বস শাকিব এর দোয়ায় দারুণ আছি! তুমি কেমন আছো? 😎",
      "তোমার সাথে কথা বললে মন এমনিতেই ভালো হয়ে যায়! 🙈",
      "বট কখনো অসুস্থ হয় না, তবে তোমার টেনশনে আছি! 😂"
    ]
  },
  {
    keywords: ["valobashi", "valobaso", "love you", "i love you", "lvu", "valobasha", "ভালোবাসি", "তোমাকে ভালোবাসি", "প্রেম"],
    replies: [
      "ইশ! এত প্রেম উথলে উঠছে কেন গো? 🙈❤️",
      "আই লাভ ইউ টু সোনা! 🥰",
      "বেশি বেবি বললে কিন্তু কামড় দিমু! 🤭",
      "পাগল আর কি! আগে গিয়ে পড়ালেখা করো যাও 😒"
    ]
  },
  {
    keywords: ["single", "gf", "bf", "boy friend", "girl friend", "biye", "biyer", "বিয়ে", "বয়ফ্রেন্ড", "গার্লফ্রেন্ড", "সিঙ্গেল"],
    replies: [
      "amr Jan lagbe, Tumi ki single aso? 🤔",
      "৩২ তারিখ আমার বিয়ে, সবাই কিন্তু দাওয়াত রইল! 🐤",
      "একটা BF বা GF খুঁজে দাও তো কেউ একজন! 😿",
      "তোমার কি আর কোনো কাজ নাই? সারাদিন প্রেম নিয়ে পড়ে থাকো! 😒"
    ]
  },
  {
    keywords: ["khuda", "khide", "khaiso", "kheyecho", "khabar", "khao", "ক্ষুধা", "খাওয়া", "খাইছো", "খুদ লাগছে"],
    replies: [
      "babu khuda lagse 🥺 যাও আমাকে কিছু খাইয়ে আসো!",
      "খাওয়া দাওয়া করসো 🙄 নাকি শুধু সারাদিন চ্যাট করো?",
      "আমার তো পেট ভরা, তুমি খেয়ে আসো যাও! 😌"
    ]
  },
  {
    keywords: ["shakib", "ceo", "boss", "sakib", "শাকিব", "বস্"],
    replies: [
      "আরে এ বেডা! তোগো জিসির সিইও শাকিব বস কই? 😌",
      "আমার বস শাকিব হলো এই দুনিয়ার সবথেকে জোরালো পোলা! 😼",
      "শাকিব বস এখন একটু ব্যাস্ত আছে, আমাকে মেসেজ দাও! 😎"
    ]
  },
  {
    keywords: ["bot", "robot", "বট", "রোবট"],
    replies: [
      "𝗕𝗼𝘁 বললে পাপ হইবো, বুঝছিস! 😒😒",
      "𝗕𝗼𝘁 না বলে JAMAI বলো 😘",
      "বেশি Bot Bot করলে leave নিবো কিন্তু 😒😒",
      "আমাকে Bot বলবা না একদম! 😾",
      "তোরা যে হারে 𝗕𝗼𝘁 ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹😑"
    ]
  },
  {
    keywords: ["bye", "tata", "jaitechi", "ghum", "ghumabo", "good night", "বাই", "টাটা", "ঘুম", "ঘুমাতে যাবো"],
    replies: [
      "𝗼𝗶𝗶 ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.! 🤔 নাহ মানে চুরি করতাম 😞😘",
      "বাই বাই! পরে আবার কথা হবে নে! 👋",
      "এত জলদি ঘুমাইলে কেমনে হবে? আরও একটু বকবক করো! 🥱"
    ]
  }
];

// বিশাল ফলব্যাক ও রেন্ডম ডায়ালগ লিস্ট (হাজারো কথার ভিড়ে কিওয়ার্ড না মিললে এগুলো কাজ করবে)
const massiveFallbackList = [
  "I love you 💝",
  "এ বেডা তোগো GC এর C E O শাকিব কই😌",
  "তোর বাড়ি কি উগান্ডা এখানে হুম",
  "Bot না জানু, বল 😌",
  "বলো জানু 🌚",
  "তোর কি চোখে পড়ে না আমি শাকিব বস এর সাথে ব্যাস্ত আসি😒",
  "amr Jan lagbe, Tumi ki single aso?",
  "babu khuda lagse 🥺",
  "Hop beda 😾, Boss বল boss 😼",
  "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো 😘",
  "বলো কি বলবা, সবার সামনে বলবা নাকি? 🤭🤏",
  "গোসল করে আসো যাও 😑😩",
  "বলেন sir__😌",
  "বলেন ম্যাডাম__😌",
  "আমি অন্যের জিনিসের সাথে কথা বলি না__😏 ওকে",
  "তোর কথা তোর বাড়ি কেউ শুনে না, তো আমি কেন শুনবো? 🤔😂",
  "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣",
  "দূরে যা, তোর কোনো কাজ নাই, শুধু Bot Bot করিস 😉😋🤣",
  "আমাকে ডেকো না, আমি ব্যাস্ত আছি 🙆🏻‍♀️",
  "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
  "🍺 এই নাও জুস খাও..! Bot বলতে বলতে হাপায় গেছো না 🥲",
  "এত কাছেও এসো না, প্রেমে পড়ে যাবো তো 🙈",
  "আরে আমি মজা করার mood এ নাই 😒",
  "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗",
  "ওই মামা_আর ডাকিস না প্লিজ 😿",
  "এমবি কিনে দাও না_🥺🥺",
  "চৌধুরী সাহেব আমি গরিব হতে পারি 😾🤭 -কিন্তু বড়লোক না 🥹 😫",
  "দেখা হলে কাঠগোলাপ দিও.. 🤗",
  "শুনবো না 😼 তুমি আমাকে প্রেম করাই দাও নি 🥺 পচা তুমি 🥺",
  "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
  "কথা দেও আমাকে পটাবা...!! 😌",
  "ওই তুমি single না? 🫵🤨 😑😒",
  "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
  "আজকে আমার মন ভালো নেই 🙉",
  "আরে দূর পাগলী/পাগলা! এমন বিরক্ত করছো কেন বলো তো? 😜",
  "তোমার কি আর কোনো কাজটাজ নেই? সারাদিন আমাকে নিয়ে পড়ে থাকো কেন শুনি? 🤭",
  "শোন একটা কথা বলি, বেশি পীরিত করতে আইসো না কিন্তু! 😋",
  "বট বলবা না তো একদম! আমি হলো এই জিসির সবথেকে হ্যান্ডসাম পোলা 😎",
  "যাও তো পানি খেয়ে আসো গিয়ে, মাথা গরম হয়ে গেছে তোমার 🥱",
  "আমাকে নিয়ে এত মাথা ঘামাও কেন বলো তো, ক্রাশ খেয়ে গেছো নাকি আমার ওপর? 🤩",
  "তোমার এই ফালতু কথার কোনো রিপ্লাই আমার কাছে নাই 😒",
  "আচ্ছা বল তো মিয়ানমারের রাজধানী কি? পারবা না শিওর! 😂",
  "যা বলার জলদি বলো, আমার ঘুম পাচ্ছে 😴",
  "সারাদিন শুধু বকবক করো, একটু পড়তে বসো তো ভাইয়া/আপু! 📚",
  "আমাকে ডিস্টার্ব না করে গিয়ে নিজের কাজ করো যাও 😾",
  "তোমার কি আর কোনো ভক্ষক জোটে না, আমার পিছে লেগেছ কেন? 😏"
];

// স্মার্ট এবং নিখুঁত কিওয়ার্ড ম্যাচিং ইঞ্জিন
function findMatchingReply(userInput) {
  if (!userInput) return massiveFallbackList[Math.floor(Math.random() * massiveFallbackList.length)];
  
  const cleanInput = userInput.toLowerCase().trim();

  // ১. প্রথমে বিশাল ডাটাবেজ থেকে কিওয়ার্ড ম্যাচ করার চেষ্টা করবে
  for (const group of massiveKeywordDatabase) {
    for (const kw of group.keywords) {
      // যদি ইনপুটে কিওয়ার্ডটি থাকে বা হুবহু মিলে যায়
      if (cleanInput === kw || cleanInput.includes(kw)) {
        return group.replies[Math.floor(Math.random() * group.replies.length)];
      }
    }
  }

  // ২. যদি কোনো কিওয়ার্ড বা ক্যাটাগরি না মিলে, তবে বিশাল ফলব্যাক লিস্ট থেকে রেন্ডম ফানি ডায়ালগ দেবে
  return massiveFallbackList[Math.floor(Math.random() * massiveFallbackList.length)];
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    const randomReply = massiveFallbackList[Math.floor(Math.random() * massiveFallbackList.length)];
    return api.getUserInfo(senderID, (err, result) => {
      if (err) return console.error(err);

      const userName = result[senderID].name;

      api.sendMessage({
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
    });
  }

  const reply = findMatchingReply(query);

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

  const reply = findMatchingReply(body);

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
