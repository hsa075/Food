export interface OotaComponent {
  id: string;
  name: string;
  kannadaName: string;
  description: string;
  quantityDescription: string;
  isRotating: boolean;
  allergens?: string[];
}

export interface DailyPalya {
  id: string;
  name: string;
  kannadaName: string;
  description: string;
  ingredients: string[];
  spiceLevel: 'MILD' | 'MEDIUM' | 'SPICY';
  isJainFriendly?: boolean;
}

export interface DailyMenu {
  id: string;
  outletId: string;
  date: string; // YYYY-MM-DD
  palya1: DailyPalya;
  palya2: DailyPalya;
  price: number;
  isAvailable: boolean;
  dispatchedAtBatch?: string;
  caloriesEstimate?: number;
  components: OotaComponent[];
}

export interface UpdateDailyPalyaDTO {
  palya1Name: string;
  palya1KannadaName?: string;
  palya1Description: string;
  palya2Name: string;
  palya2KannadaName?: string;
  palya2Description: string;
  outletId?: string; // If omitted, applies across all outlets
}
