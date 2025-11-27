// =====================
// URLs
// =====================
export const urls = {
    base: "http://localhost:8080/api",
    auth: "http://localhost:8080/api/auth",
    vehicles: "http://localhost:8080/api/vehicles",
    customers: "http://localhost:8080/api/customers",
    orders: "http://localhost:8080/api/salesorders",
    feedbacks: "http://localhost:8080/api/feedbacks",
    testdrives: "http://localhost:8080/api/testdrives",
    orderitems: "http://localhost:8080/api/orderitems",
    // New modules
    vehicleSpecs: "http://localhost:8080/api/vehicle-specifications",
    financing: "http://localhost:8080/api/customer-financing",
    interactions: "http://localhost:8080/api/customer-interactions",
    inventoryTransactions: "http://localhost:8080/api/inventory-transactions",
    dealerPayments: "http://localhost:8080/api/dealer-payments",
    // EVM modules
    dealers: "http://localhost:8080/api/dealers",
    inventory: "http://localhost:8080/api/inventories",
    promotions: "http://localhost:8080/api/promotions",
    wholesalePrices: "http://localhost:8080/api/wholesale-prices",
    dealerContracts: "http://localhost:8080/api/dealer-contracts",
    dealerTargets: "http://localhost:8080/api/dealer-targets"
};

// User roles
export const ROLES = {
    DEALER_STAFF: 'DEALER_STAFF',
    DEALER_MANAGER: 'DEALER_MANAGER',
    EVM_STAFF: 'EVM_STAFF',
    ADMIN: 'ADMIN'
};

// Role permissions
export const PERMISSIONS = {
    [ROLES.DEALER_STAFF]: {
        canView: ['dashboard', 'vehicles', 'customers', 'orders', 'testdrives', 'feedbacks', 'financing', 'interactions', 'inventory'],
        canCreate: ['customers', 'testdrives', 'interactions'],
        canEdit: ['customers', 'testdrives', 'interactions'],
        canDelete: []
    },
    [ROLES.DEALER_MANAGER]: {
        canView: ['dashboard', 'vehicles', 'customers', 'orders', 'testdrives', 'feedbacks', 'financing', 'interactions', 'inventory', 'reports'],
        canCreate: ['customers', 'orders', 'testdrives', 'financing', 'interactions'],
        canEdit: ['customers', 'orders', 'testdrives', 'financing', 'interactions'],
        canDelete: ['testdrives', 'interactions']
    },
    [ROLES.EVM_STAFF]: {
        canView: ['evmdashboard', 'dealers', 'vehicles', 'inventory', 'orders', 'promotions', 'wholesaleprices', 'dealerpayments'],
        canCreate: ['vehicles', 'inventory', 'promotions', 'wholesaleprices'],
        canEdit: ['vehicles', 'inventory', 'promotions', 'wholesaleprices'],
        canDelete: []
    },
    [ROLES.ADMIN]: {
        canView: ['*'],
        canCreate: ['*'],
        canEdit: ['*'],
        canDelete: ['*']
    }
};
