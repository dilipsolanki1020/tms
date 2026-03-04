import {
  Party,
  Vehicle,
  Driver,
  Load,
  Trip,
  Expense,
  Payment,
  TripFinance,
  Consignment
} from './index';

export class MockDataFactory {

  static getMockParties(): Party[] {
    return [
      {
        id: 'p1',
        name: 'Tech Industries Ltd',
        type: 'Company',
        email: 'contact@techindustries.com',
        phone: '+1 234 567 8900',
        address: '123 Tech Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        creditLimit: 500000,
        outstandingAmount: 50000,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: 'p2',
        name: 'Global Distributors',
        type: 'Distributor',
        email: 'info@globaldist.com',
        phone: '+1 987 654 3210',
        address: '456 Commerce Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        creditLimit: 750000,
        outstandingAmount: 120000,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-28')
      },
      {
        id: 'p3',
        name: 'John Smith',
        type: 'Individual',
        email: 'john.smith@email.com',
        phone: '+1 555 123 4567',
        address: '789 Personal Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        creditLimit: 100000,
        outstandingAmount: 15000,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-02-15')
      }
    ];
  }

  static getMockVehicles(): Vehicle[] {
    return [
      {
        id: 'v1',
        registrationNumber: 'TN-01-AB-1234',
        vehicleType: 'Truck',
        capacity: 15,
        owner: 'Owned',
        availabilityStatus: 'Available',
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-02-28')
      },
      {
        id: 'v2',
        registrationNumber: 'MH-02-CD-5678',
        vehicleType: 'Truck',
        capacity: 20,
        owner: 'Owned',
        availabilityStatus: 'In Transit',
        createdAt: new Date('2023-07-10'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: 'v3',
        registrationNumber: 'KA-03-EF-9012',
        vehicleType: 'Trailer',
        capacity: 25,
        owner: 'Market',
        availabilityStatus: 'Available',
        createdAt: new Date('2023-08-20'),
        updatedAt: new Date('2024-02-25')
      }
    ];
  }

  static getMockDrivers(): Driver[] {
    return [
      {
        id: 'd1',
        name: 'Rajesh Kumar',
        licenseNumber: 'DL-001',
        phoneNumber: '+1 999 111 2222',
        email: 'rajesh.kumar@email.com',
        address: '123 Driver St, Delhi',
        createdAt: new Date('2023-05-10'),
        updatedAt: new Date('2024-02-20')
      },
      {
        id: 'd2',
        name: 'Amit Patel',
        licenseNumber: 'DL-002',
        phoneNumber: '+1 999 333 4444',
        email: 'amit.patel@email.com',
        address: '456 Transport Ave, Mumbai',
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-02-18')
      },
      {
        id: 'd3',
        name: 'Suresh Singh',
        licenseNumber: 'DL-003',
        phoneNumber: '+1 999 555 6666',
        email: 'suresh.singh@email.com',
        address: '789 Logistics Rd, Bangalore',
        createdAt: new Date('2023-07-20'),
        updatedAt: new Date('2024-02-22')
      }
    ];
  }

  static getMockLoads(): Load[] {
    return [
      {
        id: 'l1',
        loadNumber: 'LOAD-001',
        loadType: 'FTL',
        status: 'In Transit',
        consignments: [
          {
            consignmentNumber: 'CONS-001',
            partyId: 'p1',
            itemDescription: 'Electronics Equipment',
            quantity: 100,
            weight: 500,
            value: 150000,
            pickupLocation: 'New York',
            deliveryLocation: 'Chicago'
          }
        ],
        vehicleId: 'v1',
        driverId: 'd1',
        sourceLocation: 'New York',
        destinationLocation: 'Chicago',
        freightAmount: 5000,
        generatedLRs: ['LR-001'],
        createdAt: new Date('2024-02-25'),
        loadedAt: new Date('2024-02-26')
      },
      {
        id: 'l2',
        loadNumber: 'LOAD-002',
        loadType: 'PTL',
        status: 'Created',
        consignments: [
          {
            consignmentNumber: 'CONS-002',
            partyId: 'p2',
            itemDescription: 'Home Appliances',
            quantity: 50,
            weight: 300,
            value: 100000,
            pickupLocation: 'Los Angeles',
            deliveryLocation: 'San Francisco'
          }
        ],
        vehicleId: 'v3',
        sourceLocation: 'Los Angeles',
        destinationLocation: 'San Francisco',
        freightAmount: 3000,
        generatedLRs: [],
        createdAt: new Date('2024-03-01')
      }
    ];
  }

  static getMockTrips(): Trip[] {
    return [
      {
        id: 't1',
        tripNumber: 'TRIP-001',
        vehicleId: 'v1',
        driverId: 'd1',
        loadIds: ['l1'],
        sourceLocation: 'New York',
        destinationLocation: 'Chicago',
        departureTime: new Date('2024-02-26 08:00:00'),
        arrivalTime: new Date('2024-02-28 14:00:00'),
        totalLoads: 1,
        status: 'Completed',
        createdAt: new Date('2024-02-25')
      },
      {
        id: 't2',
        tripNumber: 'TRIP-002',
        vehicleId: 'v2',
        driverId: 'd2',
        loadIds: [],
        sourceLocation: 'Mumbai',
        destinationLocation: 'Delhi',
        totalLoads: 0,
        status: 'Planned',
        createdAt: new Date('2024-03-01')
      }
    ];
  }

  static getMockExpenses(): Expense[] {
    return [
      {
        id: 'e1',
        tripId: 't1',
        type: 'Diesel',
        amount: 5000,
        description: 'Fuel for NY-Chicago route',
        createdAt: new Date('2024-02-26')
      },
      {
        id: 'e2',
        tripId: 't1',
        type: 'Toll',
        amount: 800,
        description: 'Highway toll charges',
        createdAt: new Date('2024-02-27')
      },
      {
        id: 'e3',
        tripId: 't1',
        type: 'Other',
        amount: 500,
        description: 'Driver accommodation',
        createdAt: new Date('2024-02-27')
      }
    ];
  }

  static getMockPayments(): Payment[] {
    return [
      {
        id: 'pay1',
        loadId: 'l1',
        partyId: 'p1',
        amount: 5000,
        paymentDate: new Date('2024-02-28'),
        paymentMethod: 'Bank Transfer',
        referenceNumber: 'TXN-001',
        createdAt: new Date('2024-02-28')
      }
    ];
  }

  static getMockTripFinances(): TripFinance[] {
    return [
      {
        tripId: 't1',
        totalRevenue: 5000,
        totalExpense: 6300,
        profit: -1300,
        isProfitCalculated: true,
        paymentStatus: 'Completed'
      }
    ];
  }
}
