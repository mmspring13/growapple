export type DbFruit = {
  id:           number;
  parentage:    number[];
  opening_year: number;
  created_at:   number;
};

export type DbFruitType = {
  id:         number;
  name:       string;
  slug:       string;
  created_at: number;
};

export type DbFruitMeta = {
  id:           number;
  slug:         string;
  created_at:   number;
  name:         string;
  type:         number;
  images?:      string[];
  fruit_id:     number;
  description:  string;
  rest?:        object;
};
