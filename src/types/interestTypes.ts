export type Interest = {
  id: number;
  topic: string;
};

export type Interests = Interest[];

export type InterestMap = { [key: string]: Interest };
