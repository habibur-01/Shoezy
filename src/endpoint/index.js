// Auth endpoints
export const SIGNUP_ENDPOINT = "/api/user/signup";
export const REGISTER_ENDPOINT = "/api/user/register";
export const LOGIN_ENDPOINT = "/api/user/login";
export const ADMIN_LOGIN_ENDPOINT = "/api/admin/login";
export const LOGOUT_ENDPOINT = "/api/user/logout";
export const REFRESH_TOKEN_ENDPOINT = "/api/user/refresh-token";
export const GET_ME_ENDPOINT = "/api/user/me";
export const UPDATE_PROFILE_ENDPOINT = "/api/user/me";
export const UPDATE_AVATAR_ENDPOINT = "/api/user/me/avatar";
export const CHANGE_PASSWORD_ENDPOINT = "/api/user/me/password";
export const FORGOT_PASSWORD_ENDPOINT = "/api/user/forgot-password";
export const RESET_PASSWORD_ENDPOINT = "/api/user/reset-password";
export const VERIFY_EMAIL_ENDPOINT = "/api/user/verify-email";
export const RESEND_VERIFICATION_ENDPOINT = "/api/user/resend-verification";

// Billing address & Address Management
export const ADDRESS_ENDPOINT = "/api/user/address";
export const BILLING_ADDRESS_ENDPOINT = "/api/user/billing-address";
export const HAS_ADDRESS_ENDPOINT = "/api/user/billing-address/check";

// category
export const GET_CATEGORIES_ENDPOINT = "/api/user/category"
export const GET_SUBCATEGORIES_ENDPOINT = "/api/user/sub-category"
export const GET_NAVBAR_ENDPOINT = "/api/user/navbar"
// products
export const GET_PRODUCTS_ENDPOINT = "/api/products"
export const GET_SINGLE_PRODUCT_ENDPOINT = "/api/products/details"
// Cart
export const POST_CART_ITEM_ENDPOINT = "/api/user/cart/add"
export const GET_CART_ITEM_ENDPOINT = "/api/user/cart"
export const GET_CART_ITEM_UPDATE_ENDPOINT = "/api/user/cart/update"
export const REMOVE_CART_ITEM_ENDPOINT = "/api/user/cart/delete"
export const CLEAR_CART_ITEM_ENDPOINT = "/api/user/cart/clear"
export const COUNT_CART_ITEM_ENDPOINT = "/api/user/cart/count"

// coupon 
export const APPLY_COUPON_CODE_ENDPOINT = "/api/user/coupon/apply"

// Review
export const POST_REVIEW_ENDPOINT = "/api/user/review/add"
export const GET_REVIEW_ENDPOINT = "/api/user/review"
export const DELETE_REVIEW_ENDPOINT = "/api/user/review/delete"
export const CHECK_CAN_REVIEW_ENDPOINT = "/api/user/review/can-review"

// Order
export const CREATE_ORDER_ENDPOINT = "/api/user/order/create";
export const GET_ORDER_ENDPOINT = "/api/user/order";

// Admin Products
export const ADMIN_PRODUCTS_ENDPOINT = "/api/admin/product";
export const ADMIN_PRODUCT_ADD_ENDPOINT = "/api/admin/product/add";
export const ADMIN_PRODUCT_UPDATE_ENDPOINT = "/api/admin/product";
export const ADMIN_PRODUCT_DELETE_ENDPOINT = "/api/admin/product";
export const ADMIN_PRODUCT_STOCK_ENDPOINT = "/api/admin/product";
export const ADMIN_PRODUCT_UPLOAD_IMAGES_ENDPOINT = "/api/admin/product/upload-images";
export const UPLOAD_PRODUCT_IMAGES_ENDPOINT = "/api/products/upload-product-images";

// Admin Dashboard
export const ADMIN_DASHBOARD_ENDPOINT = "/api/admin/dashboard";

// Admin Categories & Taxonomy Hierarchy
export const ADMIN_CATEGORY_ENDPOINT = "/api/admin/category";
export const ADMIN_CATEGORY_TREE_ENDPOINT = "/api/admin/category/tree";
export const ADMIN_CATEGORY_ADD_ENDPOINT = "/api/admin/category/add";
export const ADMIN_SUBCATEGORY_ENDPOINT = "/api/admin/sub-category";
export const ADMIN_SUBCATEGORY_ADD_ENDPOINT = "/api/admin/sub-category/add";
export const ADMIN_CHILDCATEGORY_ENDPOINT = "/api/admin/child-category";
export const ADMIN_CHILDCATEGORY_ADD_ENDPOINT = "/api/admin/child-category/add";

// Admin Users & RBAC
export const ADMIN_USERS_ENDPOINT = "/api/admin/users";

// Admin Orders & Fulfillment
export const ADMIN_ORDERS_ENDPOINT = "/api/admin/orders";

// Admin Coupons
export const ADMIN_COUPONS_ENDPOINT = "/api/admin/coupon";
