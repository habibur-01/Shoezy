export const SAMPLE_BAG_ITEMS = [
  {
    id: 'item-1',
    name: 'Cashmere Oversized Trench',
    variant: 'Oatmeal / Size M',
    price: 480,
    originalPrice: 560,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'item-2',
    name: 'Brutalist Sculpted Ceramic Vase',
    variant: 'Matte Charcoal / No. 04',
    price: 145,
    originalPrice: 170,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
  },
];

export const EDITORIAL_SLIDES = [
  {
    id: 'slide-1',
    tag: 'AUTUMN / WINTER 2026',
    title: 'The Art of Essential Living',
    quote: 'Refined silhouettes sculpted with intentional minimalism and natural textures.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'slide-2',
    tag: 'ATELIER PRIVILEGES',
    title: 'Curated for the Discerning',
    quote: 'Enjoy private pre-release access, complimentary international courier, and personal styling.',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'slide-3',
    tag: 'OBJECTS & HOME',
    title: 'Form Follows Silence',
    quote: 'Tactile ceramics, unbleached linens, and architectural home vessels.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
  },
];

export const MEMBER_PERKS = [
  {
    title: 'Complimentary Express Courier',
    desc: 'Carbon-neutral next-day delivery on all orders over $150',
  },
  {
    title: '10% Welcome Privilege',
    desc: 'Applied automatically to your first seasonal order upon joining',
  },
  {
    title: 'Persistent Bag & Wishlist',
    desc: 'Seamlessly sync your saved artifacts across mobile and desktop',
  },
  {
    title: 'Private Archive Pre-Access',
    desc: 'Access limited-edition capsule collections 48 hours early',
  },
];

// ==========================================
// ADMIN CAPABILITIES & PERMISSION MATRIX
// ==========================================

export const PERMISSION_DEFINITIONS = [
  // Products
  {
    key: 'products.view',
    label: 'View Products & Inventory',
    category: 'Products',
    description: 'Browse catalog, review stock counts, prices, and variant metrics',
  },
  {
    key: 'products.create',
    label: 'Create New Products',
    category: 'Products',
    description: 'Publish new footwear listings, variants, media, and SEO meta',
  },
  {
    key: 'products.edit',
    label: 'Modify Product Details',
    category: 'Products',
    description: 'Edit product titles, pricing tiers, descriptions, and categories',
  },
  {
    key: 'products.delete',
    label: 'Archive / Delete Products',
    category: 'Products',
    description: 'Remove discontinued shoe models or variants from public view',
  },
  {
    key: 'products.stock_update',
    label: 'Quick Stock Level Adjustment',
    category: 'Products',
    description: 'Directly modify quantity on hand and low-stock threshold triggers',
  },

  // Categories
  {
    key: 'categories.view',
    label: 'View Taxonomy Hierarchy',
    category: 'Categories',
    description: 'Browse master, sub, and child tier category taxonomy trees',
  },
  {
    key: 'categories.create',
    label: 'Create Category Tiers',
    category: 'Categories',
    description: 'Add new master categories, sub-categories, or child attributes',
  },
  {
    key: 'categories.edit',
    label: 'Edit Category Structure',
    category: 'Categories',
    description: 'Update category slugs, display names, banner media, and sorting',
  },
  {
    key: 'categories.delete',
    label: 'Delete Categories',
    category: 'Categories',
    description: 'Remove empty category nodes or reassign child products',
  },

  // Orders
  {
    key: 'orders.view',
    label: 'View Orders & Invoices',
    category: 'Orders',
    description: 'Access customer orders, billing summaries, and itemized packages',
  },
  {
    key: 'orders.update_status',
    label: 'Update Fulfillment Status',
    category: 'Orders',
    description: 'Advance orders between Pending, Processing, Shipped, and Delivered',
  },
  {
    key: 'orders.cancel_refund',
    label: 'Cancel Orders & Issue Refunds',
    category: 'Orders',
    description: 'Initiate payment refunds and return items back to active stock',
  },
  {
    key: 'orders.export',
    label: 'Export Orders Manifest to CSV',
    category: 'Orders',
    description: 'Download bulk order reporting manifests for logistics dispatch',
  },

  // Coupons
  {
    key: 'coupons.view',
    label: 'View Promotion Campaigns',
    category: 'Coupons',
    description: 'Review active discount codes, usage velocity, and expirations',
  },
  {
    key: 'coupons.create',
    label: 'Generate Promotional Coupons',
    category: 'Coupons',
    description: 'Create percentage, flat discount, or free delivery coupon codes',
  },
  {
    key: 'coupons.toggle',
    label: 'Activate / Pause Coupons',
    category: 'Coupons',
    description: 'Instantly enable or suspend active discount promotions',
  },
  {
    key: 'coupons.delete',
    label: 'Delete Expired Coupons',
    category: 'Coupons',
    description: 'Permanently remove promotional voucher campaigns from records',
  },

  // Analytics
  {
    key: 'analytics.view',
    label: 'View Analytics & Performance',
    category: 'Analytics',
    description: 'Review conversion charts, regional customer footprint, and LTV',
  },
  {
    key: 'analytics.export',
    label: 'Export Customer Analytics CSV',
    category: 'Analytics',
    description: 'Extract customer segment cohorts and lifetime value metrics',
  },

  // Roles & Permissions
  {
    key: 'roles.view',
    label: 'View Staff & Roles',
    category: 'Roles & Staff',
    description: 'Browse current administrative personnel and assigned roles',
  },
  {
    key: 'roles.manage_permissions',
    label: 'Modify Capabilities Matrix',
    category: 'Roles & Staff',
    description: 'Toggle individual operational capabilities for security roles',
  },
  {
    key: 'roles.invite_staff',
    label: 'Invite & Onboard Team Members',
    category: 'Roles & Staff',
    description: 'Send invitation emails and assign access scopes to personnel',
  },
  {
    key: 'roles.create_role',
    label: 'Define Custom Roles',
    category: 'Roles & Staff',
    description: 'Create bespoke RBAC roles with tailored privilege profiles',
  },

  // Audit Logs
  {
    key: 'audit.view',
    label: 'View System Audit Trail',
    category: 'Audit Trail',
    description: 'Inspect timestamped event records of administrative operations',
  },
  {
    key: 'audit.export',
    label: 'Export Audit Trail Logs to CSV',
    category: 'Audit Trail',
    description: 'Download cryptographic or compliance-ready activity archives',
  },

  // Settings & Gateways
  {
    key: 'settings.payment_gateways',
    label: 'Configure Payment Gateways',
    category: 'Settings',
    description: 'Manage bKash, Nagad, Stripe, COD, and merchant credentials',
  },
];

// ==========================================
// DEFAULT ROLES & RBAC PRESETS
// ==========================================

export const INITIAL_ROLES = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Unrestricted enterprise clearance across all operations and security matrix',
    color: 'emerald',
    isCustom: false,
    permissions: PERMISSION_DEFINITIONS.map((p) => p.key),
  },
  {
    id: 'store_manager',
    name: 'Store Manager',
    description: 'Manages catalog inventory, order fulfillment, promotions, and customer relations',
    color: 'indigo',
    isCustom: false,
    permissions: [
      'products.view',
      'products.create',
      'products.edit',
      'products.stock_update',
      'categories.view',
      'categories.create',
      'categories.edit',
      'orders.view',
      'orders.update_status',
      'orders.cancel_refund',
      'orders.export',
      'coupons.view',
      'coupons.create',
      'coupons.toggle',
      'analytics.view',
      'roles.view',
      'audit.view',
      'settings.payment_gateways',
    ],
  },
  {
    id: 'inventory_lead',
    name: 'Inventory Lead',
    description: 'Oversees shoe inventory, stock replenishment, and category taxonomy',
    color: 'amber',
    isCustom: false,
    permissions: [
      'products.view',
      'products.create',
      'products.edit',
      'products.stock_update',
      'categories.view',
      'categories.create',
      'categories.edit',
      'orders.view',
      'audit.view',
    ],
  },
  {
    id: 'support_agent',
    name: 'Support Agent',
    description: 'Customer inquiries, order status verification, and customer assistance',
    color: 'sky',
    isCustom: false,
    permissions: [
      'products.view',
      'categories.view',
      'orders.view',
      'orders.update_status',
      'coupons.view',
    ],
  },
];

export const INITIAL_TEAM_MEMBERS = [
  {
    id: 'usr-admin-1',
    name: 'Aiden Vance',
    email: 'admin@shoezy.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    roleId: 'super_admin',
    status: 'active',
    lastActive: 'Just now',
    phone: '+1 (555) 234-8901',
    joinedDate: 'Jan 12, 2025',
  },
  {
    id: 'usr-manager-1',
    name: 'Sarah Connor',
    email: 'manager@shoezy.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    roleId: 'store_manager',
    status: 'active',
    lastActive: '12m ago',
    phone: '+1 (555) 872-1029',
    joinedDate: 'Mar 04, 2025',
  },
  {
    id: 'usr-inventory-1',
    name: 'Marcus Sterling',
    email: 'inventory@shoezy.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    roleId: 'inventory_lead',
    status: 'active',
    lastActive: '45m ago',
    phone: '+1 (555) 431-7782',
    joinedDate: 'Apr 19, 2025',
  },
  {
    id: 'usr-support-1',
    name: 'Elena Rostova',
    email: 'support@shoezy.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    roleId: 'support_agent',
    status: 'active',
    lastActive: '2h ago',
    phone: '+1 (555) 902-3341',
    joinedDate: 'May 10, 2025',
  },
];

// ==========================================
// INITIAL CATEGORIES (3-TIER TAXONOMY)
// ==========================================

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-men',
    name: 'Men Footwear',
    slug: 'men',
    description: 'High performance running, lifestyle sneakers, and tailored luxury footwear.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
    productCount: 42,
    subCategories: [
      {
        id: 'sub-men-running',
        name: 'Running & Marathon',
        slug: 'running',
        childCategories: [
          { id: 'child-men-road', name: 'Road Running' },
          { id: 'child-men-trail', name: 'Trail & Terrain' },
          { id: 'child-men-racing', name: 'Racing Flats' },
        ],
      },
      {
        id: 'sub-men-lifestyle',
        name: 'Lifestyle & Casual',
        slug: 'lifestyle',
        childCategories: [
          { id: 'child-men-retro', name: 'Retro Sneakers' },
          { id: 'child-men-skate', name: 'Skate Culture' },
          { id: 'child-men-slipon', name: 'Slip-ons & Mules' },
        ],
      },
      {
        id: 'sub-men-formal',
        name: 'Formal & Boots',
        slug: 'formal',
        childCategories: [
          { id: 'child-men-chelsea', name: 'Chelsea Boots' },
          { id: 'child-men-oxford', name: 'Oxfords & Derbies' },
        ],
      },
    ],
  },
  {
    id: 'cat-women',
    name: 'Women Footwear',
    slug: 'women',
    description: 'Engineered comfort, lightweight running silhouettes, and elevated fashion sneakers.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80',
    productCount: 38,
    subCategories: [
      {
        id: 'sub-women-running',
        name: 'Running & Training',
        slug: 'running',
        childCategories: [
          { id: 'child-women-cushion', name: 'Max Cushion' },
          { id: 'child-women-speed', name: 'Tempo & Speed' },
        ],
      },
      {
        id: 'sub-women-casual',
        name: 'Designer & Casual',
        slug: 'casual',
        childCategories: [
          { id: 'child-women-platform', name: 'Platform Sneakers' },
          { id: 'child-women-loafers', name: 'Modern Loafers' },
        ],
      },
    ],
  },
  {
    id: 'cat-kids',
    name: 'Kids & Youth',
    slug: 'kids',
    description: 'Durable construction with secure grip and flexible ergonomics for growing athletes.',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=500&q=80',
    productCount: 19,
    subCategories: [
      {
        id: 'sub-kids-boys',
        name: 'Boys Sneakers',
        slug: 'boys',
        childCategories: [
          { id: 'child-kids-court', name: 'Court & Basketball' },
          { id: 'child-kids-playground', name: 'Playground Essentials' },
        ],
      },
      {
        id: 'sub-kids-girls',
        name: 'Girls Sneakers',
        slug: 'girls',
        childCategories: [
          { id: 'child-kids-sparkle', name: 'Sport Lifestyle' },
          { id: 'child-kids-trainer', name: 'Everyday Trainers' },
        ],
      },
    ],
  },
];

// ==========================================
// INITIAL PRODUCTS CATALOG
// ==========================================

export const INITIAL_PRODUCTS = [
  {
    id: 'prd-001',
    title: 'Nike Air Zoom Pegasus 40',
    brand: 'Nike',
    sku: 'SHZ-NK-PEG40',
    barcode: '883419283401',
    category: 'Men Footwear',
    subCategory: 'Running & Marathon',
    childCategory: 'Road Running',
    price: 130,
    compareAtPrice: 150,
    costPrice: 65,
    stock: 24,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewsCount: 142,
    tags: ['bestseller', 'running', 'road'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'A springy ride for every run, the Pegasus returns to help you achieve your goals.',
    status: 'published',
  },
  {
    id: 'prd-002',
    title: 'Adidas Ultraboost Light',
    brand: 'Adidas',
    sku: 'SHZ-AD-UBLT',
    barcode: '406542918231',
    category: 'Men Footwear',
    subCategory: 'Running & Marathon',
    childCategory: 'Road Running',
    price: 190,
    compareAtPrice: 210,
    costPrice: 92,
    stock: 4, // Critical stock alert
    lowStockThreshold: 8,
    rating: 4.9,
    reviewsCount: 88,
    tags: ['featured', 'boost', 'ultralight'],
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
    description: 'Experience epic energy with the lightest Ultraboost ever made.',
    status: 'published',
  },
  {
    id: 'prd-003',
    title: 'New Balance 990v6 Made in USA',
    brand: 'New Balance',
    sku: 'SHZ-NB-990V6',
    barcode: '196432098412',
    category: 'Men Footwear',
    subCategory: 'Lifestyle & Casual',
    childCategory: 'Retro Sneakers',
    price: 200,
    compareAtPrice: 220,
    costPrice: 105,
    stock: 3, // Critical stock alert
    lowStockThreshold: 6,
    rating: 4.95,
    reviewsCount: 204,
    tags: ['heritage', 'made-in-usa', 'premium'],
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=600&q=80',
    description: 'The designers of the original 990 were tasked with creating the single best running shoe.',
    status: 'published',
  },
  {
    id: 'prd-004',
    title: 'Salomon XT-6 Mindful Expanse',
    brand: 'Salomon',
    sku: 'SHZ-SLM-XT6',
    barcode: '741298450123',
    category: 'Men Footwear',
    subCategory: 'Running & Marathon',
    childCategory: 'Trail & Terrain',
    price: 180,
    compareAtPrice: 200,
    costPrice: 85,
    stock: 18,
    lowStockThreshold: 6,
    rating: 4.7,
    reviewsCount: 76,
    tags: ['gorpcore', 'trail', 'quicklace'],
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80',
    description: 'Originally launched in 2013, XT-6 is the shoe of choice for ultra-distance athletes.',
    status: 'published',
  },
  {
    id: 'prd-005',
    title: 'On Cloudmonster 2 Max Cushion',
    brand: 'On Running',
    sku: 'SHZ-ON-CLM2',
    barcode: '764032189405',
    category: 'Women Footwear',
    subCategory: 'Running & Training',
    childCategory: 'Max Cushion',
    price: 170,
    compareAtPrice: 185,
    costPrice: 80,
    stock: 28,
    lowStockThreshold: 10,
    rating: 4.85,
    reviewsCount: 119,
    tags: ['cloudtec', 'marathon', 'cushion'],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    description: 'Featuring maximum CloudTec cushioning for monster bounce and incredible energy return.',
    status: 'published',
  },
  {
    id: 'prd-006',
    title: 'Asics Gel-Kayano 30 Platinum',
    brand: 'Asics',
    sku: 'SHZ-ASC-KAY30',
    barcode: '455045612398',
    category: 'Women Footwear',
    subCategory: 'Running & Training',
    childCategory: 'Tempo & Speed',
    price: 160,
    compareAtPrice: 175,
    costPrice: 78,
    stock: 15,
    lowStockThreshold: 6,
    rating: 4.8,
    reviewsCount: 94,
    tags: ['stability', 'gel-technology'],
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    description: 'Advanced stability with pure comfort from 5Ks to full marathon courses.',
    status: 'published',
  },
];

// ==========================================
// INITIAL ORDERS
// ==========================================

export const INITIAL_ORDERS = [
  {
    id: 'ord-8831',
    orderNumber: 'SHZ-8831',
    customer: {
      id: 'cust-101',
      name: 'Liam Harrington',
      email: 'liam.h@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 349-1029',
    },
    items: [
      {
        id: 'prd-001',
        title: 'Nike Air Zoom Pegasus 40',
        variant: 'Black/Volt / US 10',
        quantity: 1,
        price: 130,
      },
    ],
    totalAmount: 142.50,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card (Stripe)',
    orderStatus: 'processing',
    createdAt: '25 minutes ago',
    shippingAddress: '452 Broadway Ave, Apt 4B, New York, NY 10013',
  },
  {
    id: 'ord-8830',
    orderNumber: 'SHZ-8830',
    customer: {
      id: 'cust-102',
      name: 'Sophia Chen',
      email: 'sophia.c@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 782-9014',
    },
    items: [
      {
        id: 'prd-005',
        title: 'On Cloudmonster 2 Max Cushion',
        variant: 'Undyed White / US 7.5',
        quantity: 1,
        price: 170,
      },
    ],
    totalAmount: 170.00,
    paymentStatus: 'paid',
    paymentMethod: 'bKash Online',
    orderStatus: 'shipped',
    createdAt: '2 hours ago',
    shippingAddress: '782 King Street, San Francisco, CA 94107',
  },
  {
    id: 'ord-8829',
    orderNumber: 'SHZ-8829',
    customer: {
      id: 'cust-103',
      name: 'David K. Miller',
      email: 'david.miller@example.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 991-4412',
    },
    items: [
      {
        id: 'prd-003',
        title: 'New Balance 990v6 Made in USA',
        variant: 'Grey / US 11',
        quantity: 1,
        price: 200,
      },
      {
        id: 'prd-001',
        title: 'Nike Air Zoom Pegasus 40',
        variant: 'Pure White / US 11',
        quantity: 1,
        price: 130,
      },
    ],
    totalAmount: 349.00,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    orderStatus: 'delivered',
    createdAt: 'Yesterday, 4:15 PM',
    shippingAddress: '1240 Elm St, Chicago, IL 60611',
  },
  {
    id: 'ord-8828',
    orderNumber: 'SHZ-8828',
    customer: {
      id: 'cust-104',
      name: 'Amara Jackson',
      email: 'amara.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      phone: '+1 (555) 812-4560',
    },
    items: [
      {
        id: 'prd-002',
        title: 'Adidas Ultraboost Light',
        variant: 'Core Black / US 9',
        quantity: 1,
        price: 190,
      },
    ],
    totalAmount: 190.00,
    paymentStatus: 'pending',
    paymentMethod: 'Cash On Delivery',
    orderStatus: 'pending',
    createdAt: '1 day ago',
    shippingAddress: '903 Market Blvd, Austin, TX 78701',
  },
];

// ==========================================
// INITIAL COUPONS
// ==========================================

export const INITIAL_COUPONS = [
  {
    id: 'cpn-01',
    code: 'SHOEZY10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 80,
    maxDiscount: 25,
    validFrom: '2025-01-01',
    validUntil: '2026-12-31',
    usageLimit: 1000,
    timesUsed: 348,
    status: 'active',
  },
  {
    id: 'cpn-02',
    code: 'SPRING20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 120,
    maxDiscount: 50,
    validFrom: '2025-03-01',
    validUntil: '2025-06-01',
    usageLimit: 500,
    timesUsed: 122,
    status: 'active',
  },
  {
    id: 'cpn-03',
    code: 'RUNFAST25',
    discountType: 'fixed',
    discountValue: 25,
    minOrderValue: 150,
    maxDiscount: 25,
    validFrom: '2025-02-01',
    validUntil: '2025-08-31',
    usageLimit: 250,
    timesUsed: 89,
    status: 'active',
  },
  {
    id: 'cpn-04',
    code: 'VIPBLACK',
    discountType: 'percentage',
    discountValue: 30,
    minOrderValue: 200,
    maxDiscount: 100,
    validFrom: '2024-11-20',
    validUntil: '2024-12-05',
    usageLimit: 100,
    timesUsed: 100,
    status: 'inactive',
  },
];

// ==========================================
// INITIAL AUDIT LOGS
// ==========================================

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-991',
    timestamp: '10m ago',
    actor: {
      id: 'usr-admin-1',
      name: 'Aiden Vance',
      email: 'admin@shoezy.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Super Admin',
    },
    action: 'INVENTORY_REPLENISHED',
    entity: 'Product',
    entityId: 'prd-001',
    details: 'Stock increased +12 units for Nike Air Zoom Pegasus 40',
    severity: 'info',
    status: 'Success',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'aud-990',
    timestamp: '42m ago',
    actor: {
      id: 'usr-manager-1',
      name: 'Sarah Connor',
      email: 'manager@shoezy.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      role: 'Store Manager',
    },
    action: 'ORDER_STATUS_UPDATED',
    entity: 'Order',
    entityId: 'ord-8830',
    details: 'Order #SHZ-8830 advanced to Shipped via FedEx tracking #9240182',
    severity: 'info',
    status: 'Success',
    ipAddress: '192.168.1.18',
  },
  {
    id: 'aud-989',
    timestamp: '2h ago',
    actor: {
      id: 'usr-manager-1',
      name: 'Sarah Connor',
      email: 'manager@shoezy.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      role: 'Store Manager',
    },
    action: 'COUPON_CREATED',
    entity: 'Promotion',
    entityId: 'cpn-02',
    details: 'Created coupon campaign "SPRING20" (20% off over $120)',
    severity: 'info',
    status: 'Success',
    ipAddress: '192.168.1.18',
  },
  {
    id: 'aud-988',
    timestamp: '5h ago',
    actor: {
      id: 'usr-inventory-1',
      name: 'Marcus Sterling',
      email: 'inventory@shoezy.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Inventory Lead',
    },
    action: 'CATEGORY_ADDED',
    entity: 'Taxonomy',
    entityId: 'cat-care',
    details: 'Created category node "Shoe Care & Accessories"',
    severity: 'info',
    status: 'Success',
    ipAddress: '192.168.1.99',
  },
];

// ==========================================
// INITIAL CUSTOMERS
// ==========================================

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-101',
    name: 'Liam Harrington',
    email: 'liam.h@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    ordersCount: 6,
    totalSpent: 840.50,
    location: 'New York, USA',
    status: 'VIP Customer',
    joinDate: 'Oct 2024',
  },
  {
    id: 'cust-102',
    name: 'Sophia Chen',
    email: 'sophia.c@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    ordersCount: 4,
    totalSpent: 620.00,
    location: 'California, USA',
    status: 'Active',
    joinDate: 'Nov 2024',
  },
  {
    id: 'cust-103',
    name: 'David K. Miller',
    email: 'david.miller@example.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    ordersCount: 9,
    totalSpent: 1450.00,
    location: 'Illinois, USA',
    status: 'VIP Customer',
    joinDate: 'Aug 2024',
  },
  {
    id: 'cust-104',
    name: 'Amara Jackson',
    email: 'amara.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    ordersCount: 2,
    totalSpent: 290.00,
    location: 'Texas, USA',
    status: 'Active',
    joinDate: 'Dec 2024',
  },
];
