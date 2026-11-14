import type { Href } from "expo-router";

export interface HeroSlideItem {
  id: string;
  tag?: string;
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  image: string;
  route: Href;
  category?: string;
}

export interface HeroSlideProps {
  slide: HeroSlideItem;
  width: number;
  onPress: () => void;
}

export interface HeroSliderProps {
  slides?: HeroSlideItem[];
  autoPlayInterval?: number;
}
