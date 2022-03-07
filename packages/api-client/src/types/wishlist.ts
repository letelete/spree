export type WishedProduct = {
  wishedProductId: string;
  variantId: string;
  name: string;
  sku: string;
  price: string;
  displayPrice: string;
  image: string;
};

export type Wishlist = {
  token: string;
  wishedProducts: WishedProduct[];
};