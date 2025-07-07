
export interface Story {
  id: string;
  title: string;
  story: string;
  choices: Record<string, string>;
  ageGroup: string;
  createdAt: string;
  imageUrl?: string;
}
