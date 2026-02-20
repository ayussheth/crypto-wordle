// Themed word lists for CryptoWordle

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  words: string[];
}

export const THEMES: Theme[] = [
  {
    id: "all",
    name: "All Crypto",
    emoji: "🔗",
    description: "The full crypto word list",
    words: [
      "BLOCK", "CHAIN", "TOKEN", "STAKE", "YIELD", "WHALE", "MINER", "LAYER",
      "SHARD", "VAULT", "NODES", "PROOF", "FLASH", "NONCE", "EPOCH", "SMART",
      "ETHER", "FORKS", "DEGEN", "ALPHA", "BYTES", "COINS", "SWAPS", "POOLS",
      "FARMS", "PUMPS", "DUMPS", "BEARS", "BULLS", "SHORT", "LONGS", "HEDGE",
      "TRADE", "BONDS", "LOANS", "RATES", "PRICE", "VALUE", "ORDER", "LIMIT",
      "CHART", "FLOAT", "BURNS", "MINTS", "DROPS", "AUDIT", "RISKS", "FUNDS",
      "CRYPT", "LEDGE", "STORE", "QUERY", "STATE", "SLOTS", "CALLS", "BATCH",
      "BLOBS", "CURVE", "GRIND", "GUILD", "VOTER", "PROXY", "CLAIM", "GRANT",
      "MERGE", "PHASE", "SCALE", "SOLVE", "TRUST", "ASSET", "CROWD", "OWNER",
      "AGENT", "BONUS", "SHARE", "INPUT", "ENTRY", "HODLS", "BASED", "DEPIN",
      "LUNAR", "STACK", "WRAPS", "PERPS", "SWEPT", "SNIPE", "FLOOR", "PAPER",
      "APTOS", "TEZOS", "NEXUS", "ORBIT", "PULSE", "SIGMA", "THETA", "ULTRA",
      "WAVES", "FORGE", "CRAFT", "LINKS", "POWER", "DEPTH", "CYCLE", "VALID",
      "RANGE", "POINT", "CODES", "LOGIC", "FETCH", "SIGNS", "PATCH", "GUARD",
    ],
  },
  {
    id: "defi",
    name: "DeFi",
    emoji: "💰",
    description: "Decentralized finance terms",
    words: [
      "YIELD", "STAKE", "SWAPS", "POOLS", "FARMS", "TRADE", "BONDS", "LOANS",
      "RATES", "PRICE", "VALUE", "ORDER", "LIMIT", "FLOAT", "BURNS", "MINTS",
      "DROPS", "FUNDS", "VAULT", "FLASH", "CURVE", "HEDGE", "LONGS", "SHORT",
      "PERPS", "WRAPS", "CLAIM", "SHARE", "ASSET", "AUDIT",
    ],
  },
  {
    id: "culture",
    name: "Degen Culture",
    emoji: "🐸",
    description: "Crypto slang and culture",
    words: [
      "DEGEN", "ALPHA", "WHALE", "HODLS", "BASED", "LUNAR", "PUMPS", "DUMPS",
      "BEARS", "BULLS", "SNIPE", "FLOOR", "PAPER", "STACK", "SWEPT", "GRIND",
      "RISKS", "CROWD", "BONUS", "GUILD",
    ],
  },
  {
    id: "tech",
    name: "Tech",
    emoji: "⚙️",
    description: "Blockchain technology terms",
    words: [
      "BLOCK", "CHAIN", "NODES", "PROOF", "NONCE", "EPOCH", "SMART", "ETHER",
      "FORKS", "SHARD", "LAYER", "BYTES", "CRYPT", "BATCH", "BLOBS", "MERGE",
      "STATE", "SLOTS", "CALLS", "QUERY", "STORE", "LEDGE", "MINER", "VALID",
      "CODES", "LOGIC", "FETCH", "PATCH", "SIGNS", "CYCLE",
    ],
  },
  {
    id: "protocols",
    name: "Protocols",
    emoji: "🌐",
    description: "Network and protocol names",
    words: [
      "APTOS", "TEZOS", "NEXUS", "ORBIT", "PULSE", "SIGMA", "THETA", "ULTRA",
      "WAVES", "FORGE", "ETHER", "CURVE", "DEPIN",
    ],
  },
];

// Build answer list from a theme
export function getThemeWords(themeId: string): string[] {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return THEMES[0].words;
  // Deduplicate
  return [...new Set(theme.words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, "")).filter((w) => w.length === 5))];
}

// Default: all crypto
const seen = new Set<string>();
export const ANSWERS: string[] = [];
for (const w of THEMES[0].words) {
  const upper = w.toUpperCase().replace(/[^A-Z]/g, "");
  if (upper.length === 5 && !seen.has(upper)) {
    seen.add(upper);
    ANSWERS.push(upper);
  }
}

// All valid guesses = all theme words + common English words
export const VALID_GUESSES = new Set<string>(ANSWERS);

// Add all theme words
for (const theme of THEMES) {
  for (const w of theme.words) {
    const upper = w.toUpperCase().replace(/[^A-Z]/g, "");
    if (upper.length === 5) VALID_GUESSES.add(upper);
  }
}

// Common English 5-letter words so players can guess freely
const COMMON_WORDS = [
  "ABOUT","ABOVE","ABUSE","ACTOR","ACUTE","ADMIT","ADOPT","ADULT","AFTER","AGAIN",
  "AGENT","AGREE","AHEAD","ALARM","ALBUM","ALERT","ALIEN","ALIGN","ALIVE","ALLEY",
  "ALLOW","ALONE","ALONG","ALTER","AMONG","ANGEL","ANGER","ANGLE","ANGRY","APART",
  "APPLE","APPLY","ARENA","ARGUE","ARISE","ASIDE","AVOID","AWAKE","AWARD","AWARE",
  "BASIC","BASIS","BEACH","BEGIN","BEING","BELOW","BENCH","BIRTH","BLACK","BLADE",
  "BLAME","BLANK","BLAST","BLAZE","BLEED","BLEND","BLIND","BLOOD","BLOOM","BLOWN",
  "BOARD","BOUND","BRAIN","BRAND","BRAVE","BREAD","BREAK","BREED","BRIEF","BRING",
  "BROAD","BROKE","BROWN","BRUSH","BUILD","BUNCH","BURST","BUYER","CABIN","CANDY",
  "CARRY","CATCH","CAUSE","CHAIR","CHASE","CHEAP","CHECK","CHEST","CHIEF","CHILD",
  "CHINA","CHUNK","CIVIL","CLASS","CLEAN","CLEAR","CLIMB","CLING","CLOCK","CLOSE",
  "CLOUD","COACH","COAST","COLOR","COUNT","COURT","COVER","CRACK","CRANE","CRASH",
  "CRAZY","CREAM","CRIME","CROSS","CROWN","CRUSH","DAILY","DANCE","DEATH","DEBUT",
  "DELAY","DELTA","DENSE","DERBY","DEVIL","DIRTY","DOUBT","DOUGH","DRAFT","DRAIN",
  "DRAMA","DRANK","DRAWN","DREAM","DRESS","DRIED","DRINK","DRIVE","DROVE","DROWN",
  "DYING","EAGER","EARLY","EARTH","EIGHT","ELECT","ELITE","EMPTY","ENEMY","ENJOY",
  "ENTER","EQUAL","ERROR","EVENT","EVERY","EXACT","EXIST","EXTRA","FAINT","FAITH",
  "FALSE","FANCY","FATAL","FAULT","FEAST","FENCE","FEVER","FEWER","FIBER","FIELD",
  "FIFTH","FIFTY","FIGHT","FINAL","FIRST","FIXED","FLAME","FLESH","FLOOD","FLOUR",
  "FLUID","FLUSH","FOCUS","FORCE","FOUND","FRAME","FRANK","FRAUD","FRESH","FRONT",
  "FROZE","FRUIT","FULLY","FUNNY","GHOST","GIANT","GIVEN","GLASS","GLOBE","GLOOM",
  "GLORY","GOING","GRACE","GRADE","GRAIN","GRAND","GRASS","GRAVE","GREAT","GREEN",
  "GREET","GRIEF","GROSS","GROUP","GROWN","GUARD","GUESS","GUIDE","GUILT","HABIT",
  "HAPPY","HARSH","HEART","HEAVY","HELLO","HENCE","HORSE","HOTEL","HOUSE","HUMAN",
  "HUMOR","HURRY","IDEAL","IMAGE","IMPLY","INDEX","INDIA","INNER","IRONY","ISSUE",
  "IVORY","JEWEL","JOINT","JUDGE","JUICE","KNIFE","KNOCK","KNOWN","LABEL","LABOR",
  "LARGE","LASER","LATER","LAUGH","LEARN","LEAST","LEAVE","LEGAL","LEMON","LEVEL",
  "LIGHT","LINEN","LIVER","LOCAL","LOOSE","LOVER","LOWER","LUCKY","LUNCH","LYING",
  "MAGIC","MAJOR","MAKER","MARCH","MARRY","MATCH","MAYOR","MEDIA","MERCY","METAL",
  "METER","MIGHT","MINOR","MINUS","MIXED","MODEL","MONEY","MONTH","MORAL","MOTOR",
  "MOUNT","MOUSE","MOUTH","MOVIE","MUDDY","MUSIC","NAIVE","NAKED","NASTY","NAVAL",
  "NERVE","NEVER","NEWLY","NIGHT","NOBLE","NOISE","NORTH","NOTED","NOVEL","NURSE",
  "OCCUR","OCEAN","OFFER","OFTEN","OTHER","OUGHT","OUTER","OWNED","OXIDE","PAINT",
  "PANEL","PANIC","PARTY","PASTA","PAUSE","PEACE","PENNY","PHONE","PHOTO","PIANO",
  "PIECE","PILOT","PITCH","PIZZA","PLACE","PLAIN","PLANE","PLANT","PLATE","PLAZA",
  "PLEAD","PLUCK","POLAR","POUND","POWER","PRESS","PRIDE","PRIME","PRINT","PRIOR",
  "PRIZE","PRONE","PROUD","PROVE","PUNCH","PUPIL","QUEEN","QUEST","QUEUE","QUICK",
  "QUIET","QUOTE","RADAR","RADIO","RAISE","RALLY","RANCH","RANGE","RAPID","RATIO",
  "REACH","READY","REALM","REBEL","REIGN","RELAX","REPLY","RIGHT","RIGID","RISKY",
  "RIVAL","RIVER","ROBIN","ROBOT","ROCKY","ROGER","ROMAN","ROUGH","ROUND","ROUTE",
  "ROYAL","RUGBY","RULER","RURAL","SADLY","SAINT","SALAD","SANDY","SCENE","SCOPE",
  "SCORE","SENSE","SERVE","SETUP","SEVEN","SHALL","SHAME","SHAPE","SHARK","SHARP",
  "SHEER","SHELF","SHELL","SHIFT","SHINE","SHIRT","SHOCK","SHOOT","SHOUT","SIGHT",
  "SILLY","SINCE","SIXTH","SIXTY","SIZED","SKILL","SKULL","SLASH","SLAVE","SLEEP",
  "SLIDE","SLOPE","SMALL","SMELL","SMILE","SMITH","SMOKE","SNAKE","SOLAR","SOLID",
  "SORRY","SOUND","SOUTH","SPACE","SPARE","SPARK","SPEAK","SPEED","SPELL","SPENT",
  "SPICE","SPINE","SPOKE","SPOON","SPRAY","SQUAD","STAFF","STAGE","STAIN","STALE",
  "STALL","STAND","STARK","START","STAYS","STEAM","STEEL","STEEP","STEER","STICK",
  "STIFF","STILL","STOCK","STONE","STOOD","STORM","STORY","STOVE","STRIP","STUCK",
  "STUDY","STUFF","STYLE","SUGAR","SUITE","SUNNY","SUPER","SURGE","SWAMP","SWEAR",
  "SWEEP","SWEET","SWIFT","SWING","SWISS","SWORD","SWORE","SWORN","TABLE","TAKEN",
  "TASTE","TEACH","TEETH","TEMPT","TENSE","TENTH","THANK","THEME","THICK","THIEF",
  "THING","THINK","THIRD","THOSE","THREE","THREW","THROW","THUMB","TIGER","TIGHT",
  "TIMER","TIRED","TITLE","TODAY","TOTAL","TOUCH","TOUGH","TOWER","TOXIC","TRACE",
  "TRACK","TRAIL","TRAIN","TRAIT","TRASH","TREAT","TREND","TRIAL","TRIBE","TRICK",
  "TRIED","TROOP","TRUCK","TRULY","TUMOR","TWICE","TWIST","UNCLE","UNDER","UNIFY",
  "UNION","UNITE","UNITY","UNTIL","UPPER","UPSET","URBAN","USAGE","USUAL","UTTER",
  "VIDEO","VIGOR","VIRUS","VISIT","VITAL","VIVID","VOCAL","VOICE","WAGON","WASTE",
  "WATCH","WATER","WEAVE","WEIGH","WEIRD","WHEAT","WHERE","WHICH","WHILE","WHITE",
  "WHOLE","WHOSE","WOMAN","WOMEN","WORLD","WORRY","WORSE","WORST","WORTH","WOULD",
  "WOUND","WRITE","WRONG","WROTE","YACHT","YOUNG","YOUTH","MONEY","SPIKE","BOOST",
  "GREED","TOOLS","STOKE","TAKER",
];

for (const w of COMMON_WORDS) {
  const upper = w.toUpperCase();
  if (upper.length === 5) VALID_GUESSES.add(upper);
}

export function isValidGuess(word: string): boolean {
  return VALID_GUESSES.has(word.toUpperCase());
}
