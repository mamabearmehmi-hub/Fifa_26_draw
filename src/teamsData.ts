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
  // --- NORTH AMERICA (CONCACAF) ---
  {
    id: "usa",
    name: "United States",
    code: "USA",
    confederation: "CONCACAF",
    flagEmoji: "🇺🇸",
    primaryColor: "#0A3161",
    secondaryColor: "#B31942",
    fifaRank: 16,
    nerdFact: "The US hosted the 1994 World Cup, which still holds the record for highest average attendance in tournament history."
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
    nerdFact: "Mexico is the first nation to host three World Cup editions (1970, 1986, and 2026), cementing its iconic stadium, Estadio Azteca, into football royalty."
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
    nerdFact: "Canada scoring their first-ever men's World Cup goal in 2022 was netted by Alphonso Davies just 68 seconds into the match against Croatia."
  },
  {
    id: "crc",
    name: "Costa Rica",
    code: "CRC",
    confederation: "CONCACAF",
    flagEmoji: "🇨🇷",
    primaryColor: "#1155cc",
    secondaryColor: "#EF4444",
    fifaRank: 52,
    nerdFact: "In 2014, Los Ticos topped a 'Group of Death' containing Uruguay, Italy, and England, eventually going all the way to the Quarter-Finals."
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
    nerdFact: "When Panama qualified for their first World Cup in 2018, the country’s President declared the following day a national holiday."
  },
  {
    id: "jam",
    name: "Jamaica",
    code: "JAM",
    confederation: "CONCACAF",
    flagEmoji: "🇯🇲",
    primaryColor: "#10B981",
    secondaryColor: "#FBBF24",
    fifaRank: 55,
    nerdFact: "Known as the Reggae Boyz, they qualified for France 1998, with Theodore Whitmore scoring both goals in their historic 2-1 win over Japan."
  },

  // --- SOUTH AMERICA (CONMEBOL) ---
  {
    id: "arg",
    name: "Argentina",
    code: "ARG",
    confederation: "CONMEBOL",
    flagEmoji: "🇦🇷",
    primaryColor: "#74ACDF",
    secondaryColor: "#F6B426",
    fifaRank: 1,
    nerdFact: "Argentina qualified for the inaugural 1930 final, and their match balls were so disputed they used one of Argentine design in the first half and another of Uruguayan design in the second!"
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
    nerdFact: "Seleção is the only country to have played in every single FIFA World Cup and holds the record for most tournament victories with five titles."
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
    nerdFact: "Uruguay has won the World Cup twice (1930 and 1950) but wears four stars on their crest, recognizing their two Olympic gold medals from the 1920s as official world titles."
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
    nerdFact: "At Chile 1962, Colombia recorded the only direct 'Olympic goal' (scored straight from a corner kick) in World Cup history, past legendary Soviet keeper Lev Yashin."
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
    nerdFact: "Ecuadorian forward Enner Valencia scored six consecutive World Cup goals for his country across the 2014 and 2022 tournaments."
  },
  {
    id: "chi",
    name: "Chile",
    code: "CHI",
    confederation: "CONMEBOL",
    flagEmoji: "🇨🇱",
    primaryColor: "#0039A6",
    secondaryColor: "#D52B1E",
    fifaRank: 42,
    nerdFact: "Chile hosted the 1962 World Cup, featuring the infamous 'Battle of Santiago' against Italy, one of the most physical matches ever recorded."
  },
  {
    id: "per",
    name: "Peru",
    code: "PER",
    confederation: "CONMEBOL",
    flagEmoji: "🇵🇪",
    primaryColor: "#D91414",
    secondaryColor: "#FFFFFF",
    fifaRank: 36,
    nerdFact: "Peru's iconic diagonal red sash jersey was first worn in 1936 and is universally celebrated as one of the most beautiful football kits ever made."
  },

  // --- EUROPE (UEFA) ---
  {
    id: "fra",
    name: "France",
    code: "FRA",
    confederation: "UEFA",
    flagEmoji: "🇫🇷",
    primaryColor: "#002395",
    secondaryColor: "#ED2939",
    fifaRank: 2,
    nerdFact: "Just Fontaine holds the historic record for most goals scored in a single World Cup tournament, netting a spectacular 13 goals for France in 1958."
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
    nerdFact: "England's 1966 victory remains the only time a hat-trick was scored in a World Cup Final (by Geoff Hurst), until Kylian Mbappé matched it in 2022."
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
    nerdFact: "La Roja won the 2010 World Cup in South Africa despite losing their opening match 1-0 to Switzerland, proving slow starts can still lead to historic triumphs."
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
    nerdFact: "Germany's Miroslav Klose is the all-time leading goal scorer in World Cup history, with 16 goals across four tournaments (2002–2014)."
  },
  {
    id: "ita",
    name: "Italy",
    code: "ITA",
    confederation: "UEFA",
    flagEmoji: "🇮🇹",
    primaryColor: "#0066BC",
    secondaryColor: "#FFFFFF",
    fifaRank: 9,
    nerdFact: "In the 1930s, Italy won consecutive World Cups under coach Vittorio Pozzo, who pioneered the 'Metodo' tactical system, which utilized early man-marking."
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
    nerdFact: "In 1966, Portuguese legend Eusébio won the Golden Boot by scoring 9 goals, which included 4 goals in a single match to mount a historic comeback against North Korea."
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
    nerdFact: "The Oranje have reached the World Cup Final three times (1974, 1978, and 2010) without ever winning, the most of any nation."
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
    nerdFact: "Belgium's golden generation achieved their best-ever finish in 2018, securing third place after defeating England in the bronze medal playoff."
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
    nerdFact: "With a population of just 4 million, Croatia reached the 2018 final and the 2022 semi-finals, cementing themselves as ultimate knockout-stage survival specialists."
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
    nerdFact: "In 2006, Switzerland became the first and only team in World Cup history to be eliminated from a tournament without conceding a single goals in open play."
  },
  {
    id: "den",
    name: "Denmark",
    code: "DEN",
    confederation: "UEFA",
    flagEmoji: "🇩🇰",
    primaryColor: "#C60C30",
    secondaryColor: "#FFFFFF",
    fifaRank: 21,
    nerdFact: "Known as 'Danish Dynamite', the spectacular 1986 team blew through the group stage but were famous for their dual-split white/red Hummel jerseys."
  },
  {
    id: "aut",
    name: "Austria",
    code: "AUT",
    confederation: "UEFA",
    flagEmoji: "🇦🇹",
    primaryColor: "#ED2939",
    secondaryColor: "#FFFFFF",
    fifaRank: 25,
    nerdFact: "In 1954, Austria beat Switzerland 7-5 in the quarter-finals, still the highest-scoring single game in FIFA World Cup finals history."
  },
  {
    id: "tur",
    name: "Turkey",
    code: "TUR",
    confederation: "UEFA",
    flagEmoji: "🇹🇷",
    primaryColor: "#E30A17",
    secondaryColor: "#FFFFFF",
    fifaRank: 40,
    nerdFact: "Turkey’s Hakan Şükür holds the record for the fastest goal in World Cup history, scoring against South Korea in 2002 after only 10.8 seconds."
  },
  {
    id: "pol",
    name: "Poland",
    code: "POL",
    confederation: "UEFA",
    flagEmoji: "🇵🇱",
    primaryColor: "#DC143C",
    secondaryColor: "#FFFFFF",
    fifaRank: 30,
    nerdFact: "Poland enjoyed a golden era in 1974 and 1982, finishing 3rd in the world twice, powered by legends Grzegorz Lato and Zbigniew Boniek."
  },
  {
    id: "ukr",
    name: "Ukraine",
    code: "UKR",
    confederation: "UEFA",
    flagEmoji: "🇺🇦",
    primaryColor: "#0057B7",
    secondaryColor: "#FFD700",
    fifaRank: 22,
    nerdFact: "In their debut World Cup appearance in 2006, led by legendary striker Andriy Shevchenko, Ukraine defied odds to reach the Quarter-Finals."
  },
  {
    id: "hun",
    name: "Hungary",
    code: "HUN",
    confederation: "UEFA",
    flagEmoji: "🇭🇺",
    primaryColor: "#436F4D",
    secondaryColor: "#CD2A3E",
    fifaRank: 27,
    nerdFact: "The 'Mighty Magyars' of 1954 scored 27 goals in just 5 games, including a 9-0 beating of South Korea, establishing a record goal-scoring average."
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
    nerdFact: "Scotland has qualified for 8 World Cups but holds the record for the most tournament appearances without ever advancing past the first round."
  },

  // --- AFRICA (CAF) ---
  {
    id: "mar",
    name: "Morocco",
    code: "MAR",
    confederation: "CAF",
    flagEmoji: "🇲🇦",
    primaryColor: "#C1272D",
    secondaryColor: "#006233",
    fifaRank: 14,
    nerdFact: "In 2022, Morocco became the first African and Arab nation to ever reach the Semifinals of a FIFA Men's World Cup."
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
    nerdFact: "In their debut in 2002, Senegal shocked reigning champions France 1-0 in the tournament's opening game and marched all the way to the Quarter-Finals."
  },
  {
    id: "nga",
    name: "Nigeria",
    code: "NGA",
    confederation: "CAF",
    flagEmoji: "🇳🇬",
    primaryColor: "#008751",
    secondaryColor: "#FFFFFF",
    fifaRank: 28,
    nerdFact: "The Super Eagles are famous for exciting crowds and wearing extremely fashionable kits, notably their highly sought-after zig-zag jersey from 2018."
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
    nerdFact: "Egypt was the very first African nation to play in a World Cup, taking part in the second-ever tournament in Italy back in 1934."
  },
  {
    id: "civ",
    name: "Ivory Coast",
    code: "CIV",
    confederation: "CAF",
    flagEmoji: "🇨🇮",
    primaryColor: "#F77F00",
    secondaryColor: "#009E60",
    fifaRank: 38,
    nerdFact: "When Ivory Coast qualified for Germany 2006, icon Didier Drogba famously fell to his knees on live TV to beg warring factions to declare a ceasefire, successfully helping halt a civil war."
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
    nerdFact: "In 2010, the Black Stars were a controversial Luis Suarez handball on the goal line away from becoming the first African semi-finalists."
  },
  {
    id: "alg",
    name: "Algeria",
    code: "ALG",
    confederation: "CAF",
    flagEmoji: "🇩🇿",
    primaryColor: "#006633",
    secondaryColor: "#FF0000",
    fifaRank: 44,
    nerdFact: "In 1982, Algeria beat West Germany in one of the tournament's biggest upsets, leading to the infamous 'Disgrace of Gijón' match between West Germany and Austria."
  },
  {
    id: "cmr",
    name: "Cameroon",
    code: "CMR",
    confederation: "CAF",
    flagEmoji: "🇨🇲",
    primaryColor: "#007A5E",
    secondaryColor: "#FCD116",
    fifaRank: 49,
    nerdFact: "At age 42, Cameroon legend Roger Milla became the oldest player to score in a World Cup during the 1994 United States tournament."
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
    nerdFact: "In 1978, Tunisia made history by defeating Mexico 3-1, recording the first-ever victory by an African team at a World Cup finals matches."
  },

  // --- ASIA (AFC) ---
  {
    id: "jpn",
    name: "Japan",
    code: "JPN",
    confederation: "AFC",
    flagEmoji: "🇯🇵",
    primaryColor: "#000080",
    secondaryColor: "#FFFFFF",
    fifaRank: 18,
    nerdFact: "Known as the Samurai Blue, Japan has a reputation for exemplary sportsmanship, with players leaving pristine locker rooms and fans cleaning stadium stands after matches."
  },
  {
    id: "kor",
    name: "South Korea",
    code: "KOR",
    confederation: "AFC",
    flagEmoji: "🇰🇷",
    primaryColor: "#CD2E3A",
    secondaryColor: "#051C42",
    fifaRank: 23,
    nerdFact: "South Korea has qualified for 11 World Cups—the most of any Asian country—and famously finished 4th as co-hosts in 2002."
  },
  {
    id: "aus",
    name: "Australia",
    code: "AUS",
    confederation: "AFC",
    flagEmoji: "🇦🇺",
    primaryColor: "#0A1172",
    secondaryColor: "#FFCD00",
    fifaRank: 24,
    nerdFact: "The Socceroos made their historic move from OFC to AFC in 2006 to seek stronger competition, proceeding to reach the Round of 16 in Germany that same year."
  },
  {
    id: "irn",
    name: "Iran",
    code: "IRN",
    confederation: "AFC",
    flagEmoji: "🇮🇷",
    primaryColor: "#239E46",
    secondaryColor: "#DA121A",
    fifaRank: 20,
    nerdFact: "In 1998, their match against the USA in France (the 'Most Politically Charged Match in History') saw both teams posing for a unified joint team photo before kick-off."
  },
  {
    id: "sau",
    name: "Saudi Arabia",
    code: "KSA",
    confederation: "AFC",
    flagEmoji: "🇸🇦",
    primaryColor: "#006C35",
    secondaryColor: "#FFFFFF",
    fifaRank: 56,
    nerdFact: "Saudi Arabia pull off one of the greatest upsets in modern sporting history by defeating Argentina 2-1 in their opening game of the 2022 World Cup."
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
    nerdFact: "Qatar hosted the 2022 World Cup, featuring fully air-conditioned stadiums and a final which is widely considered the greatest football match of all time."
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
    nerdFact: "The White Wolves are highly tipped to make their debut in 2026, known for a technically disciplined golden generation of youth prospects."
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
    nerdFact: "Iraq's singular World Cup appearance was in Mexico 1986. They are affectionately known as the Lions of Mesopotamia."
  },

  // --- OCEANIA (OFC) ---
  {
    id: "nzl",
    name: "New Zealand",
    code: "NZL",
    confederation: "OFC",
    flagEmoji: "🇳🇿",
    primaryColor: "#00247D",
    secondaryColor: "#FFFFFF",
    fifaRank: 78,
    nerdFact: "In South Africa 2010, the All Whites were the only undefeated team in the tournament after drawing all three of their group games against Italy, Paraguay, and Slovakia."
  }
];
