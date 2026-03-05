// Party Model
export interface Party {
  id?: string;
  name: string;
  type: 'Company' | 'Distributor' | 'Individual';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  creditLimit: number;
  outstandingAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Vehicle Model
export interface Vehicle {
  id?: string;
  registrationNumber: string;
  vehicleType: string;
  capacity: number; // in tonnes
  owner: 'Owned' | 'Market';
  availabilityStatus: 'Available' | 'In Transit' | 'Under Maintenance' | 'Booked' | 'Unavailable' | 'In Use';
  createdAt?: Date;
  updatedAt?: Date;
}

// Driver Model
export interface Driver {
  id?: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Consignment Model
export interface Consignment {
  consignmentNumber: string;
  partyId: string;
  itemDescription: string;
  quantity: number;
  weight: number; // in kg
  value: number;
  pickupLocation: string;
  deliveryLocation: string;
}

// Load Model (Full or Partial Load)
export interface Load {
  id?: string;
  loadNumber: string;
  loadType: 'FTL' | 'PTL';
  status: 'Created' | 'Loaded' | 'In Transit' | 'Delivered' | 'Closed' | 'Pending' | 'Active';
  consignments: Consignment[];
  vehicleId?: string;
  driverId?: string;
  sourceLocation: string;
  destinationLocation: string;
  freightAmount: number;
  generatedLRs: string[]; // LR numbers
  createdAt?: Date;
  loadedAt?: Date;
  deliveredAt?: Date;
  closedAt?: Date;
}

// Trip Model
export interface Trip {
  id?: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string;
  loadIds: string[];
  sourceLocation: string;
  destinationLocation: string;
  departureTime?: Date;
  arrivalTime?: Date;
  totalLoads: number;
  status: 'Planned' | 'In Progress' | 'Completed';
  createdAt?: Date;
}

// Expense Model
export interface Expense {
  id?: string;
  tripId: string;
  type: 'Advance' | 'Diesel' | 'Toll' | 'Other';
  amount: number;
  description: string;
  receipt?: string;
  createdAt?: Date;
}

// Payment Model
export interface Payment {
  id?: string;
  loadId: string;
  partyId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'Cash' | 'Cheque' | 'Bank Transfer' | 'UPI';
  referenceNumber?: string;
  createdAt?: Date;
}

// Revenue and Profit Calculation Model
export interface TripFinance {
  tripId: string;
  totalRevenue: number; // Total freight amount from loads
  totalExpense: number; // Sum of all expenses
  profit: number; // Revenue - Expense
  isProfitCalculated: boolean; // Only calculated after payment received
  paymentStatus: 'Pending' | 'Partial' | 'Completed';
}
