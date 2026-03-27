export interface Fruit {
  id: string;
  name: string;
  slug: string;
  opening_year?: number;
  short_description?: string;
  color: string;
  parentage?: {
    id: number;
    name: string;
  }[];
  children?: {
    id: number;
    name: string;
  }[];
  avatar?: {
    url: string;
  };
}
