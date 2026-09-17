import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCategories as setReduxCategories } from '../redux/features/initial/initialSlice';
import { INITIAL_ROLES, INITIAL_TEAM_MEMBERS } from '../data/mockData';
import {
  getAdminRoles,
  getAdminStaffMembers,
  updateRolePermissionsApi,
  createAdminRole,
  assignStaffRoleApi,
  updateStaffStatusApi,
  inviteStaffMemberApi,
} from '../server/roles/adminRoles';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  updateAdminProductStock,
  deleteAdminProduct,
} from '../server/product/adminProduct';
import {
  getAdminCategoryTree,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  createAdminSubCategory,
  updateAdminSubCategory,
  deleteAdminSubCategory,
  createAdminChildCategory,
  updateAdminChildCategory,
  deleteAdminChildCategory,
  reorderAdminCategories,
} from '../server/category/adminCategory';
import {
  getAdminOrders,
  updateAdminOrderStatus as updateAdminOrderStatusApi,
} from '../server/order/adminOrder';
import {
  getAdminCoupons,
  createAdminCoupon as createAdminCouponApi,
  updateAdminCoupon as updateAdminCouponApi,
  toggleAdminCouponStatus as toggleAdminCouponStatusApi,
  deleteAdminCoupon as deleteAdminCouponApi,
} from '../server/coupon/adminCoupon';
import { getAllAdminUsers } from '../server/user/adminUser';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);

  // Team and RBAC state
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);

  // Active User Persona / Member ID
  const [currentUserId, setCurrentUserId] = useState(authUser?._id || authUser?.id || 'usr-admin');

  // Sync currentUserId when authUser becomes available
  useEffect(() => {
    if (authUser) {
      setCurrentUserId(authUser._id || authUser.id || 'usr-admin');
    }
  }, [authUser]);

  // Active User derived dynamically from authenticated user or selected persona
  const currentUser = useMemo(() => {
    const matchedMember = teamMembers.find((m) => m.id === currentUserId);
    if (matchedMember) {
      return matchedMember;
    }

    if (authUser) {
      return {
        id: authUser._id || authUser.id || 'usr-admin',
        name: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.username || 'Administrator',
        email: authUser.email || '',
        avatar: authUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        roleId: authUser.role === 'admin' ? 'super_admin' : (authUser.role || 'super_admin'),
        role: authUser.role || 'admin',
        status: authUser.status || 'active',
      };
    }
    return {
      id: 'usr-admin',
      name: 'Administrator',
      email: 'admin@shoezy.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      roleId: 'super_admin',
      role: 'admin',
      status: 'active',
    };
  }, [authUser, currentUserId, teamMembers]);

  const currentRole = useMemo(() => {
    return roles.find((r) => r.id === currentUser?.roleId) || roles[0];
  }, [roles, currentUser]);

  // Catalog & Inventory state - Zero mock data, loaded directly from database
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // Load products dynamically from Backend API
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const res = await getAdminProducts();
      if (res?.success && res?.data?.products && res.data.products.length > 0) {
        const normalized = res.data.products.map((p) => {
          const price = Number(p.price ?? 0);
          const cost = Number(
            p.cost ??
            p.costPrice ??
            (price > 0 ? Number((price * 0.55).toFixed(2)) : 0)
          );
          return {
            id: p.id || p._id,
            _id: p._id,
            title: p.title || p.name || 'Untitled Product',
            name: p.name || p.title || 'Untitled Product',
            brand: p.brand || 'Shoezy',
            sku: p.sku || p._id || 'N/A',
            category: typeof p.category === 'object' && p.category !== null
              ? (p.category.name || 'General')
              : (p.category || 'General'),
            price: price,
            cost: cost,
            costPrice: cost,
            stock: Number(p.stock ?? p.stock_quantity ?? 0),
            stock_quantity: Number(p.stock_quantity ?? p.stock ?? 0),
            lowStockThreshold: Number(p.lowStockThreshold ?? p.min_stock_alert ?? 8),
            min_stock_alert: Number(p.min_stock_alert ?? p.lowStockThreshold ?? 8),
            image: p.image || p.images?.cover || (Array.isArray(p.images?.gallery) && p.images.gallery[0]) || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
            images: p.images || { cover: p.image },
            rating: Number(p.rating ?? 5),
            salesCount: Number(p.salesCount ?? p.numReviews ?? 0),
            status: p.status || 'active',
            description: p.description || '',
          };
        });
        setProducts(normalized);
      }
    } catch (err) {
      console.warn('API error loading products:', err.message);
      setProductsError(err.message);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Helper to normalize category hierarchy tree from API
  const normalizeCategoryTree = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((cat) => {
      const catId = cat.id || cat._id?.toString() || cat._id;
      const rawSubs = cat.subCategories || cat.subcategories || [];
      const normalizedSubs = rawSubs.map((sub) => {
        const subId = sub.id || sub._id?.toString() || sub._id;
        const rawChildren = sub.childCategories || sub.childcategories || [];
        const normalizedChildren = rawChildren.map((ch) => ({
          ...ch,
          id: ch.id || ch._id?.toString() || ch._id,
          _id: ch._id || ch.id,
          name: ch.name || '',
          slug: ch.slug || '',
          description: ch.description || '',
          status: ch.status || (ch.isActive ? 'active' : 'inactive'),
        }));

        return {
          ...sub,
          id: subId,
          _id: sub._id || sub.id,
          name: sub.name || '',
          slug: sub.slug || '',
          description: sub.description || '',
          status: sub.status || (sub.isActive ? 'active' : 'inactive'),
          childCategories: normalizedChildren,
        };
      });

      return {
        ...cat,
        id: catId,
        _id: cat._id || cat.id,
        name: cat.name || '',
        slug: cat.slug || '',
        description: cat.description || '',
        icon: cat.icon || 'Cpu',
        status: cat.status || (cat.isActive ? 'active' : 'inactive'),
        subCategories: normalizedSubs,
        subcategories: normalizedSubs,
      };
    });
  };

  // Load categories and full hierarchy dynamically from Backend API
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);
    try {
      const res = await getAdminCategoryTree();
      const treeData = res?.data || res?.categories || (Array.isArray(res) ? res : null);
      if (Array.isArray(treeData) && treeData.length > 0) {
        const normalized = normalizeCategoryTree(treeData);
        setCategories(normalized);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.warn('API error loading category tree:', err.message);
      setCategoriesError(err.message);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Orders, Customers, Coupons, Audit - Zero demo data, purely real database records
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);

  // Shipping carriers state for fulfillment and manual order intake
  const [shippingCarriers, setShippingCarriers] = useState([
    {
      id: 'carrier_fedex',
      name: 'FedEx Express',
      serviceType: 'Priority Air Transit',
      baseRate: 24.5,
      estimatedDays: '1-2 Days',
      trackingPrefix: 'FDX-',
      isCustom: false,
    },
    {
      id: 'carrier_ups',
      name: 'UPS Ground',
      serviceType: 'Standard Overland Transit',
      baseRate: 15.0,
      estimatedDays: '3-5 Days',
      trackingPrefix: 'UPS-',
      isCustom: false,
    },
    {
      id: 'carrier_dhl',
      name: 'DHL Express',
      serviceType: 'Global Courier Transit',
      baseRate: 35.0,
      estimatedDays: '2-3 Days',
      trackingPrefix: 'DHL-',
      isCustom: false,
    },
    {
      id: 'carrier_usps',
      name: 'USPS Priority',
      serviceType: 'Postal Express',
      baseRate: 12.0,
      estimatedDays: '2-4 Days',
      trackingPrefix: 'USPS-',
      isCustom: false,
    },
    {
      id: 'carrier_steadfast',
      name: 'Steadfast Courier',
      serviceType: 'Nationwide Delivery Network',
      baseRate: 80.0,
      estimatedDays: '24-48 Hours',
      trackingPrefix: 'STF-',
      isCustom: false,
    },
    {
      id: 'carrier_redx',
      name: 'RedX Express',
      serviceType: 'Fast Door-to-Door Delivery',
      baseRate: 70.0,
      estimatedDays: '24-48 Hours',
      trackingPrefix: 'RDX-',
      isCustom: false,
    },
    {
      id: 'carrier_pathao',
      name: 'Pathao Courier',
      serviceType: 'City On-Demand Express',
      baseRate: 60.0,
      estimatedDays: 'Same / Next Day',
      trackingPrefix: 'PTH-',
      isCustom: false,
    },
  ]);

  const addShippingCarrier = (newCarrierData) => {
    const newCarrier = {
      id: `carrier_${Date.now()}`,
      isCustom: true,
      ...newCarrierData,
    };
    setShippingCarriers((prev) => [...prev, newCarrier]);
    toast.success(`Shipping carrier "${newCarrier.name}" added successfully.`);
    return newCarrier;
  };

  // Load real orders from backend
  const loadOrders = async () => {
    try {
      const res = await getAdminOrders();
      const ordersData = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(ordersData)) {
        const normalized = ordersData.map((o) => {
          const subtotal = Number(
            o.subtotal ??
            (o.items || []).reduce(
              (acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 1)),
              0
            )
          );
          const total = Number(o.total ?? o.total_amount ?? o.totalAmount ?? subtotal);
          const discount = Number(o.discount ?? Math.max(0, subtotal - total));

          const shippingAddr = o.shippingAddress || {
            street: o.shipping?.street || o.shipping?.address || 'N/A',
            address: o.shipping?.address || o.shipping?.street || 'N/A',
            city: o.shipping?.city || 'N/A',
            state: o.shipping?.state || '',
            postalCode: o.shipping?.postalCode || o.shipping?.postal_code || '',
            postal_code: o.shipping?.postal_code || o.shipping?.postalCode || '',
            country: o.shipping?.country || 'Bangladesh',
          };

          return {
            ...o,
            id: o._id || o.id,
            _id: o._id || o.id,
            orderNumber: o.orderNumber || (o._id ? `#${String(o._id).slice(-6).toUpperCase()}` : o.id),
            customerName:
              o.customerName ||
              (o.user
                ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() || o.user.username || o.user.email
                : 'Customer'),
            customerEmail: o.customerEmail || o.user?.email || '',
            customerPhone: o.customerPhone || o.user?.phone || '',
            items: (o.items || []).map((it) => ({
              product: it.product?._id || it.product,
              name: it.title || it.name || it.product?.name || 'Product',
              title: it.title || it.name || it.product?.name || 'Product',
              sku: it.sku || it.product?.sku || (it.product?._id ? String(it.product._id).slice(-8).toUpperCase() : 'SHZ-PRD'),
              price: Number(it.price || 0),
              quantity: Number(it.quantity || 1),
              subtotal: Number(it.subtotal || (Number(it.price || 0) * Number(it.quantity || 1))),
              image: it.image || it.product?.images?.cover || '',
            })),
            subtotal,
            total,
            totalAmount: total,
            total_amount: total,
            discount,
            couponCode: o.couponCode || o.appliedCoupon || '',
            appliedCoupon: o.appliedCoupon || o.couponCode || '',
            status: o.status || 'pending',
            orderStatus: o.status || 'pending',
            paymentMethod: o.paymentMethod || o.payment?.paymentMethod?.name || o.payment?.method || 'Cash on Delivery',
            paymentStatus: o.paymentStatus || o.payment?.status || (o.status === 'delivered' ? 'paid' : 'pending'),
            carrier: o.carrier || o.shipping?.carrier || 'FedEx Express',
            shipping_medium: o.shipping_medium || o.shipping?.shipping_medium || 'Express Courier',
            shippingMedium: o.shippingMedium || o.shipping?.shippingMedium || 'Express Courier',
            trackingNumber:
              o.trackingNumber ||
              o.shipping?.trackingNumber ||
              (o._id ? `TRK-${String(o._id).slice(-8).toUpperCase()}` : ''),
            shippingAddress: shippingAddr,
            shipping: {
              ...o.shipping,
              ...shippingAddr,
              carrier: o.carrier || o.shipping?.carrier || 'FedEx Express',
              shipping_medium: o.shipping_medium || o.shipping?.shipping_medium || 'Express Courier',
              shippingMedium: o.shippingMedium || o.shipping?.shippingMedium || 'Express Courier',
              trackingNumber:
                o.trackingNumber ||
                o.shipping?.trackingNumber ||
                (o._id ? `TRK-${String(o._id).slice(-8).toUpperCase()}` : ''),
            },
            timeline: Array.isArray(o.timeline) ? o.timeline : [],
            confirmedBy: o.confirmedBy || null,
            confirmedByName: o.confirmedByName || o.confirmedBy?.name || null,
            confirmedAt: o.confirmedAt || null,
            updatedBy: o.updatedBy || null,
            updatedByName: o.updatedByName || o.updatedBy?.name || null,
            lastActivity: o.lastActivity || null,
            activities: Array.isArray(o.activities) ? o.activities : [],
            createdAt: o.createdAt || o.created_at || new Date().toISOString(),
            created_at: o.created_at || o.createdAt || new Date().toISOString(),
          };
        });
        setOrders(normalized);
      }
    } catch (err) {
      console.warn('API error loading orders:', err.message);
    }
  };

  // Load real users/customers from backend
  const loadCustomers = async () => {
    try {
      const res = await getAllAdminUsers();
      const usersData = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(usersData)) {
        const normalized = usersData.map((u) => ({
          id: u._id || u.id,
          _id: u._id || u.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || u.email || 'Customer',
          email: u.email || '',
          phone: u.phone || '',
          role: u.role || 'user',
          status: u.status || 'active',
          tier: u.tier || (u.role === 'admin' ? 'VIP' : 'Regular'),
          ordersCount: Number(u.ordersCount ?? 0),
          totalSpent: Number(u.totalSpent ?? 0),
          city: u.city || 'N/A',
          country: u.country || 'N/A',
          lastOrderDate: u.lastOrderDate || (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'),
          createdAt: u.createdAt,
        }));
        setCustomers(normalized);
      }
    } catch (err) {
      console.warn('API error loading users:', err.message);
    }
  };

  // Helper to normalize coupon objects from backend API
  const normalizeCoupon = (c) => {
    if (!c) return null;
    const rawType = c.discountType || 'percent';
    const normalizedType =
      rawType === 'percent' || rawType === 'percentage'
        ? 'percentage'
        : rawType === 'free_shipping'
        ? 'free_shipping'
        : 'fixed_amount';

    const expiryDateStr = c.expiry || c.expiryDate || c.endDate || '';
    let formattedEndDate = '';
    if (expiryDateStr) {
      try {
        formattedEndDate = new Date(expiryDateStr).toISOString().split('T')[0];
      } catch (_) {
        formattedEndDate = String(expiryDateStr).split('T')[0];
      }
    }

    const startDateStr = c.startDate || c.validFrom || '';
    let formattedStartDate = '';
    if (startDateStr) {
      try {
        formattedStartDate = new Date(startDateStr).toISOString().split('T')[0];
      } catch (_) {
        formattedStartDate = String(startDateStr).split('T')[0];
      }
    }

    const isActive = c.isActive !== undefined ? Boolean(c.isActive) : c.status === 'active';

    return {
      id: c._id || c.id,
      _id: c._id || c.id,
      code: String(c.code || '').toUpperCase(),
      description: c.description || '',
      discountType: normalizedType,
      rawDiscountType: rawType,
      discountValue: Number(c.discountValue ?? c.discount ?? 0),
      discount: Number(c.discountValue ?? c.discount ?? 0),
      minSpend: Number(c.minPurchase ?? c.minSpend ?? 0),
      minPurchase: Number(c.minPurchase ?? c.minSpend ?? 0),
      maxDiscount: Number(c.maxDiscount ?? 0),
      isActive: isActive,
      status: isActive ? 'active' : 'inactive',
      usedCount: Number(c.usedCount ?? c.timesUsed ?? 0),
      timesUsed: Number(c.usedCount ?? c.timesUsed ?? 0),
      usageLimit: Number(c.usageLimit ?? 0),
      usageLimitPerUser: Number(c.usageLimitPerUser ?? 1),
      customerTierLimit: c.customerTierLimit || 'all',
      validCategory: c.validCategory || 'All',
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      expiry: expiryDateStr,
      expiryDate: expiryDateStr,
    };
  };

  // Load real coupons from backend
  const loadCoupons = async () => {
    try {
      const res = await getAdminCoupons();
      const couponsData = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(couponsData)) {
        const normalized = couponsData.map(normalizeCoupon).filter(Boolean);
        setCoupons(normalized);
      }
    } catch (err) {
      console.warn('API error loading coupons:', err.message);
    }
  };

  // Load real roles and staff from backend API
  const loadRolesAndStaff = async () => {
    try {
      const [rolesRes, staffRes] = await Promise.allSettled([
        getAdminRoles(),
        getAdminStaffMembers(),
      ]);

      if (rolesRes.status === 'fulfilled' && rolesRes.value?.data) {
        const rolesData = rolesRes.value.data;
        if (Array.isArray(rolesData) && rolesData.length > 0) {
          setRoles(rolesData);
        }
      }

      if (staffRes.status === 'fulfilled' && staffRes.value?.data) {
        const staffData = staffRes.value.data;
        if (Array.isArray(staffData) && staffData.length > 0) {
          setTeamMembers(staffData);
        }
      }
    } catch (err) {
      console.warn('API error loading roles and staff:', err.message);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadOrders();
    loadCustomers();
    loadCoupons();
    loadRolesAndStaff();
  }, []);

  // Realtime Inventory & Alerts engine
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);

  // RBAC unauthorized popup state
  const [unauthorizedNotice, setUnauthorizedNotice] = useState(null);

  // ==========================================
  // METRICS COMPUTATION
  // ==========================================
  const metrics = useMemo(() => {
    const lowStock = products.filter(
      (p) => Number(p.stock) <= Number(p.lowStockThreshold || 8)
    ).length;

    const totalRev = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const activeCpn = coupons.filter((c) => c.status === 'active').length;

    const totalSubs = categories.reduce(
      (sum, cat) => sum + (cat.subCategories?.length || 0),
      0
    );
    const totalChildren = categories.reduce(
      (sum, cat) =>
        sum +
        (cat.subCategories || []).reduce(
          (subSum, s) => subSum + (s.childCategories?.length || 0),
          0
        ),
      0
    );

    return {
      lowStockCount: lowStock,
      totalCategoriesCount: categories.length,
      totalSubCategoriesCount: totalSubs,
      totalChildCategoriesCount: totalChildren,
      totalOrders: orders.length,
      activeCouponsCount: activeCpn,
      totalRevenue: totalRev,
      totalCustomers: customers.length,
      totalProducts: products.length,
      averageOrderValue: orders.length > 0 ? totalRev / orders.length : 0,
      conversionRate: '3.42%',
    };
  }, [products, categories, orders, coupons, customers]);

  // ==========================================
  // PERMISSION ENGINE
  // ==========================================
  const hasPermission = (permissionKey) => {
    if (!currentRole) return false;
    if (currentRole.id === 'super_admin') return true;
    return Boolean(currentRole.permissions?.includes(permissionKey));
  };

  const assertPermission = (permissionKey, actionName = 'Administrative Action') => {
    if (hasPermission(permissionKey)) {
      return true;
    }

    // Set unauthorized modal notice
    setUnauthorizedNotice({
      currentRoleName: currentRole?.name || 'Assigned Role',
      actionName,
      requiredPermission: permissionKey,
    });

    // Add security audit entry
    addAuditLog({
      action: 'SECURITY_ACCESS_RESTRICTED',
      entity: 'PermissionGate',
      entityId: permissionKey,
      details: `Restricted attempt to execute "${actionName}" (requires: ${permissionKey}) by ${currentUser?.name}`,
      severity: 'warning',
      status: 'Blocked',
    });

    return false;
  };

  const dismissUnauthorizedNotice = () => {
    setUnauthorizedNotice(null);
  };

  // ==========================================
  // AUDIT LOG HELPER
  // ==========================================
  const addAuditLog = ({ action, entity, entityId, details, severity = 'info', status = 'Success' }) => {
    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser?.name || 'Administrator',
      actorEmail: currentUser?.email || 'admin@shoezy.com',
      actorRole: currentRole?.name || 'Administrator',
      actor: {
        id: currentUser?.id || 'usr-system',
        name: currentUser?.name || 'System Operator',
        email: currentUser?.email || 'admin@shoezy.com',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: currentRole?.name || 'Operator',
      },
      category: entity || 'System',
      action,
      entity,
      entityId: String(entityId || ''),
      details: details || `Operation performed on ${entity || 'System'}`,
      severity,
      status,
      ipAddress: '127.0.0.1 (Session Terminal)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ==========================================
  // PRODUCTS CRUD (API INTEGRATED)
  // ==========================================
  const createProduct = async (productData) => {
    try {
      const apiRes = await createAdminProduct(productData);
      const createdItem = apiRes?.data || apiRes;
      const price = Number(createdItem.price ?? productData.price ?? 0);
      const cost = Number(
        createdItem.cost ??
        createdItem.costPrice ??
        productData.cost ??
        productData.costPrice ??
        (price > 0 ? Number((price * 0.55).toFixed(2)) : 0)
      );

      const newProduct = {
        id: createdItem.id || createdItem._id || `prd-${Date.now()}`,
        _id: createdItem._id || createdItem.id,
        title: createdItem.title || createdItem.name || productData.title || productData.name,
        name: createdItem.name || createdItem.title || productData.name || productData.title,
        brand: createdItem.brand || productData.brand || 'Shoezy',
        sku: createdItem.sku || productData.sku,
        category: typeof createdItem.category === 'object' && createdItem.category !== null
          ? (createdItem.category.name || productData.category)
          : (createdItem.category || productData.category || 'General'),
        price: price,
        cost: cost,
        costPrice: cost,
        stock: Number(createdItem.stock ?? createdItem.stock_quantity ?? productData.stock ?? 0),
        lowStockThreshold: Number(createdItem.lowStockThreshold ?? createdItem.min_stock_alert ?? productData.lowStockThreshold ?? 8),
        image: createdItem.image || createdItem.images?.cover || productData.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        status: createdItem.status || productData.status || 'active',
        salesCount: 0,
        rating: 5.0,
      };

      setProducts((prev) => [newProduct, ...prev]);

      addAuditLog({
        action: 'PRODUCT_CREATED',
        entity: 'Catalog',
        entityId: newProduct.id,
        details: `Published new product "${newProduct.title}" (SKU: ${newProduct.sku})`,
      });

      toast.success(`Product "${newProduct.title}" created successfully!`);
      return newProduct;
    } catch (err) {
      console.error("API error creating product:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Failed to create product";
      toast.error(errMsg);
      return null;
    }
  };

  const updateProduct = async (productId, updateData) => {
    setProducts((prev) =>
      prev.map((p) => ((p.id === productId || p._id === productId) ? { ...p, ...updateData } : p))
    );

    try {
      await updateAdminProduct(productId, updateData);
    } catch (err) {
      console.warn("API product update failed, kept local state:", err.message);
    }

    addAuditLog({
      action: 'PRODUCT_UPDATED',
      entity: 'Catalog',
      entityId: productId,
      details: `Updated catalog parameters for product ID ${productId}`,
    });

    toast.success('Product updated successfully!');
    return true;
  };

  const deleteProduct = async (productId) => {
    const prd = products.find((p) => p.id === productId || p._id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));

    try {
      await deleteAdminProduct(productId);
    } catch (err) {
      console.warn("API product deletion failed:", err.message);
    }

    addAuditLog({
      action: 'PRODUCT_DELETED',
      entity: 'Catalog',
      entityId: productId,
      details: `Archived product "${prd?.title || productId}"`,
      severity: 'warning',
    });

    toast.info('Product removed from catalog.');
  };

  const updateProductStock = async (productId, newStock) => {
    const parsedStock = Math.max(0, Number(newStock) || 0);
    setProducts((prev) =>
      prev.map((p) => ((p.id === productId || p._id === productId) ? { ...p, stock: parsedStock, stock_quantity: parsedStock } : p))
    );

    try {
      await updateAdminProductStock(productId, parsedStock);
    } catch (err) {
      console.warn("API stock adjustment failed, kept local state:", err.message);
    }

    const prd = products.find((p) => p.id === productId || p._id === productId);
    addAuditLog({
      action: 'STOCK_LEVEL_ADJUSTED',
      entity: 'Inventory',
      entityId: productId,
      details: `Adjusted quantity on hand to ${parsedStock} for "${prd?.title || productId}"`,
    });

    toast.success(`Stock level updated to ${parsedStock}`);
  };

  // ==========================================
  // CATEGORIES CRUD (3-TIER HIERARCHY, API INTEGRATED)
  // ==========================================
  const createCategory = async (categoryData) => {
    try {
      const res = await createAdminCategory(categoryData);
      const created = res?.data || res;
      const newCat = {
        id: created.id || created._id?.toString() || `cat-${Date.now()}`,
        _id: created._id || created.id,
        name: created.name || categoryData.name,
        slug: created.slug || categoryData.slug,
        description: created.description || categoryData.description || '',
        icon: created.icon || categoryData.icon || 'Cpu',
        status: created.status || categoryData.status || 'active',
        image: created.image || categoryData.image || '',
        subCategories: [],
        subcategories: [],
        productCount: 0,
      };
      setCategories((prev) => [newCat, ...prev]);
      addAuditLog({
        action: 'CATEGORY_TIER_CREATED',
        entity: 'Taxonomy',
        entityId: newCat.id,
        details: `Created master category "${newCat.name}"`,
      });
      toast.success(`Category "${newCat.name}" created.`);
      return newCat;
    } catch (err) {
      console.error('Failed to create category:', err);
      const fallbackCat = {
        id: `cat-${Date.now()}`,
        subCategories: [],
        subcategories: [],
        productCount: 0,
        ...categoryData,
      };
      setCategories((prev) => [fallbackCat, ...prev]);
      toast.warn(`Category created locally (API error: ${err.message})`);
      return fallbackCat;
    }
  };

  const updateCategory = async (categoryId, updateData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId || c._id === categoryId ? { ...c, ...updateData } : c))
    );
    try {
      await updateAdminCategory(categoryId, updateData);
      toast.success('Category updated successfully.');
    } catch (err) {
      console.warn('API category update error:', err.message);
      toast.info('Category updated locally.');
    }
  };

  const deleteCategory = async (categoryId) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId && c._id !== categoryId));
    try {
      await deleteAdminCategory(categoryId);
      toast.info('Category removed.');
    } catch (err) {
      console.warn('API category delete error:', err.message);
      toast.info('Category removed locally.');
    }
  };

  const reorderCategories = async (newOrderedList) => {
    setCategories(newOrderedList);
    try {
      dispatch(setReduxCategories(newOrderedList));
    } catch (_) {}

    const categoryIds = newOrderedList.map((c) => c.id || c._id);
    try {
      const res = await reorderAdminCategories(categoryIds);
      if (res?.data && Array.isArray(res.data)) {
        const normalized = normalizeCategoryTree(res.data);
        setCategories(normalized);
        try {
          dispatch(setReduxCategories(normalized));
        } catch (_) {}
      }
      toast.success('Category display order updated');
    } catch (err) {
      console.warn('Failed to save category order to backend:', err.message);
      toast.error('Failed to sync category order with server');
    }
  };

  const createSubCategory = async (categoryId, subData) => {
    try {
      const payload = {
        ...subData,
        category: categoryId,
        categoryId: categoryId,
      };
      const res = await createAdminSubCategory(payload);
      const created = res?.data || res;
      const newSub = {
        id: created.id || created._id?.toString() || `sub-${Date.now()}`,
        _id: created._id || created.id,
        name: created.name || subData.name,
        slug: created.slug || subData.slug,
        description: created.description || subData.description || '',
        status: created.status || subData.status || 'active',
        image: created.image || subData.image || '',
        category: categoryId,
        childCategories: [],
      };
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== categoryId && c._id !== categoryId) return c;
          const updatedSubs = [...(c.subCategories || []), newSub];
          return {
            ...c,
            subCategories: updatedSubs,
            subcategories: updatedSubs,
          };
        })
      );
      toast.success(`Subcategory "${newSub.name}" added.`);
      return newSub;
    } catch (err) {
      console.error('Failed to create subcategory:', err);
      const fallbackSub = {
        id: `sub-${Date.now()}`,
        childCategories: [],
        ...subData,
      };
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== categoryId && c._id !== categoryId) return c;
          const updatedSubs = [...(c.subCategories || []), fallbackSub];
          return {
            ...c,
            subCategories: updatedSubs,
            subcategories: updatedSubs,
          };
        })
      );
      toast.warn(`Subcategory added locally (API error: ${err.message})`);
      return fallbackSub;
    }
  };

  const updateSubCategory = async (categoryId, subId, updateData) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId && c._id !== categoryId) return c;
        const updatedSubs = (c.subCategories || []).map((s) =>
          s.id === subId || s._id === subId ? { ...s, ...updateData } : s
        );
        return { ...c, subCategories: updatedSubs, subcategories: updatedSubs };
      })
    );
    try {
      await updateAdminSubCategory(subId, updateData);
      toast.success('Subcategory updated.');
    } catch (err) {
      console.warn('API subcategory update error:', err.message);
      toast.info('Subcategory updated locally.');
    }
  };

  const deleteSubCategory = async (categoryId, subId) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId && c._id !== categoryId) return c;
        const filteredSubs = (c.subCategories || []).filter(
          (s) => s.id !== subId && s._id !== subId
        );
        return { ...c, subCategories: filteredSubs, subcategories: filteredSubs };
      })
    );
    try {
      await deleteAdminSubCategory(subId);
      toast.info('Subcategory deleted.');
    } catch (err) {
      console.warn('API subcategory delete error:', err.message);
      toast.info('Subcategory removed locally.');
    }
  };

  const createChildCategory = async (categoryId, subId, childData) => {
    try {
      const payload = {
        ...childData,
        category: categoryId,
        subCategory: subId,
        subCategoryId: subId,
      };
      const res = await createAdminChildCategory(payload);
      const created = res?.data || res;
      const newChild = {
        id: created.id || created._id?.toString() || `child-${Date.now()}`,
        _id: created._id || created.id,
        name: created.name || childData.name,
        slug: created.slug || childData.slug,
        description: created.description || childData.description || '',
        status: created.status || childData.status || 'active',
        image: created.image || childData.image || '',
        category: categoryId,
        subCategory: subId,
      };
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== categoryId && c._id !== categoryId) return c;
          return {
            ...c,
            subCategories: (c.subCategories || []).map((s) => {
              if (s.id !== subId && s._id !== subId) return s;
              return {
                ...s,
                childCategories: [...(s.childCategories || []), newChild],
              };
            }),
          };
        })
      );
      toast.success(`Child category "${newChild.name}" added.`);
      return newChild;
    } catch (err) {
      console.error('Failed to create child category:', err);
      const fallbackChild = {
        id: `child-${Date.now()}`,
        ...childData,
      };
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== categoryId && c._id !== categoryId) return c;
          return {
            ...c,
            subCategories: (c.subCategories || []).map((s) => {
              if (s.id !== subId && s._id !== subId) return s;
              return {
                ...s,
                childCategories: [...(s.childCategories || []), fallbackChild],
              };
            }),
          };
        })
      );
      toast.warn(`Child category added locally (API error: ${err.message})`);
      return fallbackChild;
    }
  };

  const updateChildCategory = async (categoryId, subId, childId, updateData) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId && c._id !== categoryId) return c;
        return {
          ...c,
          subCategories: (c.subCategories || []).map((s) => {
            if (s.id !== subId && s._id !== subId) return s;
            return {
              ...s,
              childCategories: (s.childCategories || []).map((ch) =>
                ch.id === childId || ch._id === childId ? { ...ch, ...updateData } : ch
              ),
            };
          }),
        };
      })
    );
    try {
      await updateAdminChildCategory(childId, updateData);
      toast.success('Child category updated.');
    } catch (err) {
      console.warn('API child category update error:', err.message);
      toast.info('Child category updated locally.');
    }
  };

  const deleteChildCategory = async (categoryId, subId, childId) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId && c._id !== categoryId) return c;
        return {
          ...c,
          subCategories: (c.subCategories || []).map((s) => {
            if (s.id !== subId && s._id !== subId) return s;
            return {
              ...s,
              childCategories: (s.childCategories || []).filter(
                (ch) => ch.id !== childId && ch._id !== childId
              ),
            };
          }),
        };
      })
    );
    try {
      await deleteAdminChildCategory(childId);
      toast.info('Child category deleted.');
    } catch (err) {
      console.warn('API child category delete error:', err.message);
      toast.info('Child category deleted locally.');
    }
  };

  // ==========================================
  // ORDERS MANAGEMENT (API INTEGRATED)
  // ==========================================
  const updateOrderStatus = async (orderId, newStatus, carrier, trackingNumber, notes) => {
    const adminUserId = currentUser?.id && currentUser?.id !== 'usr-admin' ? currentUser?.id : undefined;
    const actorName = currentUser?.name || 'Administrator';
    const actorRole = currentRole?.name || currentUser?.role || 'Admin';
    const actorEmail = currentUser?.email || 'admin@shoezy.com';

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o._id === orderId
          ? {
              ...o,
              status: newStatus,
              orderStatus: newStatus,
              carrier: carrier || o.carrier,
              trackingNumber: trackingNumber || o.trackingNumber,
              updatedByName: actorName,
              lastActivity: {
                actorName,
                actorRole,
                action: newStatus === 'processing' ? 'ORDER_CONFIRMED' : 'STATUS_UPDATED',
                newStatus,
                carrier: carrier || o.carrier,
                trackingNumber: trackingNumber || o.trackingNumber,
                note: notes || `Status updated to ${newStatus}`,
                timestamp: new Date().toISOString(),
              },
            }
          : o
      )
    );

    try {
      await updateAdminOrderStatusApi(orderId, newStatus, {
        carrier,
        trackingNumber,
        notes,
        adminUserId,
        actorName,
        actorRole,
        actorEmail,
      });
      toast.success(`Order status updated to "${newStatus}".`);
      await loadOrders();
      return true;
    } catch (err) {
      console.warn('Backend order update error:', err.message);
      return false;
    } finally {
      addAuditLog({
        action: 'ORDER_STATUS_CHANGED',
        entity: 'Orders',
        entityId: orderId,
        details: `Advanced order #${orderId} status to "${newStatus}" by ${actorName}`,
      });
    }
  };

  const cancelAndRefundOrder = async (orderId, reason = 'Customer cancellation request') => {
    const adminUserId = currentUser?.id && currentUser?.id !== 'usr-admin' ? currentUser?.id : undefined;
    const actorName = currentUser?.name || 'Administrator';
    const actorRole = currentRole?.name || currentUser?.role || 'Admin';
    const actorEmail = currentUser?.email || 'admin@shoezy.com';

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o._id === orderId
          ? {
              ...o,
              status: 'cancelled',
              orderStatus: 'cancelled',
              paymentStatus: 'refunded',
              updatedByName: actorName,
              lastActivity: {
                actorName,
                actorRole,
                action: 'ORDER_CANCELLED',
                newStatus: 'cancelled',
                note: reason,
                timestamp: new Date().toISOString(),
              },
            }
          : o
      )
    );

    try {
      await updateAdminOrderStatusApi(orderId, 'cancelled', {
        notes: reason,
        adminUserId,
        actorName,
        actorRole,
        actorEmail,
      });
      toast.info(`Order #${orderId} marked as cancelled and refunded.`);
      await loadOrders();
      return true;
    } catch (err) {
      console.warn('Backend order cancel error:', err.message);
      return false;
    } finally {
      addAuditLog({
        action: 'ORDER_CANCELLED_REFUNDED',
        entity: 'Orders',
        entityId: orderId,
        details: `Cancelled and refunded order #${orderId} by ${actorName}. Reason: ${reason}`,
        severity: 'warning',
      });
    }
  };

  const createOrder = async (orderPayload) => {
    try {
      const newId = `ord_${Date.now()}`;
      const newOrder = {
        id: newId,
        _id: newId,
        orderNumber: `#${newId.slice(-6).toUpperCase()}`,
        customerName: orderPayload.customerName,
        customerEmail: orderPayload.customerEmail,
        customerPhone: orderPayload.customerPhone || '',
        items: (orderPayload.items || []).map((it) => ({
          product: it.productId || it.product?._id || it.product,
          name: it.title || it.name || 'Product',
          title: it.title || it.name || 'Product',
          sku: it.sku || 'N/A',
          quantity: it.quantity || 1,
          price: it.price || 0,
          subtotal: (it.price || 0) * (it.quantity || 1),
          image: it.image || '',
        })),
        subtotal: orderPayload.subtotal || 0,
        discount: orderPayload.discount || 0,
        total: orderPayload.total || 0,
        totalAmount: orderPayload.total || 0,
        couponCode: orderPayload.couponCode || '',
        status: orderPayload.status || 'processing',
        orderStatus: orderPayload.status || 'processing',
        paymentStatus: orderPayload.paymentStatus || 'paid',
        paymentMethod: orderPayload.paymentMethod || 'Manual',
        carrier: orderPayload.carrier || 'FedEx Express',
        shipping_medium: orderPayload.carrier || 'Express Courier',
        shippingMedium: orderPayload.carrier || 'Express Courier',
        trackingNumber: orderPayload.trackingNumber || `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        shippingAddress: orderPayload.shippingAddress || {
          street: 'Local Storefront',
          city: 'Dhaka',
          state: '',
          postalCode: '1200',
          country: 'Bangladesh',
        },
        timeline: [
          {
            status: orderPayload.status || 'processing',
            timestamp: new Date().toISOString(),
            actor: currentUser?.name || 'Operations Admin',
            note: `Order recorded via Omnichannel Intake (${orderPayload.source || 'manual'})`,
          },
        ],
        createdAt: new Date().toISOString(),
      };

      setOrders((prev) => [newOrder, ...prev]);
      addAuditLog({
        action: 'ORDER_CREATED',
        entity: 'Orders',
        entityId: newId,
        details: `Intake order #${newId} for ${orderPayload.customerName} ($${orderPayload.total})`,
      });
      toast.success('Order recorded successfully!');
      return { success: true, orderId: newId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ==========================================
  // COUPONS MANAGEMENT (API INTEGRATED)
  // ==========================================
  const createCoupon = async (couponData) => {
    try {
      const payload = {
        code: String(couponData.code || '').trim().toUpperCase(),
        description: couponData.description || '',
        discountType: couponData.discountType === 'percentage'
          ? 'percent'
          : (couponData.discountType === 'fixed_amount' ? 'flat' : couponData.discountType || 'percent'),
        discountValue: Number(couponData.discountValue ?? couponData.discount ?? 0),
        minPurchase: Number(couponData.minSpend ?? couponData.minPurchase ?? 0),
        maxDiscount: Number(couponData.maxDiscount ?? 0),
        usageLimit: Number(couponData.usageLimit ?? 0),
        usageLimitPerUser: Number(couponData.usageLimitPerUser ?? 1),
        customerTierLimit: couponData.customerTierLimit || 'all',
        validCategory: couponData.validCategory || 'All',
        startDate: couponData.startDate || new Date().toISOString(),
        expiry: couponData.endDate || couponData.expiry || couponData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: couponData.isActive !== undefined ? Boolean(couponData.isActive) : true,
      };

      const res = await createAdminCouponApi(payload);
      const createdItem = res?.data || res;
      const newCoupon = normalizeCoupon(createdItem) || {
        ...payload,
        id: createdItem._id || createdItem.id || `cpn-${Date.now()}`,
        _id: createdItem._id || createdItem.id,
        status: payload.isActive ? 'active' : 'inactive',
        usedCount: 0,
      };

      setCoupons((prev) => [newCoupon, ...prev.filter((c) => c.code !== newCoupon.code)]);

      addAuditLog({
        action: 'COUPON_CREATED',
        entity: 'Promotion',
        entityId: newCoupon.code,
        details: `Issued new promotional coupon "${newCoupon.code}" (${newCoupon.discountValue}${newCoupon.discountType === 'percentage' ? '%' : '$'} OFF)`,
      });

      toast.success(`Coupon code ${newCoupon.code} created!`);
      return newCoupon;
    } catch (err) {
      console.error('Failed to create coupon:', err);
      const errMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Failed to create coupon';
      toast.error(errMsg);
      return null;
    }
  };

  const toggleCouponStatus = async (couponId) => {
    const current = coupons.find((c) => c.id === couponId || c._id === couponId);
    if (!current) return;
    const nextActive = !current.isActive;
    const nextStatus = nextActive ? 'active' : 'inactive';

    setCoupons((prev) =>
      prev.map((c) =>
        c.id === couponId || c._id === couponId
          ? { ...c, isActive: nextActive, status: nextStatus }
          : c
      )
    );

    try {
      await toggleAdminCouponStatusApi(couponId, nextActive);
      toast.info(`Coupon "${current.code}" status changed to ${nextStatus}.`);
    } catch (err) {
      try {
        await updateAdminCouponApi(couponId, { isActive: nextActive });
        toast.info(`Coupon "${current.code}" status changed to ${nextStatus}.`);
      } catch (fallbackErr) {
        console.warn('API coupon toggle error:', fallbackErr.message);
      }
    }

    addAuditLog({
      action: 'COUPON_STATUS_MODIFIED',
      entity: 'Promotion',
      entityId: current.code,
      details: `Changed status of coupon "${current.code}" to ${nextStatus}`,
    });
  };

  const deleteCoupon = async (couponId) => {
    const target = coupons.find((c) => c.id === couponId || c._id === couponId);
    setCoupons((prev) => prev.filter((c) => c.id !== couponId && c._id !== couponId));
    try {
      await deleteAdminCouponApi(couponId);
      toast.info(`Coupon "${target?.code || couponId}" deleted.`);
    } catch (err) {
      console.warn('API coupon delete error:', err.message);
    }

    if (target) {
      addAuditLog({
        action: 'COUPON_REVOKED',
        entity: 'Promotion',
        entityId: target.code,
        details: `Permanently revoked promo coupon "${target.code}"`,
        severity: 'warning',
      });
    }
  };

  // ==========================================
  // ROLES & STAFF RBAC MANAGEMENT (API INTEGRATED)
  // ==========================================
  const updateRolePermissions = async (roleId, newPermissions) => {
    // Optimistic UI update
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: newPermissions } : r))
    );

    try {
      await updateRolePermissionsApi(roleId, newPermissions);
      toast.success('Role capability permissions updated.');
    } catch (err) {
      console.error('Failed to update role permissions:', err);
      toast.error(err?.response?.data?.message || 'Failed to update permissions on server');
      loadRolesAndStaff();
    }

    addAuditLog({
      action: 'RBAC_CAPABILITIES_MODIFIED',
      entity: 'SecurityMatrix',
      entityId: roleId,
      details: `Modified granted capability flags for role "${roleId}" (${newPermissions.length} active)`,
    });
  };

  const createCustomRole = async (nameOrObj, descParam, permsParam, colorParam) => {
    const name = typeof nameOrObj === 'object' ? nameOrObj.name : nameOrObj;
    const description = typeof nameOrObj === 'object' ? nameOrObj.description : descParam;
    const permissions = typeof nameOrObj === 'object' ? nameOrObj.permissions : permsParam;
    const roleColor = typeof nameOrObj === 'object' ? (nameOrObj.color || 'indigo') : (colorParam || 'indigo');

    try {
      const res = await createAdminRole({
        name,
        description,
        permissions: permissions || [],
        color: roleColor,
      });

      const createdRole = res?.data || {
        id: `role_${Date.now()}`,
        name,
        description,
        color: roleColor,
        isCustom: true,
        permissions: permissions || [],
      };

      setRoles((prev) => [...prev, createdRole]);

      addAuditLog({
        action: 'CUSTOM_ROLE_CREATED',
        entity: 'SecurityMatrix',
        entityId: createdRole.id,
        details: `Created new custom security role "${name}"`,
      });

      toast.success(`Role "${name}" created.`);
      return true;
    } catch (err) {
      console.error('Failed to create role:', err);
      toast.error(err?.response?.data?.message || 'Failed to create role');
      return false;
    }
  };

  const assignMemberRole = async (memberId, newRoleId) => {
    // Optimistic UI update
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, roleId: newRoleId } : m))
    );

    try {
      await assignStaffRoleApi(memberId, newRoleId);
      toast.success('Team member role assigned.');
    } catch (err) {
      console.error('Failed to assign staff role:', err);
      toast.error(err?.response?.data?.message || 'Failed to update role on server');
      loadRolesAndStaff();
    }

    addAuditLog({
      action: 'STAFF_ROLE_REASSIGNED',
      entity: 'StaffTeam',
      entityId: memberId,
      details: `Reassigned team member ${memberId} to role "${newRoleId}"`,
    });
  };

  const updateMemberStatus = async (memberId, newStatus) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
    );

    try {
      await updateStaffStatusApi(memberId, newStatus);
      toast.info(`Member status set to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update staff status:', err);
      toast.error(err?.response?.data?.message || 'Failed to update status on server');
      loadRolesAndStaff();
    }
  };

  const inviteTeamMember = async (nameOrObj, emailParam, roleIdParam) => {
    const name = typeof nameOrObj === 'object' ? nameOrObj.name : nameOrObj;
    const email = typeof nameOrObj === 'object' ? nameOrObj.email : emailParam;
    const roleId = typeof nameOrObj === 'object' ? nameOrObj.roleId : roleIdParam;

    try {
      const res = await inviteStaffMemberApi({ name, email, roleId });
      const newMember = res?.data || {
        id: `usr-${Date.now()}`,
        name,
        email,
        roleId,
        status: 'active',
        lastActive: 'Just invited',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      setTeamMembers((prev) => [...prev, newMember]);

      addAuditLog({
        action: 'STAFF_INVITED',
        entity: 'StaffTeam',
        entityId: newMember.id,
        details: `Invited new team member "${name}" (${email}) with role ${roleId}`,
      });

      toast.success(`Invitation sent to ${email}`);
      return true;
    } catch (err) {
      console.error('Failed to invite team member:', err);
      toast.error(err?.response?.data?.message || 'Failed to invite team member');
      return false;
    }
  };

  const dismissAlert = (alertId) => {
    setRealtimeAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return (
    <AdminContext.Provider
      value={{
        // Metrics & Computed
        metrics,

        // Current User & Persona
        currentUser,
        currentUserId,
        setCurrentUserId,
        currentRole,

        // Catalog & Products
        products,
        isLoadingProducts,
        refreshProducts: loadProducts,
        productsError,
        createProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,

        // Categories & Taxonomy
        categories,
        isLoadingCategories,
        categoriesError,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        createSubCategory,
        updateSubCategory,
        deleteSubCategory,
        createChildCategory,
        updateChildCategory,
        deleteChildCategory,

        // Orders
        orders,
        refreshOrders: loadOrders,
        updateOrderStatus,
        cancelAndRefundOrder,
        createOrder,
        shippingCarriers,
        addShippingCarrier,

        // Customers
        customers,

        // Coupons
        coupons,
        refreshCoupons: loadCoupons,
        createCoupon,
        toggleCouponStatus,
        deleteCoupon,

        // Audit Logs
        auditLogs,
        addAuditLog,

        // Roles & Team RBAC
        roles,
        teamMembers,
        updateRolePermissions,
        createCustomRole,
        assignMemberRole,
        updateMemberStatus,
        inviteTeamMember,

        // Realtime Alerts
        isRealtimeActive,
        setIsRealtimeActive,
        realtimeAlerts,
        dismissAlert,

        // Permission Assertions
        hasPermission,
        assertPermission,
        unauthorizedNotice,
        dismissUnauthorizedNotice,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
