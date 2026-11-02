import { Routes } from '@angular/router';

export const routes: Routes = [

  // Default route
  { path: '', redirectTo: 'seller', pathMatch: 'full' },

  // ADMIN ROUTES
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard)
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./admin/user-management/user-management')
        .then(m => m.UserManagement)
  },
  {
    path: 'admin/moderation',
    loadComponent: () =>
      import('./admin/moderation/moderation')
        .then(m => m.Moderation)
  },
  {
    path: 'admin/auctions',
    loadComponent: () =>
      import('./admin/auction-monitoring/auction-monitoring')
        .then(m => m.AuctionMonitoring)
  },
  {
    path: 'admin/alerts',
    loadComponent: () =>
      import('./admin/suspicious-alerts/suspicious-alerts')
        .then(m => m.SuspiciousAlerts)
  },
  {
    path: 'admin/analytics',
    loadComponent: () =>
      import('./admin/analytics/analytics')
        .then(m => m.Analytics)
  },

  // SELLER ROUTES
  {
    path: 'seller',
    loadComponent: () =>
      import('./seller/seller-dashboard/seller-dashboard')
        .then(m => m.SellerDashboard)
  },
  {
    path: 'seller/profile',
    loadComponent: () =>
      import('./seller/seller-profile/seller-profile')
        .then(m => m.SellerProfile)
  },
  {
    path: 'seller/add-product',
    loadComponent: () =>
      import('./seller/add-product/add-product')
        .then(m => m.AddProduct)
  },
  {
    path: 'seller/products',
    loadComponent: () =>
      import('./seller/product-list/product-list')
        .then(m => m.ProductList)
  },
  {
    path: 'seller/edit-product/:id',
    loadComponent: () =>
      import('./seller/edit-product/edit-product')
        .then(m => m.EditProduct)
  },
  {
    path: 'seller/auction-schedule',
    loadComponent: () =>
      import('./seller/auction-schedule/auction-schedule')
        .then(m => m.AuctionSchedule)
  },

    // MEMBER 2 - BIDDING ROUTES
  {
    path: 'bidding',
    loadComponent: () =>
      import('./bidding/live-auctions/live-auctions')
        .then(m => m.LiveAuctions)
  },
  {
    path: 'bidding/auction/:id',
    loadComponent: () =>
      import('./bidding/auction-details/auction-details')
        .then(m => m.AuctionDetails)
  },
  {
    path: 'bidding/history/:id',
    loadComponent: () =>
      import('./bidding/bid-history/bid-history')
        .then(m => m.BidHistory)
  },
  {
  path: 'results/history',
  loadComponent: () =>
    import('./results/auction-history/auction-history')
      .then(m => m.AuctionHistory)
},

{
  path: 'results/winners',
  loadComponent: () =>
    import('./results/winner-selection/winner-selection')
      .then(m => m.WinnerSelection)
},
{
  path: 'results/payment',
  loadComponent: () =>
    import('./results/payment-status/payment-status')
      .then(m => m.PaymentStatus)
},
  { path: '**', redirectTo: 'admin' }
];