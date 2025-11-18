export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Billing {
  officialName: string;
  ico: string;
  dic?: string;
  address: Address;
}

export interface Customer {
  id: number;
  documentId: string;
  name: string;
  invoiceStaticId: number;
  billing: Billing;
  deliveryAddress: Address;
  orders?: Order[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Plant {
  id: number;
  name: string;
  timeToGrow: number;
}

export interface GrowStrategy {
  id: number;
  name: string;
  actions: ActionType[];
}

export interface PlantBatch {
  id: number;
  amount: number;
  plant: Plant;
  growStrategy: GrowStrategy;
}

export interface DeliveryTimes {
  daysInWeek: string[];
}

export interface PriceList {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  documentId: string;
  active: boolean;
  firstDelivery: string;
  customer: Customer;
  plantsToGrow: PlantBatch[];
  deliveryTimes: DeliveryTimes;
  price_list: PriceList;
  batches?: Batch[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActionType {
  id: number;
  name: string;
}

export interface Action {
  id: number;
  documentId: string;
  timestamp: string;
  state: 'waiting' | 'running' | 'done';
  timeSpent?: number;
  batch: Batch;
  plantBatch: PlantBatch;
  action_type: ActionType;
  createdAt?: string;
  updatedAt?: string;
}

export interface Batch {
  id: number;
  documentId: string;
  state: 'waiting' | 'running' | 'done';
  dueToDate: string;
  order: Order;
  plantsToGrow: PlantBatch[];
  actions: Action[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
