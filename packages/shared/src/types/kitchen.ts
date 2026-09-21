export type ProductionStatus = 
  | 'PLANNED' 
  | 'IN_PREPARATION' 
  | 'READY_FOR_DISPATCH' 
  | 'DISPATCHED' 
  | 'COMPLETED';

export type DispatchStatus = 'DISPATCHED' | 'RECEIVED' | 'DISCREPANCY';

export interface OutletDemandSummary {
  outletId: string;
  outletName: string;
  outletLocality: string;
  expectedMeals: number;
  actualOrders: number;
  dispatchedMeals: number;
  receivedMeals: number;
  dispatchStatus: DispatchStatus;
}

export interface KitchenDashboardData {
  todayDate: string;
  totalBatches: number;
  totalPlannedMeals: number;
  totalCookedMeals: number;
  totalDispatchedMeals: number;
  totalWastageMeals: number;
  outletsDemand: OutletDemandSummary[];
  activeBatchStatus: ProductionStatus;
  palya1Name: string;
  palya2Name: string;
  nextDispatchTime: string;
}

export interface RecordDispatchDTO {
  productionId: string;
  outletId: string;
  dispatchedMeals: number;
  notes?: string;
}

export interface RecordReceivedDTO {
  productionId: string;
  outletId: string;
  receivedMeals: number;
  discrepancyNotes?: string;
}
