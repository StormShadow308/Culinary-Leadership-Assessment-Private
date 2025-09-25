'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Group, 
  Stack, 
  Text, 
  Title, 
  Button, 
  ActionIcon, 
  Modal, 
  TextInput, 
  Select,
  Table,
  Badge,
  Alert
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Cohort {
  id: string;
  name: string;
  organizationId: string;
  organizationName: string;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: string;
  name: string;
}

export default function AdminCohorts() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [formData, setFormData] = useState({ name: '', organizationId: '' });

  useEffect(() => {
    fetchCohorts();
    fetchOrganizations();
  }, []);

  const fetchCohorts = async () => {
    try {
      const response = await fetch('/api/admin/cohorts');
      if (!response.ok) throw new Error('Failed to fetch cohorts');
      const data = await response.json();
      setCohorts(data.cohorts);
    } catch (error) {
      console.error('Error fetching cohorts:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch cohorts',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/admin/organizations');
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setOrganizations(data.organizations);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleCreateCohort = async () => {
    try {
      const response = await fetch('/api/admin/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create cohort');
      }

      const data = await response.json();
      setCohorts([...cohorts, data.cohort]);
      setCreateModalOpen(false);
      setFormData({ name: '', organizationId: '' });
      notifications.show({
        title: 'Success',
        message: 'Cohort created successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error creating cohort:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create cohort',
        color: 'red',
      });
    }
  };

  const handleEditCohort = async () => {
    if (!selectedCohort) return;

    try {
      const response = await fetch('/api/admin/cohorts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCohort.id,
          name: formData.name,
          organizationId: formData.organizationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update cohort');
      }

      const data = await response.json();
      setCohorts(cohorts.map(c => c.id === selectedCohort.id ? data.cohort : c));
      setEditModalOpen(false);
      setSelectedCohort(null);
      setFormData({ name: '', organizationId: '' });
      notifications.show({
        title: 'Success',
        message: 'Cohort updated successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error updating cohort:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update cohort',
        color: 'red',
      });
    }
  };

  const handleDeleteCohort = async () => {
    if (!selectedCohort) return;

    try {
      const response = await fetch('/api/admin/cohorts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortId: selectedCohort.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete cohort');
      }

      setCohorts(cohorts.filter(c => c.id !== selectedCohort.id));
      setDeleteModalOpen(false);
      setSelectedCohort(null);
      notifications.show({
        title: 'Success',
        message: 'Cohort deleted successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting cohort:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete cohort',
        color: 'red',
      });
    }
  };

  const openEditModal = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setFormData({ name: cohort.name, organizationId: cohort.organizationId.toString() });
    setEditModalOpen(true);
  };

  const openDeleteModal = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>Cohort Management</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={() => setCreateModalOpen(true)}>
          Create Cohort
        </Button>
      </Group>

      <Text size="sm" c="dimmed">
        {cohorts.length} cohorts total
      </Text>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Organization</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort) => (
            <tr key={cohort.id}>
              <td>
                <Text fw={500}>{cohort.name}</Text>
              </td>
              <td>
                <Badge variant="light" color="blue">
                  {cohort.organizationName}
                </Badge>
              </td>
              <td>
                <Text size="sm">
                  {new Date(cohort.createdAt).toLocaleDateString()}
                </Text>
              </td>
              <td>
                <Text size="sm">
                  {new Date(cohort.updatedAt).toLocaleDateString()}
                </Text>
              </td>
              <td>
                <Group gap="xs">
                  <ActionIcon variant="light" color="blue" onClick={() => openEditModal(cohort)}>
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(cohort)}>
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {cohorts.length === 0 && (
        <Card padding="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            No cohorts found
          </Text>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Cohort"
      >
        <Stack gap="md">
          <TextInput
            label="Cohort Name"
            placeholder="Enter cohort name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Select
            label="Organization"
            placeholder="Select organization"
            data={organizations.map(org => ({ value: org.id.toString(), label: org.name }))}
            value={formData.organizationId}
            onChange={(value) => setFormData({ ...formData, organizationId: value || '' })}
            required
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCohort}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Cohort"
      >
        <Stack gap="md">
          <TextInput
            label="Cohort Name"
            placeholder="Enter cohort name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Select
            label="Organization"
            placeholder="Select organization"
            data={organizations.map(org => ({ value: org.id.toString(), label: org.name }))}
            value={formData.organizationId}
            onChange={(value) => setFormData({ ...formData, organizationId: value || '' })}
            required
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCohort}>
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Cohort"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} title="Warning" color="red">
            This will delete the cohort and all associated data. This action cannot be undone.
          </Alert>
          <Text>Are you sure you want to delete &quot;{selectedCohort?.name}&quot;?</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteCohort}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}