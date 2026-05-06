export type StudioPackage = {
  id: string;
  title: string;
  price: number;
  description: string;
  featured?: boolean;
};

export type StudioDeposit = {
  enabled: boolean;
  mode: "percent" | "fixed";
  value: number;
};

export type Studio = {
  id: string;
  slug: string;
  name: string;
  category: string;
  area: string;
  address: string;
  description: string;
  intro?: string;
  phone: string;
  tags: string[];
  priceFrom: number;
  rating: number;
  reviewCount: number;
  paymentCount: number;
  distanceKm: number;
  photoCount: number;
  travelAvailable: boolean;
  packages: StudioPackage[];
  deposit: StudioDeposit;
};
