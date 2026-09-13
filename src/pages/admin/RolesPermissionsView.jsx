import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { PERMISSION_DEFINITIONS } from '../../data/mockData';

import { RolesHeader } from './roles/RolesHeader';
import { RolesNavTabs } from './roles/RolesNavTabs';
import { RolesLegendBanner } from './roles/RolesLegendBanner';
import { PermissionsMatrixGrid } from './roles/PermissionsMatrixGrid';
import { StaffMembersTable } from './roles/StaffMembersTable';
import { CreateRoleModal } from './roles/CreateRoleModal';
import { InviteMemberModal } from './roles/InviteMemberModal';

export const RolesPermissionsView = () => {
  const {
    roles,
    teamMembers,
    updateRolePermissions,
    createCustomRole,
    assignMemberRole,
    updateMemberStatus,
    inviteTeamMember,
    currentUser
  } = useAdmin();

  // Selected view tab
  const [activeSubTab, setActiveSubTab] = useState('matrix');

  // Custom role creator modal
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState([
  'products.view',
  'orders.view']
  );

  // Invite member modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState('store_manager');

  // Permission categories grouping
  const categories = Array.from(new Set(PERMISSION_DEFINITIONS.map((p) => p.category)));

  // Toggle single permission for a role
  const handleTogglePermission = (roleId, permKey) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    if (role.isSystem && role.id === 'super_admin') {
      alert('The Super Admin system role maintains immutable master administrative access.');
      return;
    }

    const isGranted = role.permissions.includes(permKey);
    const updatedPermissions = isGranted ?
    role.permissions.filter((k) => k !== permKey) :
    [...role.permissions, permKey];

    updateRolePermissions(roleId, updatedPermissions);
  };

  // Toggle all permissions for a category within a role
  const handleToggleCategoryForRole = (roleId, category) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role || role.isSystem && role.id === 'super_admin') return;

    const categoryPermKeys = PERMISSION_DEFINITIONS.filter((p) => p.category === category).map(
      (p) => p.key
    );
    const allGranted = categoryPermKeys.every((k) => role.permissions.includes(k));

    const updatedPermissions = allGranted ?
    role.permissions.filter((k) => !categoryPermKeys.includes(k)) :
    Array.from(new Set([...role.permissions, ...categoryPermKeys]));

    updateRolePermissions(roleId, updatedPermissions);
  };

  // Handle custom role creation
  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const success = createCustomRole(
      newRoleName.trim(),
      newRoleDesc,
      newRolePermissions,
      'indigo'
    );
    if (success) {
      setIsNewRoleModalOpen(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setNewRolePermissions(['products.view', 'orders.view']);
    }
  };

  // Handle team invite submit
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const success = inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRoleId);
    if (success) {
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <RolesHeader
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onOpenCreateRoleModal={() => setIsNewRoleModalOpen(true)} />
      

      {/* Navigation Sub-Tabs */}
      <RolesNavTabs
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        rolesCount={roles.length}
        membersCount={teamMembers.length} />
      

      {/* TAB 1: Intuitive Permissions Matrix Grid */}
      {activeSubTab === 'matrix' &&
      <div className="space-y-4">
          <RolesLegendBanner roles={roles} />
          <PermissionsMatrixGrid
          roles={roles}
          categories={categories}
          onTogglePermission={handleTogglePermission}
          onToggleCategoryForRole={handleToggleCategoryForRole} />
        
        </div>
      }

      {/* TAB 2: Staff & Team Member Roster */}
      {activeSubTab === 'members' &&
      <StaffMembersTable
        teamMembers={teamMembers}
        roles={roles}
        currentUserId={currentUser.id}
        onAssignRole={assignMemberRole}
        onUpdateStatus={updateMemberStatus} />

      }

      {/* Modal: Create Custom Role */}
      <CreateRoleModal
        isOpen={isNewRoleModalOpen}
        onClose={() => setIsNewRoleModalOpen(false)}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        newRoleDesc={newRoleDesc}
        setNewRoleDesc={setNewRoleDesc}
        newRolePermissions={newRolePermissions}
        setNewRolePermissions={setNewRolePermissions}
        onSubmit={handleCreateRoleSubmit} />
      

      {/* Modal: Invite Team Member */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteName={inviteName}
        setInviteName={setInviteName}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRoleId={inviteRoleId}
        setInviteRoleId={setInviteRoleId}
        roles={roles}
        onSubmit={handleInviteSubmit} />
      
    </div>);

};

export default RolesPermissionsView;