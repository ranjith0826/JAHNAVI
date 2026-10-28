export interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  dateTag: string;
  imageUrl: string;
  category: string;
}

export interface StarWish {
  id: string;
  name: string;
  constellation: string;
  iconName: string;
  shortWish: string;
  fullMessage: string;
  color: string;
  xPercent: number;
  yPercent: number;
}

export interface SurpriseConfig {
  recipientName: string;
  subtitle: string;
  birthdayDate: string; // YYYY-MM-DD
  customMessage: string;
  memories: MemoryItem[];
}
