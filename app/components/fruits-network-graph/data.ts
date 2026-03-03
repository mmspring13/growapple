export type AppFruit = {
  id:           number;
  opening_year: number;
  slug:         string;
  name:         string;
  parentage:    number[];
  children:     number[];
  type:         number;
  description?:  string;
  short_description?:  string;
  images?:      string[];
  rest?:        {
    origin?: string;
    color?: string;
    [key: string]: any;
  };
};

export type AppTypeFruit = {
  id:   number;
  slug: string;
  name: string;
};

export const APPLE_TYPE: AppTypeFruit = { id: 1, slug: 'apple', name: 'Apple' };

export const APPLES: AppFruit[] = [
  {
    id: 1,
    slug: "golden-delicious",
    name: "Golden Delicious",
    opening_year: 1890,
    description: "A large, yellowish-green skinned cultivar and very sweet to the taste. It is prone to bruising and shriveling, so it needs careful handling and storage.",
    parentage: [],
    children: [5, 19, 13, 11],
    type: 1,
    rest: {
      origin: "West Virginia, USA",
      color: "#E6E65C"
    }
  },
  {
    id: 2,
    slug: "red-delicious",
    name: "Red Delicious",
    opening_year: 1872,
    description: "One of the most famous American apples. Known for its deep red color and tall, conical shape. The flavor is mild and sweet.",
    parentage: [],
    children: [7, 9],
    type: 1,
    rest: {
      origin: "Iowa, USA",
      color: "#D92525"
    }
  },
  {
    id: 3,
    slug: "kidds-orange-red",
    name: "Kidd's Orange Red",
    opening_year: 1924,
    description: "A dessert apple with a complex flavor, aromatic and sweet.",
    parentage: [4, 2],
    children: [5],
    type: 1,
    rest: {
      origin: "New Zealand",
      color: "#D65C25"
    }
  },
  {
    id: 4,
    slug: "coxs-orange-pippin",
    name: "Cox's Orange Pippin",
    opening_year: 1825,
    description: "Highly regarded for its excellent flavor and attractive appearance. It is the classic English apple.",
    parentage: [],
    children: [3],
    type: 1,
    rest: {
      origin: "United Kingdom",
      color: "#E07A38"
    }
  },
  {
    id: 5,
    slug: "gala",
    name: "Gala",
    opening_year: 1934,
    description: "A cross between Kidd's Orange Red and Golden Delicious. It is crisp, juicy, and very sweet.",
    parentage: [3, 1],
    children: [17, 18],
    type: 1,
    rest: {
      origin: "New Zealand",
      color: "#F26B3A"
    }
  },
  {
    id: 6,
    slug: "ralls-janet",
    name: "Ralls Janet",
    opening_year: 1800,
    description: "An old American apple known for its late blooming, which helps it avoid spring frosts.",
    parentage: [],
    children: [7],
    type: 1,
    rest: {
      origin: "Virginia, USA",
      color: "#C9C555"
    }
  },
  {
    id: 7,
    slug: "fuji",
    name: "Fuji",
    opening_year: 1962,
    description: "Developed in Japan, it is a cross between Red Delicious and Ralls Janet. It is large, crisp, and very sweet.",
    parentage: [2, 6],
    children: [],
    type: 1,
    rest: {
      origin: "Japan",
      color: "#E85D5D"
    }
  },
  {
    id: 8,
    slug: "mcintosh",
    name: "McIntosh",
    opening_year: 1811,
    description: "The national apple of Canada. It has a red and green skin, a tart flavor, and tender white flesh.",
    parentage: [],
    children: [9, 21],
    type: 1,
    rest: {
      origin: "Ontario, Canada",
      color: "#D93838"
    }
  },
  {
    id: 9,
    slug: "empire",
    name: "Empire",
    opening_year: 1966,
    description: "A cross between McIntosh and Red Delicious. It is excellent for eating fresh and for salads.",
    parentage: [8, 2],
    children: [],
    type: 1,
    rest: {
      origin: "New York, USA",
      color: "#B82E2E"
    }
  },
  {
    id: 10,
    slug: "jonathan",
    name: "Jonathan",
    opening_year: 1826,
    description: "A classic American apple, widely used for baking and eating fresh. It is tart and spicy.",
    parentage: [],
    children: [11],
    type: 1,
    rest: {
      origin: "New York, USA",
      color: "#D13030"
    }
  },
  {
    id: 11,
    slug: "jonagold",
    name: "Jonagold",
    opening_year: 1953,
    description: "A cross between Golden Delicious and Jonathan. It is a large apple with a thin skin and a sweet-tart flavor.",

    parentage: [1, 10],
    children: [],
    type: 1,
    rest: {
      origin: "New York, USA",
      color: "#E3A034"
    }
  },
  {
    id: 12,
    slug: "lady-williams",
    name: "Lady Williams",
    opening_year: 1935,
    description: "An Australian apple variety, likely a chance seedling. It is one of the parents of Pink Lady.",
    parentage: [],
    children: [13],
    type: 1,
    rest: {
      origin: "Australia",
      color: "#D64545"
    }
  },
  {
    id: 13,
    slug: "pink-lady",
    name: "Pink Lady (Cripps Pink)",
    opening_year: 1973,
    description: "A cross between Golden Delicious and Lady Williams. Known for its distinctive pink color and effervescent flavor.",
    parentage: [1, 12],
    children: [],
    type: 1,
    rest: {
      origin: "Australia",
      color: "#FF69B4"
    }
  },
  {
    id: 14,
    slug: "honeycrisp",
    name: "Honeycrisp",
    opening_year: 1974,
    description: "Developed by the University of Minnesota. Famous for its explosive crispness and balanced sweet-tart flavor.",
    parentage: [15],
    children: [],
    type: 1,
    rest: {
      origin: "Minnesota, USA",
      color: "#E84A4A"
    }
  },
  {
    id: 15,
    slug: "keepsake",
    name: "Keepsake",
    opening_year: 1978,
    description: "A parent of Honeycrisp. Known for its hardness and ability to keep well in storage.",
    parentage: [],
    children: [14],
    type: 1,
    rest: {
      origin: "Minnesota, USA",
      color: "#B53333"
    }
  },
  {
    id: 16,
    slug: "braeburn",
    name: "Braeburn",
    opening_year: 1952,
    description: "A firm apple with a spicy-sweet flavor. Excellent for cooking.",
    parentage: [],
    children: [17, 18],
    type: 1,
    rest: {
      origin: "New Zealand",
      color: "#D45535"
    }
  },
  {
    id: 17,
    slug: "jazz",
    name: "Jazz",
    opening_year: 1985,
    description: "A cross between Royal Gala and Braeburn. Crunchy and tangy-sweet.",
    parentage: [5, 16],
    children: [],
    type: 1,
    rest: {
      origin: "New Zealand",
      color: "#E04F38"
    }
  },
  {
    id: 18,
    slug: "envy",
    name: "Envy",
    opening_year: 2008,
    description: "Sister to Jazz, also a Gala x Braeburn cross. Very sweet and low in acidity.",
    parentage: [5, 16],
    children: [],
    type: 1,
    rest: {
      origin: "New Zealand",
      color: "#D94535"
    }
  },
  {
    id: 19,
    slug: "mutsu",
    name: "Mutsu (Crispin)",
    opening_year: 1948,
    description: "A cross between Golden Delicious and Indo. Very large, green to yellow, with a sweet, sharp flavor.",
    parentage: [1, 20],
    children: [],
    type: 1,
    rest: {
      origin: "Japan",
      color: "#D4D955"
    }
  },
  {
    id: 20,
    slug: "indo",
    name: "Indo",
    opening_year: 1930,
    description: "A Japanese variety, parent of Mutsu.",
    parentage: [],
    children: [19],
    type: 1,
    rest: {
      origin: "Japan",
      color: "#C2C744"
    }
  },
  {
    id: 21,
    slug: "macoun",
    name: "Macoun",
    opening_year: 1923,
    description: "A cross between McIntosh and Jersey Black. Known for its high quality dessert flavor.",
    parentage: [8, 22],
    children: [],
    type: 1,
    rest: {
      origin: "New York, USA",
      color: "#8A2323"
    }
  },
  {
    id: 22,
    slug: "jersey-black",
    name: "Jersey Black",
    opening_year: 1817,
    description: "An old American variety, very dark red skin.",
    parentage: [],
    children: [21],
    type: 1,
    rest: {
      origin: "New Jersey, USA",
      color: "#4A1010"
    }
  }
];

export function getAppleBySlug(slug: string): AppFruit | undefined {
  return APPLES.find((a) => a.slug === slug);
}

export function getApplesByIds(ids: number[]): AppFruit[] {
  return APPLES.filter((a) => ids.includes(a.id));
}
