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
  rest?:        object;
};

export type AppTypeFruit = {
  id:   number;
  slug: string;
  name: string;
};
