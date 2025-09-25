'use client';

import { useState } from 'react';
import { 
  Table, 
  Button, 
  Group, 
  Title, 
  Text, 
  Badge, 
  ActionIcon, 
  Modal, 
  Stack,
  Alert,
  TextInput,
  Select
} from '@mantine/core';
import { IconTrash, IconEdit, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useUsers } from '~/lib/hooks/use-admin-data';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  lastActiveAt: string | null;
}

export default function AdminUsers() {
  const { data: users, loading, refreshData, updateItem, removeItem } = useUsers();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
    setEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!userToEdit) return;

    try {
      const response = await fetch('/api/admin/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userToEdit.id,
          ...editFormData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      const data = await response.json();
      
      // Update local state immediately
      updateItem(userToEdit.id, data.user);
      
      // Close modal and reset form
      setEditModalOpen(false);
      setUserToEdit(null);
      setEditFormData({ name: '', email: '', role: '' });
      
      // Refresh data from database to ensure consistency
      await refreshData();
      
      notifications.show({
        title: 'Success',
        message: 'User updated successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update user',
        color: 'red',
      });
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToDelete.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      // Update local state immediately
      removeItem(userToDelete.id);
      
      // Refresh data from database to ensure consistency
      await refreshData();
      
      notifications.show({
        title: 'Success',
        message: 'User deleted successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete user',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>User Management</Title>
        <Text size="sm" c="dimmed">
          {users.length} users total
        </Text>
      </Group>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Text fw={500}>{user.name}</Text>
              </td>
              <td>{user.email}</td>
              <td>
                <Badge 
                  color={user.role === 'admin' ? 'red' : user.role === 'organization' ? 'blue' : 'green'}
                  variant="light"
                >
                  {user.role}
                </Badge>
              </td>
              <td>
                <Badge 
                  color={user.emailVerified ? 'green' : 'yellow'}
                  variant="light"
                >
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </td>
              <td>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td>
                <Group gap="xs">
                  <ActionIcon variant="light" color="blue" onClick={() => handleEditUser(user)}>
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  {user.role !== 'admin' && (
                    <ActionIcon 
                      variant="light" 
                      color="red"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  )}
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit User"
      >
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Enter user name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter user email"
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            required
          />
          <Select
            label="Role"
            placeholder="Select user role"
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'organization', label: 'Organization' },
              { value: 'student', label: 'Student' }
            ]}
            value={editFormData.role}
            onChange={(value) => setEditFormData({ ...editFormData, role: value || '' })}
            required
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            Are you sure you want to delete this user? This action cannot be undone.
          </Alert>
          <Text size="sm">
            <strong>User:</strong> {userToDelete?.name} ({userToDelete?.email})
          </Text>
          <Text size="sm" c="dimmed">
            This will also delete all associated data including assessments, responses, and memberships.
          </Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
