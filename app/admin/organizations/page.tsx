'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  Button, 
  Group, 
  Title, 
  Text, 
  ActionIcon, 
  Modal, 
  Stack,
  Alert
} from '@mantine/core';
import { IconTrash, IconEye, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Organization {
  id: string;
  name: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export default function AdminOrganizations() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/admin/organizations');
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setOrganizations(data.organizations);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch organizations',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrganization = (org: Organization) => {
    // Navigate to organization dashboard
    router.push(`/organisation?orgId=${org.id}`);
  };

  const handleDeleteOrganization = (org: Organization) => {
    setOrgToDelete(org);
    setDeleteModalOpen(true);
  };

  const confirmDeleteOrganization = async () => {
    if (!orgToDelete) return;

    try {
      const response = await fetch('/api/admin/delete-organization', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgToDelete.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete organization');
      }

      setOrganizations(organizations.filter(o => o.id !== orgToDelete.id));
      notifications.show({
        title: 'Success',
        message: 'Organization deleted successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting organization:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete organization',
        color: 'red',
      });
    } finally {
      setDeleteModalOpen(false);
      setOrgToDelete(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>Organization Management</Title>
        <Text size="sm" c="dimmed">
          {organizations.length} organizations total
        </Text>
      </Group>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Website</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id}>
              <td>
                <Text fw={500}>{org.name}</Text>
              </td>
              <td>
                <Text size="sm" c="dimmed">
                  {org.metadata && typeof org.metadata === 'object' && 'description' in org.metadata 
                    ? String(org.metadata.description) 
                    : 'No description'
                  }
                </Text>
              </td>
              <td>
                {org.metadata && typeof org.metadata === 'object' && 'website' in org.metadata ? (
                  <Text size="sm" c="blue" td="underline">
                    {String(org.metadata.website)}
                  </Text>
                ) : (
                  <Text size="sm" c="dimmed">No website</Text>
                )}
              </td>
              <td>
                {new Date(org.createdAt).toLocaleDateString()}
              </td>
              <td>
                <Group gap="xs">
                  <ActionIcon 
                    variant="light" 
                    color="blue"
                    onClick={() => handleViewOrganization(org)}
                    title="View Organization Dashboard"
                  >
                    <IconEye size="1rem" />
                  </ActionIcon>
                  {org.name !== 'System' && org.name !== 'Default' && (
                    <ActionIcon 
                      variant="light" 
                      color="red"
                      onClick={() => handleDeleteOrganization(org)}
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

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Organization"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            Are you sure you want to delete this organization? This action cannot be undone.
          </Alert>
          <Text size="sm">
            <strong>Organization:</strong> {orgToDelete?.name}
          </Text>
          <Text size="sm" c="dimmed">
            This will also delete all associated data including cohorts, participants, assessments, and memberships.
          </Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDeleteOrganization}>
              Delete Organization
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
