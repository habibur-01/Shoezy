import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  INITIAL_ROLES,
  INITIAL_TEAM_MEMBERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CUSTOMERS,
} from '../data/mockData';
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
} from '../server/category/adminCategory';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  // Team and RBAC state
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [currentUserId, setCurrentUserId] = useState(INITIAL_TEAM_MEMBERS[0].id);

  // Active User & Active Role
  const currentUser = useMemo(() => {
    return teamMembers.find((m) => m.id === currentUserId) || teamMembers[0];
  }, [teamMembers, currentUserId]);

  const currentRole = useMemo(() => {
    return roles.find((r) => r.id === currentUser?.roleId) || roles[0];
  }, [roles, currentUser]);

  // Catalog & Inventory state
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
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
      console.warn('API error loading products, using fallback:', err.message);
      setProductsError(err.message);
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
      }
    } catch (err) {
      console.warn('API error loading category tree, using fallback:', err.message);
      setCategoriesError(err.message);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Orders, Customers, Coupons, Audit
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Realtime Inventory & Alerts engine
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);
  const [realtimeAlerts, setRealtimeAlerts] = useState([
    {
      id: 'alt-1',
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'New Balance 990v6 has only 3 units remaining in main warehouse',
      time: '5m ago',
      severity: 'amber',
      read: false,
    },
    {
      id: 'alt-2',
      type: 'high_order',
      title: 'High Velocity Checkout',
      message: 'Order #SHZ-8829 ($349.00) received via Stripe Express',
      time: '18m ago',
      severity: 'emerald',
      read: false,
    },
  ]);

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
      timestamp: 'Just now',
      actor: {
        id: currentUser?.id || 'usr-system',
        name: currentUser?.name || 'System Operator',
        email: currentUser?.email || 'admin@shoezy.com',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: currentRole?.name || 'Operator',
      },
      action,
      entity,
      entityId: String(entityId || ''),
      details,
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
      console.warn("Falling back to local product creation:", err.message);
      const newProduct = {
        id: `prd-${Date.now()}`,
        rating: 5.0,
        reviewsCount: 0,
        status: productData.status || 'published',
        image: productData.image || productData.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        ...productData,
        stock: Number(productData.stock || 0),
        price: Number(productData.price || 0),
        cost: Number(productData.cost || productData.costPrice || 0),
        costPrice: Number(productData.costPrice || productData.cost || 0),
        lowStockThreshold: Number(productData.lowStockThreshold || 8),
      };

      setProducts((prev) => [newProduct, ...prev]);

      addAuditLog({
        action: 'PRODUCT_CREATED',
        entity: 'Catalog',
        entityId: newProduct.id,
        details: `Published new product "${newProduct.title}" (SKU: ${newProduct.sku})`,
      });

      toast.success(`Product "${newProduct.title}" created!`);
      return newProduct;
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
  // ORDERS MANAGEMENT
  // ==========================================
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );

    addAuditLog({
      action: 'ORDER_STATUS_CHANGED',
      entity: 'Orders',
      entityId: orderId,
      details: `Advanced order #${orderId} status to "${newStatus}"`,
    });

    toast.success(`Order #${orderId} updated to ${newStatus}`);
  };

  const cancelAndRefundOrder = (orderId, reason = 'Customer cancellation request') => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, orderStatus: 'cancelled', paymentStatus: 'refunded' }
          : o
      )
    );

    addAuditLog({
      action: 'ORDER_CANCELLED_REFUNDED',
      entity: 'Orders',
      entityId: orderId,
      details: `Cancelled and refunded order #${orderId}. Reason: ${reason}`,
      severity: 'warning',
    });

    toast.info(`Order #${orderId} was cancelled and marked as refunded.`);
  };

  // ==========================================
  // COUPONS MANAGEMENT
  // ==========================================
  const createCoupon = (couponData) => {
    const newCoupon = {
      id: `cpn-${Date.now()}`,
      timesUsed: 0,
      status: 'active',
      validFrom: new Date().toISOString().split('T')[0],
      ...couponData,
    };
    setCoupons((prev) => [newCoupon, ...prev]);

    addAuditLog({
      action: 'PROMO_COUPON_CREATED',
      entity: 'Coupons',
      entityId: newCoupon.id,
      details: `Created promotional code "${newCoupon.code}" (${newCoupon.discountValue}% off)`,
    });

    toast.success(`Coupon code ${newCoupon.code} created!`);
  };

  const toggleCouponStatus = (couponId) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === couponId
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      )
    );
    toast.info('Coupon status toggled.');
  };

  const deleteCoupon = (couponId) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    toast.info('Coupon deleted.');
  };

  // ==========================================
  // ROLES & STAFF RBAC MANAGEMENT
  // ==========================================
  const updateRolePermissions = (roleId, newPermissions) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: newPermissions } : r))
    );

    addAuditLog({
      action: 'RBAC_CAPABILITIES_MODIFIED',
      entity: 'SecurityMatrix',
      entityId: roleId,
      details: `Modified granted capability flags for role "${roleId}" (${newPermissions.length} active)`,
    });

    toast.success('Role capability permissions updated.');
  };

  const createCustomRole = ({ name, description, permissions }) => {
    const newRole = {
      id: `role_${Date.now()}`,
      name,
      description,
      color: 'indigo',
      isCustom: true,
      permissions: permissions || [],
    };
    setRoles((prev) => [...prev, newRole]);

    addAuditLog({
      action: 'CUSTOM_ROLE_CREATED',
      entity: 'SecurityMatrix',
      entityId: newRole.id,
      details: `Created new custom security role "${name}"`,
    });

    toast.success(`Role "${name}" created.`);
  };

  const assignMemberRole = (memberId, newRoleId) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, roleId: newRoleId } : m))
    );

    addAuditLog({
      action: 'STAFF_ROLE_REASSIGNED',
      entity: 'StaffTeam',
      entityId: memberId,
      details: `Reassigned team member ${memberId} to role "${newRoleId}"`,
    });

    toast.success('Team member role assigned.');
  };

  const updateMemberStatus = (memberId, newStatus) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
    );
    toast.info(`Member status set to ${newStatus}`);
  };

  const inviteTeamMember = ({ name, email, roleId }) => {
    const newMember = {
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
        createSubCategory,
        updateSubCategory,
        deleteSubCategory,
        createChildCategory,
        updateChildCategory,
        deleteChildCategory,

        // Orders
        orders,
        updateOrderStatus,
        cancelAndRefundOrder,

        // Customers
        customers,

        // Coupons
        coupons,
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
