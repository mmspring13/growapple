export interface Fruit {
  id: string;
  name: string;
  slug: string;
  opening_year?: number;
  short_description?: string;
  parentage?: {
    id: number;
    name: string;
  }[];
  children?: {
    id: number;
    name: string;
  }[];
  rest?: {
    color?: string;
  };
  avatar?: {
    url: string;
  };
}
