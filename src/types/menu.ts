export interface MenuManagementItem {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: {
    _id: string;
    name: {
      en: string;
      ar: string;
    };
  };
  price: number;
  isAvailable: boolean;
}

export interface CategoryItem {
  _id: string;
  name: {
    en: string;
    ar: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
