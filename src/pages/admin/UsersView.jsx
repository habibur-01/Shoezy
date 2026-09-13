import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { UsersHeader } from './users/UsersHeader';
import { UsersMetrics } from './users/UsersMetrics';
import { UsersFilterBar } from './users/UsersFilterBar';
import { UsersTable } from './users/UsersTable';
import { EditUserModal } from './users/EditUserModal';
import { CreateUserModal } from './users/CreateUserModal';
import { UserDetailsModal } from './users/UserDetailsModal';
import { DeleteUserModal } from './users/DeleteUserModal';
import {
  getAllAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  updateAdminUser,
  createAdminUser,
  deleteAdminUser,
} from '../../server/user/adminUser';

export const UsersView = () => {
  const authUser = useSelector((state) => state.auth?.user);
  const currentAdminEmail = authUser?.email || '';

  // Data state
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // Load all users from backend API
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAdminUsers();
      if (response?.data) {
        setUsers(response.data);
      } else if (Array.isArray(response)) {
        setUsers(response);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to load users from database';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        const email = (u.email || '').toLowerCase();
        const username = (u.username || '').toLowerCase();
        const phone = (u.phone || '').toLowerCase();

        const matches =
          fullName.includes(query) ||
          email.includes(query) ||
          username.includes(query) ||
          phone.includes(query);

        if (!matches) return false;
      }

      // Role filter
      if (selectedRole !== 'all') {
        if (u.role?.toLowerCase() !== selectedRole.toLowerCase()) return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (u.status?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
      }

      return true;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  // Quick Role Change Handler
  const handleQuickRoleChange = async (userId, newRole) => {
    // Optimistic update
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );

    try {
      const response = await updateAdminUserRole(userId, newRole);
      const updatedUser = response?.data;
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...updatedUser } : u))
        );
      }
      toast.success(`Role updated to ${newRole.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to update role:', error);
      // Revert optimistic update
      setUsers(previousUsers);
      const msg = error?.response?.data?.message || 'Failed to update user role';
      toast.error(msg);
    }
  };

  // Quick Status Change Handler
  const handleQuickStatusChange = async (userId, newStatus) => {
    // Optimistic update
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      const response = await updateAdminUserStatus(userId, newStatus);
      const updatedUser = response?.data;
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...updatedUser } : u))
        );
      }
      toast.success(`Account status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert optimistic update
      setUsers(previousUsers);
      const msg = error?.response?.data?.message || 'Failed to update user status';
      toast.error(msg);
    }
  };

  // Full User Edit Save Handler
  const handleSaveEdit = async (userId, updateData) => {
    setIsActionLoading(true);
    try {
      const response = await updateAdminUser(userId, updateData);
      const updatedUser = response?.data;
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...updatedUser } : u))
        );
      }
      toast.success('User profile updated successfully.');
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user edit:', error);
      const msg = error?.response?.data?.message || 'Failed to update user';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Create New User Handler
  const handleCreateUser = async (newUserData) => {
    setIsActionLoading(true);
    try {
      const response = await createAdminUser(newUserData);
      const createdUser = response?.data;
      if (createdUser) {
        setUsers((prev) => [createdUser, ...prev]);
      } else {
        await loadUsers();
      }
      toast.success('New user account provisioned successfully.');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      const msg = error?.response?.data?.message || 'Failed to create user account';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Delete User Handler
  const handleConfirmDelete = async (userId) => {
    setIsActionLoading(true);
    try {
      await deleteAdminUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User account deleted successfully.');
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
      const msg = error?.response?.data?.message || 'Failed to delete user account';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // Open View Details Modal
  const handleOpenDetails = (user) => {
    setViewingUser(user);
    setIsDetailsModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <UsersHeader
        totalUsers={users.length}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={loadUsers}
        isLoading={isLoading}
      />

      {/* KPI Overview Cards */}
      <UsersMetrics users={users} />

      {/* Filter and Search Bar */}
      <UsersFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        filteredCount={filteredUsers.length}
        totalCount={users.length}
        onResetFilters={handleResetFilters}
      />

      {/* User Table Directory */}
      <UsersTable
        users={filteredUsers}
        isLoading={isLoading}
        onQuickRoleChange={handleQuickRoleChange}
        onQuickStatusChange={handleQuickStatusChange}
        onViewDetails={handleOpenDetails}
        onEditUser={handleOpenEdit}
        onDeleteUser={handleOpenDelete}
        currentAdminEmail={currentAdminEmail}
      />

      {/* Modal: Edit User */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSaveEdit}
        isSaving={isActionLoading}
      />

      {/* Modal: Provision New User */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
        isCreating={isActionLoading}
      />

      {/* Modal: View Clearance Record */}
      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingUser(null);
        }}
        user={viewingUser}
        onEditClick={handleOpenEdit}
      />

      {/* Modal: Delete Confirmation */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        user={deletingUser}
        onConfirm={handleConfirmDelete}
        isDeleting={isActionLoading}
      />
    </div>
  );
};

export default UsersView;
