// Centralized WhatsApp response strings, translated per language.
// Add a new key here once and provide all 5 translations — never hardcode
// user-facing text in the handlers again.

export type Language = "english" | "pidgin" | "hausa" | "yoruba" | "igbo";

const SUPPORTED: Language[] = ["english", "pidgin", "hausa", "yoruba", "igbo"];

export interface MessageSet {
  voiceProcessing: string;
  voiceNotUnderstood: string;
  voiceError: string;
  txNotFound: string;
  txRecorded: (a: { type: "sale" | "expense"; qty: number | string; item: string; price: string; total: string }) => string;
  todayTotalSalesLine: (total: string) => string;
  noSalesToday: string;
  todaySummary: (a: { total: string; count: number | string }) => string;
  noInventory: string;
  stockUnit: string;
  stockReport: (lines: string) => string;
  restockNotUnderstood: string;
  stockUpdated: (a: { qty: number | string; item: string }) => string;
  dashboardLink: (url: string) => string;
  checkingPrices: string;
  adashiSoon: string;
  helpMenu: string;
  accountReady: (name: string) => string;
  pickNumber: string;
}

const txEmoji = (type: "sale" | "expense") => (type === "sale" ? "💰" : "🛒");

const messages: Record<Language, MessageSet> = {
  // ── ENGLISH ───────────────────────────────────────────────────────────────
  english: {
    voiceProcessing: "🎙️ Got your voice note, processing...",
    voiceNotUnderstood:
      "I couldn't understand that voice note. Please try saying it clearly, e.g. *'I sold 5 bags of rice at ₦3,500 each.'*",
    voiceError: "Sorry, I had trouble processing that voice note. Please try again.",
    txNotFound:
      "I couldn't find a transaction in that message. Try: *'I sold 5 bags of rice at ₦3,500 each.'*",
    txRecorded: ({ type, qty, item, price, total }) =>
      `✅ Recorded!\n\n${txEmoji(type)} ${type === "sale" ? "Sold" : "Bought"}: ${qty} ${item} @ ₦${price} = *₦${total}*`,
    todayTotalSalesLine: (total) => `\n\n📊 Today's total sales: *₦${total}*`,
    noSalesToday: "No sales recorded today yet. Send a voice note or type a sale to get started!",
    todaySummary: ({ total, count }) =>
      `📊 Today's summary:\n\n💰 Total sales: *₦${total}*\n📦 Transactions: *${count}*\n\nReply *dashboard* to see charts and details.`,
    noInventory: "You have no items in inventory yet. Say *'I bought 10 bags of rice'* to add stock.",
    stockUnit: "units",
    stockReport: (lines) => `📦 Your stock levels:\n\n${lines}\n\n🔴 Out  🟡 Low  🟢 OK`,
    restockNotUnderstood: "I couldn't understand the restock. Try: *'I bought 20 bags of rice at ₦3,000 each.'*",
    stockUpdated: ({ qty, item }) => `📦 Stock updated! Added ${qty} ${item} to inventory.`,
    dashboardLink: (url) =>
      `Here is your dashboard link — tap to open 👇\n\n${url}\n\n_Link expires in 24 hours. Reply *dashboard* anytime for a fresh one._`,
    checkingPrices: "🔍 Checking market prices...",
    adashiSoon: "Adashi group feature is coming soon! 🔜 For now, reply *dashboard* to see your stats.",
    helpMenu:
      `Here's what I can do for you:\n\n🎙️ *Voice note* — record a sale or expense\n💬 *Type a sale* — e.g. "I sold 5 tomatoes at ₦500"\n📊 *How much did I make today?* — daily summary\n📦 *Check my stock* — inventory levels\n💹 *Tomato price in Lagos?* — market intelligence\n🧮 *Calculate 3 bags at ₦4,200* — quick math\n🔗 *Dashboard* — see your full stats\n\nReply with any of the above!`,
    accountReady: (name) =>
      `You're all set, *${name}*! 🎉 Your account is ready.\n\nTry recording a sale — e.g. *"I sold 5 bags of rice at ₦3,500 each."*\n\nOr reply *dashboard* to see your stats.`,
    pickNumber: "Please reply with a number between 1 and 5.",
  },

  // ── PIDGIN ────────────────────────────────────────────────────────────────
  pidgin: {
    voiceProcessing: "🎙️ I don hear your voice note, I dey process am...",
    voiceNotUnderstood:
      "I no fit understand that voice note. Abeg talk am clear, like say *'I sell 5 bags of rice for ₦3,500 each.'*",
    voiceError: "Sorry o, I get wahala to process that voice note. Abeg try again.",
    txNotFound:
      "I no see any transaction for that message. Try: *'I sell 5 bags of rice for ₦3,500 each.'*",
    txRecorded: ({ type, qty, item, price, total }) =>
      `✅ I don record am!\n\n${txEmoji(type)} ${type === "sale" ? "You sell" : "You buy"}: ${qty} ${item} @ ₦${price} = *₦${total}*`,
    todayTotalSalesLine: (total) => `\n\n📊 Wetin you sell today: *₦${total}*`,
    noSalesToday: "You never record any sale today. Send voice note or type your sale make we start!",
    todaySummary: ({ total, count }) =>
      `📊 Today summary:\n\n💰 Total wey you sell: *₦${total}*\n📦 Transactions: *${count}*\n\nReply *dashboard* make you see chart and details.`,
    noInventory: "You no get any item for inventory yet. Talk *'I buy 10 bags of rice'* make I add stock.",
    stockUnit: "units",
    stockReport: (lines) => `📦 Your stock levels:\n\n${lines}\n\n🔴 Don finish  🟡 Small  🟢 OK`,
    restockNotUnderstood: "I no understand the restock. Try: *'I buy 20 bags of rice for ₦3,000 each.'*",
    stockUpdated: ({ qty, item }) => `📦 Stock update! I don add ${qty} ${item} to your inventory.`,
    dashboardLink: (url) =>
      `Na your dashboard link be dis — tap am open 👇\n\n${url}\n\n_Link go expire for 24 hours. Reply *dashboard* anytime make I give you fresh one._`,
    checkingPrices: "🔍 I dey check market price...",
    adashiSoon: "Adashi group feature dey come soon! 🔜 For now, reply *dashboard* make you see your stats.",
    helpMenu:
      `Na wetin I fit do for you be dis:\n\n🎙️ *Voice note* — record sale or expense\n💬 *Type your sale* — like "I sell 5 tomatoes for ₦500"\n📊 *How much I make today?* — today summary\n📦 *Check my stock* — inventory levels\n💹 *Tomato price for Lagos?* — market info\n🧮 *Calculate 3 bags for ₦4,200* — quick math\n🔗 *Dashboard* — see your full stats\n\nReply with any one!`,
    accountReady: (name) =>
      `You don set, *${name}*! 🎉 Your account ready now.\n\nTry record a sale — like *"I sell 5 bags of rice for ₦3,500 each."*\n\nOr reply *dashboard* make you see your stats.`,
    pickNumber: "Abeg reply with number between 1 and 5.",
  },

  // ── HAUSA ─────────────────────────────────────────────────────────────────
  hausa: {
    voiceProcessing: "🎙️ Na karɓi saƙon muryarka, ina sarrafa shi...",
    voiceNotUnderstood:
      "Ban gane wannan saƙon murya ba. Don Allah faɗa a fili, misali: *'Na sayar da buhu 5 na shinkafa kan ₦3,500 kowanne.'*",
    voiceError: "Yi haƙuri, na sami matsala wajen sarrafa saƙon murya. Don Allah sake gwadawa.",
    txNotFound:
      "Ban sami wata ciniki a cikin saƙon ba. Gwada: *'Na sayar da buhu 5 na shinkafa kan ₦3,500 kowanne.'*",
    txRecorded: ({ type, qty, item, price, total }) =>
      `✅ An yi rikodi!\n\n${txEmoji(type)} ${type === "sale" ? "An sayar" : "An saya"}: ${qty} ${item} @ ₦${price} = *₦${total}*`,
    todayTotalSalesLine: (total) => `\n\n📊 Jimillar tallace-tallacen yau: *₦${total}*`,
    noSalesToday: "Ba a yi rikodin wani sayarwa yau ba tukuna. Aika saƙon murya ko rubuta sayarwa mu fara!",
    todaySummary: ({ total, count }) =>
      `📊 Taƙaitaccen yau:\n\n💰 Jimillar sayarwa: *₦${total}*\n📦 Cinikai: *${count}*\n\nAmsa *dashboard* don ganin jadawali da cikakkun bayanai.`,
    noInventory: "Ba ka da wani kaya a ajiya tukuna. Faɗa *'Na sayi buhu 10 na shinkafa'* don ƙara kaya.",
    stockUnit: "raka'a",
    stockReport: (lines) => `📦 Matakan kayanka:\n\n${lines}\n\n🔴 Ya ƙare  🟡 Kaɗan  🟢 Lafiya`,
    restockNotUnderstood: "Ban gane sake cikon kaya ba. Gwada: *'Na sayi buhu 20 na shinkafa kan ₦3,000 kowanne.'*",
    stockUpdated: ({ qty, item }) => `📦 An sabunta kaya! An ƙara ${qty} ${item} a ajiya.`,
    dashboardLink: (url) =>
      `Ga hanyar dashboard ɗinka — danna don buɗewa 👇\n\n${url}\n\n_Hanyar za ta ƙare cikin awa 24. Amsa *dashboard* kowane lokaci don sabuwa._`,
    checkingPrices: "🔍 Ina duba farashin kasuwa...",
    adashiSoon: "Fasalin ƙungiyar Adashi yana zuwa nan ba da jimawa ba! 🔜 A yanzu, amsa *dashboard* don ganin bayananka.",
    helpMenu:
      `Ga abin da zan iya yi maka:\n\n🎙️ *Saƙon murya* — yi rikodin sayarwa ko kashe kuɗi\n💬 *Rubuta sayarwa* — misali "Na sayar da tumatir 5 kan ₦500"\n📊 *Nawa na samu yau?* — taƙaitaccen rana\n📦 *Duba kayana* — matakan ajiya\n💹 *Farashin tumatir a Legas?* — bayanan kasuwa\n🧮 *Lissafa buhu 3 kan ₦4,200* — lissafi cikin sauri\n🔗 *Dashboard* — duba cikakkun bayananka\n\nAmsa da kowanne daga cikinsu!`,
    accountReady: (name) =>
      `An gama shirya komai, *${name}*! 🎉 Asusunka yana shirye.\n\nGwada yin rikodin sayarwa — misali *"Na sayar da buhu 5 na shinkafa kan ₦3,500 kowanne."*\n\nKo amsa *dashboard* don ganin bayananka.`,
    pickNumber: "Don Allah amsa da lamba tsakanin 1 zuwa 5.",
  },

  // ── YORUBA ────────────────────────────────────────────────────────────────
  yoruba: {
    voiceProcessing: "🎙️ Mo ti gba ohùn rẹ, mo ń ṣiṣẹ́ lé e lórí...",
    voiceNotUnderstood:
      "Mi ò gbọ́ ohùn yẹn yédè. Jọ̀wọ́ sọ ọ́ kedere, bíi: *'Mo ta àpò ìrẹsì 5 ní ₦3,500 ọ̀kọ̀ọ̀kan.'*",
    voiceError: "Mà bínú, ìṣòro wà nínú ṣíṣe ohùn yẹn. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.",
    txNotFound:
      "Mi ò rí ìdúnàdúrà kankan nínú ìfọ̀rọ̀wérọ̀ yẹn. Gbìyànjú: *'Mo ta àpò ìrẹsì 5 ní ₦3,500 ọ̀kọ̀ọ̀kan.'*",
    txRecorded: ({ type, qty, item, price, total }) =>
      `✅ Mo ti kọ ọ́ sílẹ̀!\n\n${txEmoji(type)} ${type === "sale" ? "Tà" : "Rà"}: ${qty} ${item} @ ₦${price} = *₦${total}*`,
    todayTotalSalesLine: (total) => `\n\n📊 Àpapọ̀ ọjà tí o tà lónìí: *₦${total}*`,
    noSalesToday: "Kò sí ọjà tí a kọ sílẹ̀ lónìí síbẹ̀. Fi ohùn ránṣẹ́ tàbí kọ ọjà rẹ kí a bẹ̀rẹ̀!",
    todaySummary: ({ total, count }) =>
      `📊 Àkótán òní:\n\n💰 Àpapọ̀ ọjà títà: *₦${total}*\n📦 Ìdúnàdúrà: *${count}*\n\nDáhùn *dashboard* láti rí àwòrán àti ẹ̀kúnrẹ́rẹ́.`,
    noInventory: "O kò ní ọjà kankan nínú ilé-ìtọ́jú síbẹ̀. Sọ *'Mo ra àpò ìrẹsì 10'* láti fi kún ọjà.",
    stockUnit: "ẹyọ",
    stockReport: (lines) => `📦 Ìpele ọjà rẹ:\n\n${lines}\n\n🔴 Ó tán  🟡 Ó kéré  🟢 Ó dáa`,
    restockNotUnderstood: "Mi ò gbọ́ ìfikún ọjà náà. Gbìyànjú: *'Mo ra àpò ìrẹsì 20 ní ₦3,000 ọ̀kọ̀ọ̀kan.'*",
    stockUpdated: ({ qty, item }) => `📦 A ti ṣàtúnṣe ọjà! A fi ${qty} ${item} kún ilé-ìtọ́jú.`,
    dashboardLink: (url) =>
      `Èyí ni ọ̀nà dashboard rẹ — tẹ̀ ẹ́ láti ṣí 👇\n\n${url}\n\n_Ọ̀nà náà yóò pari ní wákàtí 24. Dáhùn *dashboard* nígbàkígbà fún tuntun._`,
    checkingPrices: "🔍 Mò ń wo iye ọjà ọjà...",
    adashiSoon: "Ẹ̀ya ẹgbẹ́ Àjọ ń bọ̀ láìpẹ́! 🔜 Fún ìsìnyìí, dáhùn *dashboard* láti rí ìṣirò rẹ.",
    helpMenu:
      `Ohun tí mo lè ṣe fún ọ nìyí:\n\n🎙️ *Ohùn* — kọ ọjà títà tàbí ìnáwó sílẹ̀\n💬 *Kọ ọjà* — bíi "Mo ta tòmátì 5 ní ₦500"\n📊 *Eló ni mo rí lónìí?* — àkótán ojúmọ́\n📦 *Wo ọjà mi* — ìpele ilé-ìtọ́jú\n💹 *Iye tòmátì ní Èkó?* — ìròyìn ọjà\n🧮 *Ṣírò àpò 3 ní ₦4,200* — ìṣirò kíákíá\n🔗 *Dashboard* — wo gbogbo ìṣirò rẹ\n\nDáhùn pẹ̀lú èyíkéyìí nínú wọn!`,
    accountReady: (name) =>
      `O ti ṣetán, *${name}*! 🎉 Àkáǹtì rẹ ti ṣetán.\n\nGbìyànjú láti kọ ọjà títà sílẹ̀ — bíi *"Mo ta àpò ìrẹsì 5 ní ₦3,500 ọ̀kọ̀ọ̀kan."*\n\nTàbí dáhùn *dashboard* láti rí ìṣirò rẹ.`,
    pickNumber: "Jọ̀wọ́ dáhùn pẹ̀lú nọ́mbà láàrin 1 sí 5.",
  },

  // ── IGBO ──────────────────────────────────────────────────────────────────
  igbo: {
    voiceProcessing: "🎙️ Anatala m olu gị, ana m ahazi ya...",
    voiceNotUnderstood:
      "Aghọtaghị m ozi olu ahụ. Biko kwuo ya nke ọma, dịka: *'Erere m akpa osikapa 5 na ₦3,500 nke ọ bụla.'*",
    voiceError: "Ndo, enwere m nsogbu ịhazi ozi olu ahụ. Biko nwaa ọzọ.",
    txNotFound:
      "Ahụghị m azụmahịa ọ bụla na ozi ahụ. Nwaa: *'Erere m akpa osikapa 5 na ₦3,500 nke ọ bụla.'*",
    txRecorded: ({ type, qty, item, price, total }) =>
      `✅ Edekọwo ya!\n\n${txEmoji(type)} ${type === "sale" ? "Rere" : "Zụrụ"}: ${qty} ${item} @ ₦${price} = *₦${total}*`,
    todayTotalSalesLine: (total) => `\n\n📊 Mkpọkọta ihe ị rere taa: *₦${total}*`,
    noSalesToday: "Edeghị ahịa ọ bụla taa. Ziga ozi olu maọbụ dee ahịa ka anyị malite!",
    todaySummary: ({ total, count }) =>
      `📊 Nchịkọta taa:\n\n💰 Mkpọkọta ahịa: *₦${total}*\n📦 Azụmahịa: *${count}*\n\nZaa *dashboard* ịhụ eserese na nkọwa zuru ezu.`,
    noInventory: "Ị nweghị ngwaahịa ọ bụla na ngwa ngwa. Kwuo *'Azụrụ m akpa osikapa 10'* ịtinye ngwaahịa.",
    stockUnit: "ọnụọgụ",
    stockReport: (lines) => `📦 Ọkwa ngwaahịa gị:\n\n${lines}\n\n🔴 Agwụla  🟡 Ole na ole  🟢 Ọ dị mma`,
    restockNotUnderstood: "Aghọtaghị m mweghachi ngwaahịa. Nwaa: *'Azụrụ m akpa osikapa 20 na ₦3,000 nke ọ bụla.'*",
    stockUpdated: ({ qty, item }) => `📦 Emelitela ngwaahịa! Agbakwunyere ${qty} ${item} na ngwa ahịa.`,
    dashboardLink: (url) =>
      `Nke a bụ njikọ dashboard gị — pịa ya imeghe 👇\n\n${url}\n\n_Njikọ ga-akwụsị n'oge awa 24. Zaa *dashboard* mgbe ọ bụla maka nke ọhụrụ._`,
    checkingPrices: "🔍 Ana m enyocha ọnụ ahịa ahịa...",
    adashiSoon: "Njirimara otu Àjọ na-abịa n'oge na-adịghị anya! 🔜 Ugbu a, zaa *dashboard* ịhụ ọnụọgụ gị.",
    helpMenu:
      `Nke a bụ ihe m nwere ike ime maka gị:\n\n🎙️ *Ozi olu* — dekọọ ahịa maọbụ mmefu\n💬 *Dee ahịa* — dịka "Erere m tomato 5 na ₦500"\n📊 *Ego ole ka m nwetara taa?* — nchịkọta ụbọchị\n📦 *Lelee ngwaahịa m* — ọkwa ngwaahịa\n💹 *Ọnụ ahịa tomato na Legos?* — ozi ahịa\n🧮 *Gbakọọ akpa 3 na ₦4,200* — mgbakọ ngwa ngwa\n🔗 *Dashboard* — lelee ọnụọgụ gị niile\n\nZaa site na nke ọ bụla n'ime ha!`,
    accountReady: (name) =>
      `Ị dị njikere, *${name}*! 🎉 Akaụntụ gị adịla njikere.\n\nNwaa idekọ ahịa — dịka *"Erere m akpa osikapa 5 na ₦3,500 nke ọ bụla."*\n\nMaọbụ zaa *dashboard* ịhụ ọnụọgụ gị.`,
    pickNumber: "Biko zaa site na nọmba dị n'etiti 1 na 5.",
  },
};

// Return the message set for a language, falling back to English for anything
// unknown so a missing/garbled language value never breaks a reply.
export function t(language: string | undefined | null): MessageSet {
  const lang = (language ?? "").toLowerCase() as Language;
  return SUPPORTED.includes(lang) ? messages[lang] : messages.english;
}
