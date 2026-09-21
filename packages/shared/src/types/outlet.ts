export type OutletStatus = 'OPEN' | 'BUSY' | 'CLOSED';

export interface Outlet {
  id: string;
  name: string;
  slug: string;
  code: string;
  address: string;
  locality: string;
  landmark?: string | null;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  isActive: boolean;
  opensAt: string; // e.g. "11:30"
  closesAt: string; // e.g. "22:30"
  averagePrepTimeMinutes: number;
  currentStatus: OutletStatus;
  distanceKm?: number;
  isOpenNow?: boolean;
}

export interface OutletSummaryDTO {
  id: string;
  name: string;
  slug: string;
  locality: string;
  address: string;
  phone: string;
  averagePrepTimeMinutes: number;
  currentStatus: OutletStatus;
  distanceKm?: number;
  isOpenNow: boolean;
}

export interface CreateOutletDTO {
  name: string;
  slug: string;
  code: string;
  address: string;
  locality: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  opensAt: string;
  closesAt: string;
  averagePrepTimeMinutes: number;
}

export interface UpdateOutletDTO extends Partial<CreateOutletDTO> {
  isActive?: boolean;
  currentStatus?: OutletStatus;
}
