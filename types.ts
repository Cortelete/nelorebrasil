export enum ModalType {
  NONE,
  ABOUT,
  LOCATION,
  ORDER,
  REVIEW,
  DEVELOPER,
  KITS,
}

export interface OrderData {
  name: string;
  items: {
    carnes: boolean;
    acompanhamentos: boolean;
    kits: boolean;
    panificadora: boolean;
    outros: boolean;
  };
  selectedKits: {
    churrasco1: boolean;
    churrascoPremium: boolean;
    economico: boolean;
    pratico: boolean;
    familiar: boolean;
  };
  outrosText: string;
  pickupTime: string;
  message: string;
}

export interface KitOrderData {
  name: string;
  pickupTime: string;
  kits: {
    churrasco1: number;
    churrascoPremium: number;
    economico: number;
    pratico: number;
    familiar: number;
  };
}
