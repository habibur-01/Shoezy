# 🛒 E-Commerce Customer System — Frontend & Backend Roadmap

> A step-by-step development guide for building the **customer-facing side** of an e-commerce platform.
>
> **Recommended stack**
>
> - Frontend: React + Vite + JavaScript
> - Styling: Tailwind CSS
> - Routing: React Router
> - Server state: TanStack Query
> - Client/global state: Redux Toolkit
> - Forms: Formik + Yup
> - Backend: Node.js + Express + JavaScript
> - Database: MongoDB + Mongoose
> - Authentication: JWT with secure refresh-token strategy
> - Image storage: Cloudinary storage

---

# 1. Project Scope

This roadmap covers only the **customer-facing e-commerce system**.

## Customer Frontend

- Authentication
- Homepage
- Navigation
- Categories
- Product listing
- Search
- Filters
- Sorting
- Product details
- Product variants
- Wishlist
- Cart
- Addresses
- Checkout
- Coupons
- Payments
- Orders
- Order tracking
- Cancellation
- Returns/refunds
- Reviews
- Notifications
- Profile
- Settings
- Support
- Responsive design

## Customer Backend

- Authentication APIs
- Customer profile APIs
- Address APIs
- Public catalog APIs
- Search/filter APIs
- Wishlist APIs
- Cart APIs
- Coupon validation
- Checkout calculation
- Order creation
- Payment verification
- Shipping/tracking
- Return/refund APIs
- Review APIs
- Notification APIs
- Security and authorization

---

# 2. Development Rules

Before starting, follow these rules:

1. Build features in the order defined in this README.
2. Do not build checkout before cart and address management are complete.
3. Do not build payment before order creation is designed.
4. Do not trust prices sent by the frontend.
5. Do not trust stock quantities sent by the frontend.
6. Do not trust discounts or coupon calculations from the frontend.
7. Validate all user input on the backend.
8. A customer must only access their own private data.
9. Use loading, empty, error, and success states in the frontend.
10. Keep API calls separate from UI components.
11. Keep business logic out of Express controllers.
12. Do not use `any` unless unavoidable.
13. Complete and test the current phase before moving to the next.
14. Do not implement future phases automatically.

---

# 3. Recommended Customer Architecture

## Frontend

```text
frontend/
└── src/
    ├── assets/
    ├── components/
    │   ├── common/
    │   ├── layout/
    │   ├── product/
    │   ├── cart/
    │   ├── checkout/
    │   └── ui/
    │
    ├── features/
    │   ├── auth/
    │   ├── products/
    │   ├── wishlist/
    │   ├── cart/
    │   ├── checkout/
    │   ├── orders/
    │   ├── addresses/
    │   └── notifications/
    │
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── routes/
    ├── services/
    ├── store/
    ├── utils/
    └── main.jsx
```

## Backend

A module-oriented structure is recommended:

```text
backend/
└── src/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── addresses/
    │   ├── categories/
    │   ├── brands/
    │   ├── products/
    │   ├── wishlist/
    │   ├── cart/
    │   ├── coupons/
    │   ├── checkout/
    │   ├── orders/
    │   ├── payments/
    │   ├── shipping/
    │   ├── returns/
    │   ├── reviews/
    │   └── notifications/
    │
    ├── config/
    ├── middlewares/
    ├── utils/
    ├── app.js
    └── server.js
```

Each module should preferably contain:

```text
module/
├── model.ts
├── validation.ts
├── service.ts
├── controller.ts
├── routes.ts
└── types.ts
```

---

# PHASE 0 — Project Setup

## Goal

Prepare frontend, backend, database, routing, API communication, and shared development standards.

## Backend Tasks

- [ ] Initialize Node.js project
- [ ] Configure JavaScript
- [ ] Install Express
- [ ] Configure environment variables
- [ ] Connect MongoDB
- [ ] Configure Mongoose
- [ ] Create Express app
- [ ] Add `/health` endpoint
- [ ] Add centralized error handling
- [ ] Add 404 middleware
- [ ] Configure CORS
- [ ] Add security headers
- [ ] Add rate limiting
- [ ] Configure request logging

## Frontend Tasks

- [ ] Create React + Vite + JavaScript project
- [ ] Configure Tailwind CSS
- [ ] Configure React Router
- [ ] Configure TanStack Query
- [ ] Configure Redux Toolkit
- [ ] Create API client
- [ ] Configure environment variables
- [ ] Create global layout
- [ ] Create error boundary
- [ ] Create not-found page

## Done When

- [ ] Frontend runs
- [ ] Backend runs
- [ ] MongoDB connects
- [ ] Frontend can call backend
- [ ] Health endpoint works

---

# PHASE 1 — Authentication

## Goal

Allow customers to securely create and access accounts.

## Backend

### User Model

```text
id
firstName
lastName
username
email
phone
passwordHash
avatar
role
status
emailVerified
phoneVerified
lastLoginAt
createdAt
updatedAt
```

### Features

- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Refresh authentication
- [ ] Get current customer
- [ ] Email verification
- [ ] Resend verification
- [ ] Forgot password
- [ ] Reset password
- [ ] Change password

### APIs

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/verify-email
```

### Security

- [ ] Hash passwords
- [ ] Validate passwords
- [ ] Rate-limit login
- [ ] Secure refresh-token handling
- [ ] Do not expose password hashes
- [ ] Prevent account enumeration where practical

## Frontend

Pages:

- [ ] Login
- [ ] Register
- [ ] Forgot password
- [ ] Reset password
- [ ] Verify email

Components:

- [ ] Login form
- [ ] Register form
- [ ] Password input
- [ ] Password strength indicator
- [ ] Protected route

States:

- [ ] Loading
- [ ] Validation error
- [ ] Server error
- [ ] Success message

## Done When

- [ ] Customer can register
- [ ] Customer can login
- [ ] Session restoration works
- [ ] Customer can logout
- [ ] Password reset works
- [ ] Protected pages work

---

# PHASE 2 — Customer Profile

## Backend

Features:

- [x] Get profile
- [x] Update first name
- [x] Update last name
- [x] Update username
- [x] Update phone (resets phoneVerified = false for OTP verification at checkout)
- [x] Email change blocked (Email address cannot be changed via profile update API)
- [x] Upload/change avatar (Separate API: PATCH /api/user/me/avatar)
- [x] Change password
- [x] Account status

API:

```text
GET   /api/user/me
PATCH /api/user/me
PATCH /api/user/me/avatar
PATCH /api/user/me/password
```

## Frontend

Pages:

- [x] My Account
- [x] Edit Profile
- [x] Change Password

Components:

- [x] Avatar uploader
- [x] Profile form
- [x] Password form

## Done When

- [x] Customer sees profile
- [x] Customer updates profile
- [x] Avatar upload works
- [x] Password change works

---

# PHASE 3 — Address Management

## Goal

Customers can manage addresses before checkout is built.

## Backend

Address fields:

```text
id
user
firstName
lastName
phone
country
divisionOrState
city
area
postalCode
addressLine
addressType
isDefault
createdAt
updatedAt
```

Features:

- [x] Create address
- [x] List addresses
- [x] Get address
- [x] Update address
- [x] Delete address
- [x] Set default address

API:

```text
GET    /api/user/address
POST   /api/user/address
GET    /api/user/address/:id
PUT    /api/user/address/:id
PATCH  /api/user/address/:id
DELETE /api/user/address/:id
PATCH  /api/user/address/:id/default
```

Security rule:

```text
A customer can only access their own addresses.
```

## Frontend

- [x] Address list
- [x] Add address
- [x] Edit address
- [x] Delete address
- [x] Default address badge
- [x] Set default address

## Done When

- [x] CRUD works
- [x] Ownership is enforced
- [x] One address can be selected as default

---

# PHASE 4 — Public Store Layout

## Goal

Build the reusable customer-facing shell.

## Frontend

### Layout

- [x] Header
- [x] Desktop navigation
- [x] Mobile navigation
- [x] Footer
- [x] Search area
- [x] Account menu
- [x] Cart indicator
- [x] Wishlist indicator
- [x] Breadcrumbs

### Pages

- [x] Home
- [x] Shop
- [x] Category
- [x] Brand
- [x] Product details
- [x] Search results
- [x] 404

### Responsive

Test:

- [x] Mobile
- [x] Tablet
- [x] Desktop

## Done When

- [x] Navigation works
- [x] Responsive menu works
- [x] All public routes render correctly

---

# PHASE 5 — Product Catalog

> Product creation can be handled by the admin system. This phase focuses on customer access to products.

## Backend

### Public APIs

- [x] List products
- [x] Product details
- [x] Product by slug
- [x] Featured products
- [x] New arrivals
- [x] Best sellers
- [x] Related products

API:

```text
GET /api/products
GET /api/products/details/:slug
GET /api/products/:categorySlug
GET /api/products/:categorySlug/:subSlug
```

### Product Response

Return only data required by customers:

```text
id
name
slug
brand
category
shortDescription
description
price
salePrice
rating
reviewCount
stockStatus
images
attributes
variants
```

## Frontend

- [x] Product grid
- [x] Product card
- [x] Product image
- [x] Price display
- [x] Sale badge
- [x] Rating
- [x] Stock status
- [x] Pagination

## Done When

- [x] Product listing works
- [x] Pagination works
- [x] Product details open correctly

---

# PHASE 6 — Categories & Brands

## Backend

- [ ] Public category list
- [ ] Category details
- [ ] Products by category
- [ ] Public brand list
- [ ] Brand details
- [ ] Products by brand

API examples:

```text
GET /api/v1/categories
GET /api/v1/categories/:slug/products

GET /api/v1/brands
GET /api/v1/brands/:slug/products
```

## Frontend

- [ ] Category navigation
- [ ] Category cards
- [ ] Category product page
- [ ] Brand list
- [ ] Brand product page

---

# PHASE 7 — Search

## Backend

Support:

- [x] Product name
- [x] SKU where appropriate
- [x] Brand
- [x] Category
- [x] Tags / Description

Query example:

```text
GET /api/products?search=shoes
```

Features:

- [x] Debounced search support
- [x] Pagination
- [x] Search suggestions
- [x] Empty results

## Frontend

- [x] Search input
- [x] Debounce
- [x] Search results
- [x] Loading state
- [x] No-results state
- [x] Search suggestions

## Done When

- [x] Search does not spam API requests
- [x] Results are paginated
- [x] Empty state is handled

---

# PHASE 8 — Filtering & Sorting

## Backend

Supported filters:

- [x] Category
- [x] Brand
- [x] Minimum price
- [x] Maximum price
- [x] Rating
- [x] Color
- [x] Size
- [x] Availability
- [x] Discount

Sorting:

- [x] Newest
- [x] Price low to high
- [x] Price high to low
- [x] Highest rated
- [x] Best selling

Example:

```text
GET /api/products?brands=adidas&minPrice=50&maxPrice=500&sortBy=price_asc
```

## Frontend

- [x] Filter sidebar
- [x] Mobile filter drawer
- [x] Price range
- [x] Brand filters
- [x] Color filters
- [x] Size filters
- [x] Rating filters
- [x] Sort selector
- [x] Clear filters
- [x] Filter state in URL

## Done When

- [x] Filters can combine
- [x] URL reflects filters
- [x] Pagination resets after filter changes

---

# PHASE 9 — Product Details

## Frontend Features

- [x] Product gallery
- [x] Main image
- [x] Image thumbnails
- [x] Image zoom
- [x] Name
- [x] Brand
- [x] Price
- [x] Sale price
- [x] Discount
- [x] Rating
- [x] Description
- [x] Specifications
- [x] Color selector
- [x] Size selector
- [x] Variant selector
- [x] Quantity selector
- [x] Stock information
- [x] Add to cart
- [x] Buy now
- [x] Add to wishlist
- [x] Share product
- [x] Related products

## Backend Rules

When a variant is selected:

- [x] Validate variant exists
- [x] Return correct stock
- [x] Return correct price

Do not allow frontend to decide the actual order price.

---

# PHASE 10 — Wishlist

## Backend

Wishlist item:

```text
user
product
variant
createdAt
```

Features:

- [x] Get wishlist
- [x] Add item
- [x] Remove item
- [x] Check item
- [x] Wishlist count

API:

```text
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
```

## Frontend

- [x] Wishlist button
- [x] Wishlist page
- [x] Remove item
- [x] Move/add item to cart
- [x] Wishlist count

## Done When

- [x] Duplicate entries are prevented
- [x] Customer cannot access another customer's wishlist

---

# PHASE 11 — Shopping Cart

## Goal

Create a secure persistent cart.

## Backend

Cart structure:

```text
user
items[]
    product
    variant
    quantity
    selectedAttributes
createdAt
updatedAt
```

Features:

- [x] Get cart
- [x] Add item
- [x] Update quantity
- [x] Remove item
- [x] Clear cart

API:

```text
GET    /api/user/cart
POST   /api/user/cart/add
POST   /api/user/cart/sync
PUT    /api/user/cart/update
DELETE /api/user/cart/delete/:itemId
DELETE /api/user/cart/clear
```

## Backend Validation

For every cart operation:

## Frontend

- [x] Cart page
- [x] Cart item
- [x] Quantity controls
- [x] Remove item
- [x] Empty cart
- [x] Cart summary
- [x] Subtotal display
- [x] Continue shopping
- [x] Overlay loading indicator during API calls
- [x] All totals calculated exclusively by backend API

## Important

All cart sub-totals and final checkout amounts are calculated exclusively on the backend API.

---

# PHASE 12 — Coupon System

## Backend

Customer-facing features:

- [x] Apply coupon
- [x] Remove coupon
- [x] Validate coupon

Validation:

- [x] Active
- [x] Start date
- [x] Expiry date
- [x] Minimum order
- [x] Maximum discount
- [x] Usage limit
- [x] Per-user limit

API:

```text
POST   /api/user/cart/coupon
DELETE /api/user/cart/coupon
```

## Frontend

- [x] Coupon input
- [x] Apply button
- [x] Error message
- [x] Discount summary
- [x] Remove coupon button & active pill badge

---

# PHASE 13 — Checkout

## Dependency

Before starting:

```text
Authentication   ✓
Addresses        ✓
Cart             ✓
Products         ✓
Inventory        ✓
Coupons if any   ✓
phoneVerified    ✓
```

## Checkout Flow

```text
Cart
  ↓
Select Address
  ↓
Select Shipping
  ↓
Validate Coupon
  ↓
Review Order
  ↓
Create Payment
  ↓
Place Order
```

## Backend

Create a checkout service responsible for:

- [x] Load cart
- [x] Validate products
- [x] Validate variants
- [x] Validate stock
- [x] Load current prices
- [x] Calculate subtotal
- [x] Calculate discount
- [x] Calculate shipping
- [x] Calculate tax
- [x] Calculate final total

Example response:

```text
subtotal
discount
shippingFee
tax
total
items
coupon
shippingMethod
```

## Frontend

- [x] Checkout page
- [x] Address selection
- [x] Add address during checkout
- [x] Shipping method selection
- [x] Coupon
- [x] Order summary
- [x] Payment selection
- [x] Place order button

## Critical Rule

Never create an order using totals sent by the frontend. All calculations are validated on the backend API before placing orders.

---

# PHASE 14 — Payment

## Start Simple

Implement:

1. [ ] Cash on Delivery

Then integrate online providers.

Possible providers:

- [ ] bKash
- [ ] Nagad
- [ ] SSLCommerz
- [ ] Stripe
- [ ] PayPal

## Backend

Payment fields:

```text
order
provider
transactionId
amount
currency
status
providerResponse
createdAt
```

Features:

- [ ] Initialize payment
- [ ] Redirect/payment session if required
- [ ] Verify payment
- [ ] Webhook handling
- [ ] Prevent duplicate processing
- [ ] Handle failed payment

## Payment Status

```text
PENDING
PROCESSING
PAID
FAILED
CANCELLED
REFUNDED
```

## Frontend

- [ ] Payment method selector
- [ ] Payment processing state
- [ ] Success page
- [ ] Failed payment page
- [ ] Retry flow where appropriate

## Critical Rule

Payment success must be verified by the backend or provider webhook.

---

# PHASE 15 — Order Creation

## Backend

Order fields:

```text
orderNumber
customer
items
shippingAddress
subtotal
discount
shippingFee
tax
total
paymentMethod
paymentStatus
orderStatus
coupon
notes
createdAt
updatedAt
```

Order item snapshot should preserve:

```text
productId
productName
sku
variant
quantity
unitPrice
discount
subtotal
```

Features:

- [ ] Create order
- [ ] Generate unique order number
- [ ] Create immutable item snapshot
- [ ] Update/reserve inventory safely
- [ ] Clear purchased cart items
- [ ] Create customer notification

## Done When

- [ ] Duplicate orders are prevented
- [ ] Stock cannot become negative
- [ ] Customer receives correct order details

---

# PHASE 16 — Order History & Details

## Backend

- [ ] Customer order list
- [ ] Pagination
- [ ] Filter by status
- [ ] Order details
- [ ] Ownership validation

API:

```text
GET /api/v1/orders
GET /api/v1/orders/:orderId
```

## Frontend

- [ ] Order list
- [ ] Order details
- [ ] Status badge
- [ ] Order timeline
- [ ] Payment information
- [ ] Shipping address
- [ ] Item list

## Security

```text
Customer A must never access Customer B's order.
```

---

# PHASE 17 — Order Tracking

## Backend

- [ ] Shipment information
- [ ] Tracking number
- [ ] Status history
- [ ] Estimated delivery

Statuses:

```text
PENDING
CONFIRMED
PROCESSING
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
```

## Frontend

- [ ] Order timeline
- [ ] Current status
- [ ] Tracking number
- [ ] Estimated delivery
- [ ] Shipping provider information

---

# PHASE 18 — Order Cancellation

## Backend

Rules:

- [ ] Define cancellable statuses
- [ ] Validate ownership
- [ ] Restore/release inventory when applicable
- [ ] Handle paid order cancellation/refund workflow
- [ ] Store cancellation reason

## Frontend

- [ ] Cancel button when allowed
- [ ] Cancellation reason
- [ ] Confirmation dialog
- [ ] Success state

---

# PHASE 19 — Return & Refund

## Customer Features

- [ ] Request return
- [ ] Select return reason
- [ ] Add description
- [ ] Upload images
- [ ] View return status
- [ ] View refund status

Return statuses:

```text
REQUESTED
APPROVED
REJECTED
PICKUP_SCHEDULED
RECEIVED
INSPECTED
REFUNDED
```

## Backend Rules

- [ ] Validate order ownership
- [ ] Validate return period
- [ ] Validate item quantity
- [ ] Prevent duplicate return requests
- [ ] Link refund to payment/order

## Frontend

- [ ] Return request form
- [ ] Image upload
- [ ] Return history
- [ ] Status timeline

---

# PHASE 20 — Reviews & Ratings

## Backend

Review fields:

```text
user
product
rating
title
comment
images
status
verifiedPurchase
createdAt
updatedAt
```

Features:

- [ ] Create review
- [ ] Update review
- [ ] Delete review
- [ ] List product reviews
- [ ] Rating summary

Recommended rule:

```text
Only verified purchasers can review a product.
```

## Frontend

- [ ] Review list
- [ ] Rating summary
- [ ] Rating breakdown
- [ ] Review form
- [ ] Star selector
- [ ] Image upload
- [ ] Verified purchase badge

---

# PHASE 21 — Recently Viewed Products

## Frontend First

Initially:

- [ ] Store recently viewed IDs locally
- [ ] Limit list size
- [ ] Remove duplicates
- [ ] Show recently viewed section

Later backend synchronization can be added for logged-in customers.

---

# PHASE 22 — Notifications

## Backend

Notification fields:

```text
user
type
title
message
data
readAt
createdAt
```

Events:

- [ ] Order created
- [ ] Payment success
- [ ] Payment failed
- [ ] Order confirmed
- [ ] Order shipped
- [ ] Out for delivery
- [ ] Delivered
- [ ] Cancelled
- [ ] Refund processed
- [ ] Return status changed

API:

```text
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
PATCH /api/v1/notifications/read-all
```

## Frontend

- [ ] Notification bell
- [ ] Unread count
- [ ] Notification dropdown
- [ ] Notification page
- [ ] Mark as read
- [ ] Mark all as read

---

# PHASE 23 — Customer Settings

## Frontend

Pages:

- [ ] Account settings
- [ ] Security settings
- [ ] Notification preferences

Features:

- [ ] Change password
- [ ] Email preferences
- [ ] Marketing preferences
- [ ] Notification preferences

## Backend

- [ ] Update preferences
- [ ] Get preferences
- [ ] Secure password change

---

# PHASE 24 — Customer Support

## Features

- [ ] Contact form
- [ ] FAQ
- [ ] Support ticket creation
- [ ] Ticket history
- [ ] Ticket details
- [ ] Customer replies
- [ ] Ticket status

Ticket statuses:

```text
OPEN
IN_PROGRESS
WAITING_FOR_CUSTOMER
RESOLVED
CLOSED
```

---

# PHASE 25 — Homepage

Build after the basic catalog APIs are stable.

## Sections

- [ ] Hero banner
- [ ] Promotional banners
- [ ] Categories
- [ ] Featured products
- [ ] New arrivals
- [ ] Best sellers
- [ ] Trending products
- [ ] Flash sale
- [ ] Brand section
- [ ] Recently viewed
- [ ] Newsletter

## Backend

Public endpoints may provide:

```text
GET /api/v1/home
```

Or separate endpoints:

```text
/products/featured
/products/new-arrivals
/products/best-sellers
/categories
/banners
```

---

# PHASE 26 — Product Recommendations

Start with simple rules.

- [ ] Same category
- [ ] Same brand
- [ ] Best sellers
- [ ] Recently viewed
- [ ] Frequently bought together

Do not start with AI unless the basic recommendation system is stable.

---

# PHASE 27 — SEO

## Product Pages

- [ ] SEO title
- [ ] Meta description
- [ ] Canonical URL
- [ ] Open Graph metadata
- [ ] Product structured data

## Store

- [ ] SEO-friendly URLs
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Breadcrumbs

---

# PHASE 28 — Performance

## Frontend

- [ ] Lazy load pages
- [ ] Code splitting
- [ ] Image optimization
- [ ] Lazy load images
- [ ] Debounce search
- [ ] Cache API queries
- [ ] Avoid unnecessary re-renders

## Backend

- [ ] Database indexes
- [ ] Pagination
- [ ] Query optimization
- [ ] Cache popular catalog queries
- [ ] Optimize product search

---

# PHASE 29 — Customer Security

## Authentication

- [ ] Secure password hashing
- [ ] Rate-limited login
- [ ] Refresh token rotation strategy
- [ ] Secure logout/revocation
- [ ] Password reset expiration

## Authorization

Every private endpoint must verify:

```text
Authenticated user
        ↓
Resource ownership
        ↓
Permission to perform action
```

Examples:

```text
GET /orders/:id
→ Verify order.customer === req.user.id

GET /addresses/:id
→ Verify address.user === req.user.id

DELETE /wishlist/:productId
→ Verify wishlist belongs to req.user
```

## Input Security

- [ ] Validate body
- [ ] Validate params
- [ ] Validate query
- [ ] Sanitize unsafe input
- [ ] Limit upload size
- [ ] Validate upload type

---

# PHASE 30 — Error & Empty States

Every customer page should support:

## Loading

```text
Loading products...
```

## Empty

```text
Your cart is empty.
Continue shopping.
```

## Error

```text
Unable to load products.
Retry
```

## Success

```text
Product added to cart.
```

Checklist:

- [ ] Auth pages
- [ ] Product pages
- [ ] Wishlist
- [ ] Cart
- [ ] Checkout
- [ ] Orders
- [ ] Notifications
- [ ] Addresses

---

# PHASE 31 — Responsive & Accessibility

## Responsive

Test:

- [ ] Small mobile
- [ ] Large mobile
- [ ] Tablet
- [ ] Laptop
- [ ] Desktop

## Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Form labels
- [ ] Image alt text
- [ ] Accessible buttons
- [ ] Color contrast
- [ ] Error messages announced/accessibly associated

---

# PHASE 32 — Testing

## Backend

Test critical flows:

- [ ] Register
- [ ] Login
- [ ] Password reset
- [ ] Address ownership
- [ ] Product search
- [ ] Cart validation
- [ ] Stock validation
- [ ] Coupon validation
- [ ] Checkout calculation
- [ ] Order ownership
- [ ] Payment verification
- [ ] Return rules
- [ ] Review rules

## Frontend

- [ ] Form validation
- [ ] Protected routes
- [ ] Product interactions
- [ ] Cart quantity updates
- [ ] Checkout flow
- [ ] Error states

## Critical Security Tests

- [ ] Customer cannot access another customer's order
- [ ] Customer cannot edit another customer's address
- [ ] Customer cannot access another customer's cart
- [ ] Frontend cannot override product price
- [ ] Frontend cannot order more than available stock
- [ ] Coupon limits cannot be bypassed
- [ ] Payment success cannot be faked from the frontend

---

# PHASE 33 — Final Customer Flow Testing

Test the entire journey:

```text
Visit Store
    ↓
Browse Products
    ↓
Search / Filter
    ↓
View Product
    ↓
Select Variant
    ↓
Add to Wishlist or Cart
    ↓
Login / Register
    ↓
Manage Address
    ↓
Apply Coupon
    ↓
Checkout
    ↓
Select Payment
    ↓
Place Order
    ↓
Track Order
    ↓
Receive Product
    ↓
Review Product
```

Every step must handle:

- [ ] Loading
- [ ] Validation
- [ ] API error
- [ ] Network failure
- [ ] Empty data
- [ ] Success

---

# CUSTOMER MVP DEVELOPMENT ORDER

Build in this exact order:

```text
01. Project Setup
        ↓
02. Authentication
        ↓
03. Customer Profile
        ↓
04. Address Management
        ↓
05. Store Layout
        ↓
06. Product Catalog
        ↓
07. Categories & Brands
        ↓
08. Search
        ↓
09. Filtering & Sorting
        ↓
10. Product Details
        ↓
11. Wishlist
        ↓
12. Cart
        ↓
13. Coupons
        ↓
14. Checkout Calculation
        ↓
15. Payment
        ↓
16. Order Creation
        ↓
17. Order History
        ↓
18. Order Tracking
        ↓
19. Order Cancellation
        ↓
20. Reviews
        ↓
21. Notifications
        ↓
22. Returns & Refunds
        ↓
23. Homepage Improvements
        ↓
24. Recommendations
        ↓
25. SEO
        ↓
26. Performance
        ↓
27. Security Review
        ↓
28. Testing
```

---

# MVP CHECKLIST

## Authentication

- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Refresh authentication
- [ ] Forgot password
- [ ] Reset password
- [ ] Email verification

## Customer

- [ ] Profile
- [ ] Avatar
- [ ] Change password
- [ ] Address management

## Shopping

- [ ] Product listing
- [ ] Categories
- [ ] Brands
- [ ] Search
- [ ] Filters
- [ ] Sorting
- [ ] Product details
- [ ] Variants

## Wishlist & Cart

- [ ] Wishlist
- [ ] Add to cart
- [ ] Update quantity
- [ ] Remove item
- [ ] Persistent cart

## Checkout

- [ ] Address selection
- [ ] Shipping
- [ ] Coupon
- [ ] Order summary
- [ ] Payment
- [ ] Order creation

## Orders

- [ ] Order history
- [ ] Order details
- [ ] Tracking
- [ ] Cancellation

## Customer Experience

- [ ] Reviews
- [ ] Notifications
- [ ] Responsive design
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

---

# Definition of Done

Do not mark a phase complete until all relevant items are complete:

## Backend

- [ ] Database model
- [ ] Validation
- [ ] Service/business logic
- [ ] Controller
- [ ] Route
- [ ] Authentication
- [ ] Authorization/ownership
- [ ] Error handling
- [ ] Tests

## Frontend

- [ ] API service
- [ ] Query/mutation hooks
- [ ] Page
- [ ] Reusable components
- [ ] Form validation
- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Success feedback
- [ ] Responsive behavior

## Quality

- [ ] Type checking passes
- [ ] Linting passes
- [ ] Tests pass
- [ ] No critical security issue
- [ ] README checklist updated

---

# Codex Instructions

Use the following workflow when working with an AI coding agent.

```text
You are working on the Customer E-Commerce System described in this README.md.

Before making changes:

1. Read README.md completely.
2. Inspect the existing frontend and backend.
3. Identify the current incomplete phase.
4. Check what has already been implemented.
5. Do not duplicate existing functionality.
6. Do not implement future phases.

For the current phase:

BACKEND
- Follow the existing architecture.
- Keep controllers thin.
- Put business logic in services.
- Validate body, params, and query values.
- Add authentication where required.
- Enforce customer ownership for private resources.
- Never trust frontend price, stock, discount, tax, payment, or permission values.
- Return consistent API responses.
- Handle errors centrally.

FRONTEND
- Keep API logic separate from UI.
- Use reusable components.
- Use TypeScript strictly.
- Add loading, empty, error, and success states.
- Make the feature responsive.
- Reuse existing hooks/components where possible.

AFTER IMPLEMENTATION

1. Run type checking.
2. Run linting.
3. Run tests.
4. Fix all errors.
5. Update the relevant README checklist.
6. Summarize:
   - Files created
   - Files changed
   - APIs added/changed
   - Database changes
   - Tests added
   - Manual setup required

Do not automatically start the next phase.
```

---

# Prompt for Starting a Phase

Use this prompt:

```text
Read the Customer E-Commerce README roadmap and inspect the current codebase.

Implement only:

PHASE [NUMBER] — [PHASE NAME]

Requirements:

1. Check what is already implemented.
2. Do not duplicate existing code.
3. Follow the current project architecture.
4. Complete both backend and frontend tasks for this phase.
5. Use strict TypeScript.
6. Add validation and error handling.
7. Enforce authentication and ownership where required.
8. Add loading, empty, error, and success states.
9. Do not implement future phases.
10. Run typecheck, lint, and tests.
11. Fix errors.
12. Update the README checklist.

At the end, provide a summary of all changes.
```

---

# Important Business Rules

## Price

```text
Frontend price is display data.
Backend/database price is authoritative.
```

## Stock

```text
Requested quantity <= validated available stock
```

Stock must be checked again during checkout/order creation.

## Coupon

Always validate:

```text
Active
Start date
Expiry date
Minimum order
Maximum discount
Global usage limit
Per-user usage limit
Eligible items
```

## Ownership

Every private resource must be checked:

```text
Customer can access only their:
- Profile
- Addresses
- Cart
- Wishlist
- Orders
- Returns
- Notifications
- Support tickets
```

## Payment

```text
Frontend payment success is not proof of payment.
```

Verify payment through the provider/backend flow.

---

# Final Customer System

```text
                    CUSTOMER
                       │
      ┌────────────────┼─────────────────┐
      │                │                 │
 AUTHENTICATION     SHOPPING          ACCOUNT
      │                │                 │
 Register           Products          Profile
 Login              Search            Addresses
 Reset Password     Filters           Orders
 Verify Email       Wishlist          Notifications
                    Cart              Settings
                    Checkout
                    Payment
                       │
                       ▼
                     ORDER
                       │
              ┌────────┼────────┐
              │        │        │
           Tracking  Cancel   Return
                       │
                    Refund
                       │
                    Review
```

---

# Final Goal

The customer system is complete when a user can safely:

```text
Discover
   ↓
Search
   ↓
Compare and choose
   ↓
Add to wishlist/cart
   ↓
Login
   ↓
Manage address
   ↓
Apply coupon
   ↓
Checkout
   ↓
Pay
   ↓
Track order
   ↓
Receive product
   ↓
Review product
   ↓
Request return if necessary
```

Build the **MVP first**, test the complete customer journey, then add advanced features.
