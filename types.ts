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
    proteina: boolean;
    almocoJantar: boolean;
    semanal: boolean;
    churrasco: boolean;
  };
  outrosText: string;
  pickupTime: string;
  message: string;
}

export interface KitOrderData {
  name: string;
  pickupTime: string;
  kits: {
    proteina: number;
    almocoJantar: number;
    semanal: number;
    churrasco: number;
  };
}
