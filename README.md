# TMS MVP - Transport Management System

## Overview
A complete Angular 18 application for Transport Management System (TMS) targeting small fleet owners and brokers in Maharashtra. Built with a SaaS (Subscription-based) model.

## Features

### Core Modules
- **Party Management**: Track companies, distributors, and individual customers
- **Load Management**: Create and manage FTL/PTL loads with status tracking
- **Vehicle Management**: Manage owned and market vehicles with capacity tracking
- **Trip Management**: Plan and track trips with multiple loads
- **Expense Tracking**: Record driver advances, fuel, tolls, and other expenses
- **Payment Management**: Track payments received from parties
- **Revenue & Profit Calculation**: Calculate trip profitability after payment
- **Reports & Analytics**: Financial reports and business insights

### Technology Stack
- **Framework**: Angular 18 (Standalone Components)
- **Language**: TypeScript
- **Styling**: CSS3
- **State Management**: RxJS (BehaviorSubject)
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces for all entities
│   │   └── services/        # Business logic services (API calls)
│   ├── features/
│   │   ├── dashboard/       # Main dashboard
│   │   ├── party/          # Party management module
│   │   ├── load/           # Load management module
│   │   ├── vehicle/        # Vehicle management module
│   │   ├── trip/           # Trip management module
│   │   ├── expense/        # Expense tracking module
│   │   ├── payment/        # Payment management module
│   │   └── report/         # Reports and analytics
│   ├── shared/
│   │   ├── navbar/         # Navigation bar
│   │   └── sidebar/        # Sidebar navigation
│   ├── app.component.*     # Root component
│   └── app.routes.ts       # Routing configuration
├── styles.css              # Global styles
└── index.html              # Entry HTML

```

## Core Services

1. **PartyService** - Manage customers and parties
2. **LoadService** - Handle load lifecycle and LR generation
3. **VehicleService** - Manage vehicle inventory and availability
4. **TripService** - Plan and track trips
5. **ExpenseService** - Record and track trip expenses
6. **PaymentService** - Manage payments received
7. **FinanceService** - Calculate revenue, expense, and profit

## Data Models

### Party
- Name, Type, Email, Phone
- Address details (City, State, Zip)
- Credit Limit, Outstanding Amount

### Load
- Load Number, Type (FTL/PTL)
- Status: Created → Loaded → In Transit → Delivered → Closed
- Consignments (multiple per load)
- Vehicle & Driver Assignment
- LR (Lorry Receipt) Generation

### Vehicle
- Registration Number
- Type, Capacity (in tonnes)
- Owner Type (Owned/Market)
- Availability Status

### Trip
- Trip Number, Source, Destination
- Multiple Loads per Trip
- Departure & Arrival Time
- Status: Planned → In Progress → Completed

### Expense
- Type: Advance, Diesel, Toll, Other
- Amount, Description, Receipt

### Payment
- Load ID, Party ID
- Amount, Payment Method
- Reference Number

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd tms-mvp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Building for Production

```bash
npm run build
```

Built files will be in the `dist/tms-mvp` directory.

## Component Features

### Dashboard
- Summary statistics (Total Parties, Active Loads, Vehicles, Completed Trips)
- Recent loads and trips display
- Quick overview of system health

### Party Management
- List all parties with credit limit and outstanding amount
- Add new parties with full details
- View party details
- Delete parties

### Load Management
- Create loads (FTL/PTL)
- Add multiple consignments per load
- Assign vehicles and drivers
- Track load status
- Generate LR (Lorry Receipt)

### Vehicle Management
- Manage fleet inventory
- Track availability status
- Filter available vehicles
- Record owned vs market vehicles

### Trip Management
- Create multi-load trips
- Record departure and arrival times
- Track trip status
- Associate multiple loads

### Expense Tracking
- Record different expense types
- Track per-trip expenses
- Attach receipts
- Categorize expenses

### Payment Management
- Record payments received
- Track outstanding receivables
- Payment method tracking
- Reference number management

## API Integration

All services are configured to connect to a backend API at `/api/*`. Update the `apiUrl` in each service file to point to your backend server.

Example:
```typescript
private apiUrl = 'http://your-api-server/api/parties';
```

## Styling

The application uses:
- CSS Grid for responsive layouts
- Material-inspired color scheme
- Utility classes for common styles
- Component-scoped styling

## Future Enhancements

- User authentication & authorization
- Real-time notifications
- Mobile app (React Native)
- Advanced reporting & analytics
- SMS notifications for deliveries
- GPS tracking integration
- Document management (Invoices, LRs)
- Multi-language support (Hindi, Marathi)
- PWA capabilities

## License

Proprietary - Transport Management System MVP

## Support

For issues or questions, contact the development team.
