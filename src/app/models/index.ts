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

export interface DeliveryTimes {
  preferTimeOfDelivery: string;
  daysInWeek: {
    id: number,
    day: string
  }[];
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
  itemsForDelivery: DeliveryItem[];
  deliveryTimes: DeliveryTimes;
  price_list: PriceList;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryItem {
  id: number;
  amount: number;
  recipe: RecipeDto;
  unit: CropBatchUnit;
}

export type ID = number | string;

export type DayInWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type DayActionType = 'SEEDING' | 'MOVE_TO_LIGHT' | 'HARVEST';

export type BatchDeliveryState = 'PENDING' | 'PACKED' | 'ON_WAY' | 'DELIVERED';

export type CropCycleState = 'PENDING' | 'GERMINATION' | 'LIGHT' | 'HARVESTED';

export type TrayState = 'Empty' | 'InUse' | 'Washing' | 'Damaged';

export type CropBatchUnit = 'GRAM' | 'BOX_S' | 'BOX_M' | 'BOX_L';

export type BoxType = 'BOX_S' | 'BOX_M' | 'BOX_L';

export interface GrowBoxGroup {
  amount: number;
  box: BoxType;
}

export interface StrapiMetaFields {
  id: ID;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface PlantDto extends StrapiMetaFields {
  code?: string;
  name?: string;
  typeName?: string;
  timeToGrow?: number;
}

export interface RecipeDto extends StrapiMetaFields {
  code?: string;
  name?: string;
  totalGrowTime?: number;
  items?: RecipeItemDto[];
}

export interface OrderDto extends StrapiMetaFields {
  active?: boolean;
  firstDelivery?: string;
  customerId?: ID;
  customer?: Customer;
  priceListId?: ID;
  itemsForDelivery: RecipeBatchDto[];
  deliveryTimes?: DeliveryTimes;
  operation_plan?: OperationPlanDto;
}

export interface ActionDto extends StrapiMetaFields {
// Add fields if you need action details populated on FE
}

export interface RecipeBatchDto {
  id?: ID;
  recipe?: RecipeDto;
  plant?: PlantDto;
  amount?: number;
  unit?: CropBatchUnit;
  packed?: boolean;
  packedAmount?: number;
  packedItems?: { plant: PlantDto, amount: number }[];
}

export interface RecipeItemDto {
  plant?: PlantDto;
  percent?: number;
}


export interface CropBatchDto {
  id?: ID;
  plant?: PlantDto;
  amount?: number;
  unit?: CropBatchUnit;
}

export interface DayYieldDto extends StrapiMetaFields {
  active?: boolean;
  dayInWeek?: DayInWeek;
  deactivatedAt?: string;
  weight?: number;
  plant?: PlantDto;
  operation_plan?: OperationPlanDto;
}

export interface DayActionDto extends StrapiMetaFields {
  active?: boolean;
  DayInWeek?: DayInWeek;
  deactivatedAt?: string;
  trayCount?: number;
  type?: DayActionType;
  plant?: PlantDto;
  order?: OrderDto;
  operation_plan?: OperationPlanDto;
}

export interface OccupancyDto extends StrapiMetaFields {
  active?: boolean;
  dayInWeek?: DayInWeek;
  deactivatedAt?: string;
  germinationCount?: number;
  onLightCount?: number;
  operation_plan?: OperationPlanDto;
}

export interface OperationPlanDto extends StrapiMetaFields {
  active?: boolean;
  deactivatedAt?: string;
  note?: string;
  day_actions?: DayActionDto[];
  day_yields?: DayYieldDto[];
  occupancies?: OccupancyDto[];
}

export interface BatchDeliveryDto extends StrapiMetaFields {
  deliveredAt?: string;
  state?: BatchDeliveryState;
  deliveredItems?: RecipeBatchDto[];
  expectedItems?: RecipeBatchDto[];
  order?: OrderDto;
  batch_harvest: ID;
  handedBoxes?: GrowBoxGroup[];
  returnedBoxes?: GrowBoxGroup[];
}

export interface BatchHarvestDto extends StrapiMetaFields {
  date?: string;
  crop_cycle_harvests?: CropCycleHarvestDto[];
  harvestedCrops?: CropBatchDto[];
  usedHarvest?: CropBatchDto[];
}

export interface CropCycleDto extends StrapiMetaFields {
  seedingDay?: string;
  moveToLightDay?: string;
  harvestDay?: string;
  state?: CropCycleState;
  plant?: PlantDto;
  crop_cycle_harvest?: CropCycleHarvestDto;
}

export interface CropCycleHarvestDto extends StrapiMetaFields {
  crop_cycle?: CropCycleDto;
  weight?: number;
  performedAt?: string;
  batch_harvest?: BatchHarvestDto;
}

export interface InventoryDto extends StrapiMetaFields {
  boxesSInDepot?: number;
  boxesSOnWay?: number;
  boxesSAtCustomer?: number;
  brokenBoxesS?: number;
}

export interface TrayBatchDto extends StrapiMetaFields {
  actions?: ActionDto[];
  plant?: PlantDto;
  expectedGain?: number;
  realGain?: number;
  trays?: TrayDto[];
}

export interface TrayDto extends StrapiMetaFields {
  code?: string;
  placeCode?: string;
  state?: TrayState;
  totalCycle?: number;
}

export interface CropCycleCustomListItemDto {
  id?: ID;
  seedingDay?: string;
  moveToLightDay?: string;
  harvestDay?: string;
  plantName?: string;
  state?: CropCycleState;
  harvestId?: ID;
  trayCode?: string;
  trayPlace?: string;
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
