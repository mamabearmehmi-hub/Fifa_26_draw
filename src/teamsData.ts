export interface Team {
  id: string;
  name: string;
  code: string;
  confederation: string;
  flagEmoji: string;
  primaryColor: string; // Tailwind hex color (e.g. #EF4444)
  secondaryColor: string; // Tailwind hex color (e.g. #FBBF24)
  fifaRank: number;
  nerdFact: string;
}

export const TEAMS_DATA: Team[] = [
  // --- HOST NATIONS (CONCACAF) ---
  {
    id: "usa",
    name: "United States",
    code: "USA",
    confederation: "CONCACAF",
    flagEmoji: "🇺🇸",
    primaryColor: "#0A3161",
    secondaryColor: "#B31942",
    fifaRank: 16,
    nerdFact: "The US co-hosts the expanded 2026 edition, with final rounds set to match massive sporting history across major stadiums."
  },
  {
    id: "mex",
    name: "Mexico",
    code: "MEX",
    confederation: "CONCACAF",
    flagEmoji: "🇲🇽",
    primaryColor: "#006847",
    secondaryColor: "#CE1126",
    fifaRank: 15,
    nerdFact: "Mexico makes history as the first nation to host matches in three editions of the World Cup (1970, 1986, 2026)."
  },
  {
    id: "can",
    name: "Canada",
    code: "CAN",
    confederation: "CONCACAF",
    flagEmoji: "🇨🇦",
    primaryColor: "#FF0000",
    secondaryColor: "#FFFFFF",
    fifaRank: 40,
    nerdFact: "Canada hosts FIFA Men's World Cup matches for the first time in history, welcoming the world to Vancouver and Toronto."
  },

  // --- UEFA (EUROPE - 16 TEAMS) ---
  {
    id: "aut",
    name: "Austria",
    code: "AUT",
    confederation: "UEFA",
    flagEmoji: "🇦🇹",
    primaryColor: "#ED2939",
    secondaryColor: "#FFFFFF",
    fifaRank: 25,
    nerdFact: "In 1954, Austria beat Switzerland 7-5 in the quarter-finals, which remains the highest-scoring single match in finals history."
  },
  {
    id: "bel",
    name: "Belgium",
    code: "BEL",
    confederation: "UEFA",
    flagEmoji: "🇧🇪",
    primaryColor: "#E30613",
    secondaryColor: "#FFE600",
    fifaRank: 8,
    nerdFact: "The 'Red Devils' are rebuilding around elite new talents, following their golden era that finished 3rd in 2018."
  },
  {
    id: "bih",
    name: "Bosnia and Herzegovina",
    code: "BIH",
    confederation: "UEFA",
    flagEmoji: "🇧🇦",
    primaryColor: "#002395",
    secondaryColor: "#FEC913",
    fifaRank: 74,
    nerdFact: "Bosnia & Herzegovina qualified for their first major FIFA tournament in 2014, making an unforgettable debut in Brazil."
  },
  {
    id: "cro",
    name: "Croatia",
    code: "CRO",
    confederation: "UEFA",
    flagEmoji: "🇭🇷",
    primaryColor: "#FF0000",
    secondaryColor: "#171796",
    fifaRank: 10,
    nerdFact: "An amazing knockout-stage specialist team that has reached the podium in three different World Cups since 1998."
  },
  {
    id: "cze",
    name: "Czechia",
    code: "CZE",
    confederation: "UEFA",
    flagEmoji: "🇨🇿",
    primaryColor: "#11457E",
    secondaryColor: "#D90F17",
    fifaRank: 36,
    nerdFact: "An iconic football nation carrying the legacy of Czechoslovakia, who reached the World Cup Finals in 1934 and 1962."
  },
  {
    id: "eng",
    name: "England",
    code: "ENG",
    confederation: "UEFA",
    flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    primaryColor: "#FFFFFF",
    secondaryColor: "#CF142B",
    fifaRank: 4,
    nerdFact: "England's legendary 1966 victory remains the birth date of modern football's ultimate 'It's Coming Home' anthem."
  },
  {
    id: "fra",
    name: "France",
    code: "FRA",
    confederation: "UEFA",
    flagEmoji: "🇫🇷",
    primaryColor: "#002395",
    secondaryColor: "#ED2939",
    fifaRank: 2,
    nerdFact: "France holds the record of back-to-back final matches in 2018 & 2022, displaying a production line of elite global soccer icons."
  },
  {
    id: "ger",
    name: "Germany",
    code: "GER",
    confederation: "UEFA",
    flagEmoji: "🇩🇪",
    primaryColor: "#000000",
    secondaryColor: "#DD0000",
    fifaRank: 13,
    nerdFact: "Germany boasts four World Cup titles and has played in the most tournament matches in history (112)."
  },
  {
    id: "ned",
    name: "Netherlands",
    code: "NED",
    confederation: "UEFA",
    flagEmoji: "🇳🇱",
    primaryColor: "#FF4F00",
    secondaryColor: "#00205B",
    fifaRank: 7,
    nerdFact: "Famous as pioneers of 'Total Football' with legendary orange jerseys, reaching the final three times."
  },
  {
    id: "nor",
    name: "Norway",
    code: "NOR",
    confederation: "UEFA",
    flagEmoji: "🇳🇴",
    primaryColor: "#EF2B2D",
    secondaryColor: "#00205B",
    fifaRank: 47,
    nerdFact: "Norway boasts an exciting contemporary squad packed with premier league blockbusters and global scoring records."
  },
  {
    id: "por",
    name: "Portugal",
    code: "POR",
    confederation: "UEFA",
    flagEmoji: "🇵🇹",
    primaryColor: "#046A38",
    secondaryColor: "#DA291C",
    fifaRank: 6,
    nerdFact: "Portugal's best placement was 3rd in 1966, sparked by the legendary Eusébio scoring nine tournament goals."
  },
  {
    id: "sco",
    name: "Scotland",
    code: "SCO",
    confederation: "UEFA",
    flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    primaryColor: "#002D62",
    secondaryColor: "#FFFFFF",
    fifaRank: 39,
    nerdFact: "Scotland's traveling 'Tartan Army' is universally celebrated as some of the most loud, fun, and colorful supporters on Earth."
  },
  {
    id: "esp",
    name: "Spain",
    code: "ESP",
    confederation: "UEFA",
    flagEmoji: "🇪🇸",
    primaryColor: "#C1272D",
    secondaryColor: "#FFCC00",
    fifaRank: 3,
    nerdFact: "Spain conquered the world in 2010 by mastering their signature tiki-taka, high-tempo short passing model."
  },
  {
    id: "swe",
    name: "Sweden",
    code: "SWE",
    confederation: "UEFA",
    flagEmoji: "🇸🇪",
    primaryColor: "#006AA7",
    secondaryColor: "#FECC02",
    fifaRank: 28,
    nerdFact: "Sweden hosted and advanced to the final of the 1958 world cup, which launched a young 17-year-old Pelé to fame."
  },
  {
    id: "sui",
    name: "Switzerland",
    code: "SUI",
    confederation: "UEFA",
    flagEmoji: "🇨🇭",
    primaryColor: "#DA291C",
    secondaryColor: "#FFFFFF",
    fifaRank: 19,
    nerdFact: "In 2006, Switzerland achieved the singular record of being eliminated without conceding a single goals in normal play."
  },
  {
    id: "tur",
    name: "Türkiye",
    code: "TUR",
    confederation: "UEFA",
    flagEmoji: "🇹🇷",
    primaryColor: "#E30A17",
    secondaryColor: "#FFFFFF",
    fifaRank: 40,
    nerdFact: "Turkey secured an stunning bronze medal at the 2002 tournament, including scoring the fastest-ever finals goal after 10.8 seconds."
  },

  // --- CONMEBOL (SOUTH AMERICA - 6 TEAMS) ---
  {
    id: "arg",
    name: "Argentina",
    code: "ARG",
    confederation: "CONMEBOL",
    flagEmoji: "🇦🇷",
    primaryColor: "#74ACDF",
    secondaryColor: "#F6B426",
    fifaRank: 1,
    nerdFact: "Three-time world champions who won the legendary 2022 cup in Qatar, widely deemed the most thrilling final of all time."
  },
  {
    id: "bra",
    name: "Brazil",
    code: "BRA",
    confederation: "CONMEBOL",
    flagEmoji: "🇧🇷",
    primaryColor: "#FEC913",
    secondaryColor: "#1D9C3E",
    fifaRank: 5,
    nerdFact: "Brazil is the most decorated team in world cup history, holding a stunning five trophies, and is the only nation to enter every layout."
  },
  {
    id: "col",
    name: "Colombia",
    code: "COL",
    confederation: "CONMEBOL",
    flagEmoji: "🇨🇴",
    primaryColor: "#FCD116",
    secondaryColor: "#003893",
    fifaRank: 12,
    nerdFact: "At Chile 1962, Colombia recorded the first direct 'Olympic goals' (scored straight from a corner kick) in tournament history."
  },
  {
    id: "ecu",
    name: "Ecuador",
    code: "ECU",
    confederation: "CONMEBOL",
    flagEmoji: "🇪🇨",
    primaryColor: "#FFCC00",
    secondaryColor: "#003399",
    fifaRank: 31,
    nerdFact: "La Tri is famous for dynamic physical acceleration and highly disciplined defensive structure, based on high-altitude home training."
  },
  {
    id: "par",
    name: "Paraguay",
    code: "PAR",
    confederation: "CONMEBOL",
    flagEmoji: "🇵🇾",
    primaryColor: "#D91414",
    secondaryColor: "#003893",
    fifaRank: 56,
    nerdFact: "Known for their incredibly ferocious defensive resilience, Paraguay progressed to the Quarter-Finals in 2010."
  },
  {
    id: "uru",
    name: "Uruguay",
    code: "URU",
    confederation: "CONMEBOL",
    flagEmoji: "🇺🇾",
    primaryColor: "#0081C6",
    secondaryColor: "#FCD116",
    fifaRank: 11,
    nerdFact: "Uruguay won the first-ever World Cup as hosts in 1930 and repeated their spectacular success by winning in Brazil in 1950."
  },

  // --- CONCACAF (NORTH AMERICA - 3 TEAMS) ---
  {
    id: "cuw",
    name: "Curaçao",
    code: "CUW",
    confederation: "CONCACAF",
    flagEmoji: "🇨🇼",
    primaryColor: "#002B7F",
    secondaryColor: "#F9E814",
    fifaRank: 86,
    nerdFact: "The Caribbean nation is emerging rapidly with high-caliber diaspora players, targeting their first major tournament spot in 2026."
  },
  {
    id: "hai",
    name: "Haiti",
    code: "HAI",
    confederation: "CONCACAF",
    flagEmoji: "🇭🇹",
    primaryColor: "#00209F",
    secondaryColor: "#D21034",
    fifaRank: 85,
    nerdFact: "Haiti made a historic qualification for West Germany 1974, scoring against the legendary Italian goalkeeper Dino Zoff."
  },
  {
    id: "pan",
    name: "Panama",
    code: "PAN",
    confederation: "CONCACAF",
    flagEmoji: "🇵🇦",
    primaryColor: "#0A3161",
    secondaryColor: "#D21034",
    fifaRank: 43,
    nerdFact: "Panama qualified for their first World Cup in 2018, which triggered a national holiday of absolute celebration."
  },

  // --- CAF (AFRICA - 10 TEAMS) ---
  {
    id: "alg",
    name: "Algeria",
    code: "ALG",
    confederation: "CAF",
    flagEmoji: "🇩🇿",
    primaryColor: "#006633",
    secondaryColor: "#FF0000",
    fifaRank: 44,
    nerdFact: "Algeria scored one of the greatest tournament shocks in history by defeating West Germany 2-1 in their 1982 layout."
  },
  {
    id: "cpv",
    name: "Cabo Verde",
    code: "CPV",
    confederation: "CAF",
    flagEmoji: "🇨🇻",
    primaryColor: "#002A8F",
    secondaryColor: "#E30A17",
    fifaRank: 65,
    nerdFact: "Affectionately nicknamed the Tubarões Azuis (Blue Sharks), the island nation boasts one of the sport's highest punch-above-weight ratios."
  },
  {
    id: "cod",
    name: "Congo DR",
    code: "COD",
    confederation: "CAF",
    flagEmoji: "🇨🇩",
    primaryColor: "#007FFF",
    secondaryColor: "#FCD116",
    fifaRank: 61,
    nerdFact: "Competing as Zaire in 1974, they became the first Sub-Saharan African nation to qualify for the World Cup finals."
  },
  {
    id: "civ",
    name: "Côte d'Ivoire",
    code: "CIV",
    confederation: "CAF",
    flagEmoji: "🇨🇮",
    primaryColor: "#F77F00",
    secondaryColor: "#009E60",
    fifaRank: 38,
    nerdFact: "Led by legendary striker Didier Drogba, Ivory Coast famously qualified for Germany 2006 to inspire unity at home."
  },
  {
    id: "egy",
    name: "Egypt",
    code: "EGY",
    confederation: "CAF",
    flagEmoji: "🇪🇬",
    primaryColor: "#C8102E",
    secondaryColor: "#FFD100",
    fifaRank: 37,
    nerdFact: "Egypt was the first-ever African country to participate in a World Cup, taking part in the second-ever edition in Italy in 1934."
  },
  {
    id: "gha",
    name: "Ghana",
    code: "GHA",
    confederation: "CAF",
    flagEmoji: "🇬🇭",
    primaryColor: "#EF4444",
    secondaryColor: "#FBBF24",
    fifaRank: 64,
    nerdFact: "The 'Black Stars' of 2010 were inches away from becoming the first-ever African semi-finalist in history."
  },
  {
    id: "mar",
    name: "Morocco",
    code: "MAR",
    confederation: "CAF",
    flagEmoji: "🇲🇦",
    primaryColor: "#C1272D",
    secondaryColor: "#006233",
    fifaRank: 14,
    nerdFact: "In 2022, Morocco became the first African and Arab nation to ever reach a Men's World Cup Semifinals."
  },
  {
    id: "sen",
    name: "Senegal",
    code: "SEN",
    confederation: "CAF",
    flagEmoji: "🇸🇳",
    primaryColor: "#008543",
    secondaryColor: "#FCD116",
    fifaRank: 17,
    nerdFact: "On their 2002 debut, Senegal stunned defending champions France in the opening game and advanced to the last 8."
  },
  {
    id: "rsa",
    name: "South Africa",
    code: "RSA",
    confederation: "CAF",
    flagEmoji: "🇿🇦",
    primaryColor: "#007A4B",
    secondaryColor: "#FFB612",
    fifaRank: 59,
    nerdFact: "Hosts of the iconic 2010 World Cup, memorable for the spectacular vuvuzela horns and Siphiwe Tshabalala's opening thunderbolt score."
  },
  {
    id: "tun",
    name: "Tunisia",
    code: "TUN",
    confederation: "CAF",
    flagEmoji: "🇹🇳",
    primaryColor: "#E70013",
    secondaryColor: "#FFFFFF",
    fifaRank: 41,
    nerdFact: "In 1978, Tunisia recorded the first-ever match victory by an African side, beating Mexico 3-1."
  },

  // --- AFC (ASIA - 9 TEAMS) ---
  {
    id: "aus",
    name: "Australia",
    code: "AUS",
    confederation: "AFC",
    flagEmoji: "🇦🇺",
    primaryColor: "#0A1172",
    secondaryColor: "#FFCD00",
    fifaRank: 24,
    nerdFact: "The Socceroos made their historic transition to the Asian Football Confederation in 2006 for tougher challenges."
  },
  {
    id: "irn",
    name: "IR Iran",
    code: "IRN",
    confederation: "AFC",
    flagEmoji: "🇮🇷",
    primaryColor: "#239E46",
    secondaryColor: "#DA121A",
    fifaRank: 20,
    nerdFact: "The national team has a formidable record of continental dominance and is renowned for elite team cohesion."
  },
  {
    id: "irq",
    name: "Iraq",
    code: "IRQ",
    confederation: "AFC",
    flagEmoji: "🇮🇶",
    primaryColor: "#007A3D",
    secondaryColor: "#D21034",
    fifaRank: 58,
    nerdFact: "Affectionately called the Lions of Mesopotamia, Iraq carries an inspirational, high-quality tournament legacy."
  },
  {
    id: "jpn",
    name: "Japan",
    code: "JPN",
    confederation: "AFC",
    flagEmoji: "🇯🇵",
    primaryColor: "#000080",
    secondaryColor: "#FFFFFF",
    fifaRank: 18,
    nerdFact: "The Samurai Blue are famous globally for outstanding sporting courtesy and leaving transition locker rooms in immaculate perfection."
  },
  {
    id: "jor",
    name: "Jordan",
    code: "JOR",
    confederation: "AFC",
    flagEmoji: "🇯🇴",
    primaryColor: "#007A3D",
    secondaryColor: "#E30A17",
    fifaRank: 68,
    nerdFact: "Jordan generated amazing global admiration by reaching their first-ever Asian Cup Final, proving their tactical class."
  },
  {
    id: "kor",
    name: "Korea Republic",
    code: "KOR",
    confederation: "AFC",
    flagEmoji: "🇰🇷",
    primaryColor: "#CD2E3A",
    secondaryColor: "#051C42",
    fifaRank: 23,
    nerdFact: "The most successful Asian country to date, famously reaching the semi-finals on home soil during 2002."
  },
  {
    id: "qat",
    name: "Qatar",
    code: "QAT",
    confederation: "AFC",
    flagEmoji: "🇶🇦",
    primaryColor: "#8A1538",
    secondaryColor: "#FFFFFF",
    fifaRank: 35,
    nerdFact: "Hosts of the 2022 tournament and back-to-back AFC Asian Cup champions, retaining their continental crown in style."
  },
  {
    id: "ksa",
    name: "Saudi Arabia",
    code: "KSA",
    confederation: "AFC",
    flagEmoji: "🇸🇦",
    primaryColor: "#006C35",
    secondaryColor: "#FFFFFF",
    fifaRank: 56,
    nerdFact: "Green Falcons triggered one of history's deepest shocks by beating future champions Argentina in their 2022 opener."
  },
  {
    id: "uzb",
    name: "Uzbekistan",
    code: "UZB",
    confederation: "AFC",
    flagEmoji: "🇺🇿",
    primaryColor: "#0099B5",
    secondaryColor: "#FFFFFF",
    fifaRank: 66,
    nerdFact: "The White Wolves are highly rated for robust physical structure and tactical disciplines, with a rich Asian youth record."
  },

  // --- OFC (OCEANIA - 1 TEAM) ---
  {
    id: "nzl",
    name: "New Zealand",
    code: "NZL",
    confederation: "OFC",
    flagEmoji: "🇳🇿",
    primaryColor: "#00247D",
    secondaryColor: "#FFFFFF",
    fifaRank: 78,
    nerdFact: "The legendary New Zealand team of 2010 finished the World Cup undefeated, drawing against world champions Italy."
  }
];
