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
  Table,
  Badge,
  Alert,
  Loader,
  Center,
  ScrollArea
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle, IconUsers, IconCalendar, IconEye } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useOrgContext } from '../components/use-org-context';
import { useRouter } from 'next/navigation';

interface Cohort {
  id: string;
  name: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  participantCount: number;
}

export default function OrganizationCohorts() {
  const { selectedOrgId, isInitialized } = useOrgContext();
  const router = useRouter();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('🔍 Cohorts page useEffect:', { selectedOrgId, isInitialized });
    // For organization users, fetch cohorts immediately as the API gets org from user membership
    // For admin users, wait for selectedOrgId
    if (selectedOrgId || isInitialized) {
      console.log('✅ Fetching cohorts...');
      fetchCohorts();
    } else {
      console.log('❌ Not fetching cohorts yet - waiting for context');
    }
  }, [selectedOrgId, isInitialized]);

  const fetchCohorts = async () => {
    try {
      console.log('🔄 Starting to fetch cohorts...');
      setLoading(true);
      const response = await fetch('/api/organization/cohorts', {
        credentials: 'include',
      });
      
      console.log('📡 Cohorts API response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Cohorts data received:', data);
        setCohorts(data.cohorts || []);
      } else {
        const error = await response.json();
        console.error('❌ Cohorts API error:', error);
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to fetch cohorts',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('❌ Error fetching cohorts:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch cohorts',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohort = () => {
    setSelectedCohort(null);
    setFormData({ name: '' });
    setCreateModalOpen(true);
  };

  const handleEditCohort = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setFormData({ name: cohort.name });
    setEditModalOpen(true);
  };

  const handleDeleteCohort = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setDeleteModalOpen(true);
  };

  const handleViewStudents = (cohort: Cohort) => {
    router.push(`/organisation/cohorts/${cohort.id}/students`);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please enter a cohort name',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setSubmitting(true);
    try {
      const url = selectedCohort ? '/api/organization/cohorts' : '/api/organization/cohorts';
      const method = selectedCohort ? 'PUT' : 'POST';
      const body = selectedCohort 
        ? { id: selectedCohort.id, name: formData.name.trim() }
        : { name: formData.name.trim() };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: selectedCohort ? 'Cohort updated successfully' : 'Cohort created successfully',
          color: 'green',
        });
        setCreateModalOpen(false);
        setEditModalOpen(false);
        fetchCohorts();
      } else {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Failed to save cohort';
        
        if (errorData.code === 'COHORT_EXISTS') {
          errorMessage = 'A cohort with this name already exists in your organization';
        }
        
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save cohort',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCohort) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/organization/cohorts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cohortId: selectedCohort.id }),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Cohort deleted successfully',
          color: 'green',
        });
        setDeleteModalOpen(false);
        fetchCohorts();
      } else {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Failed to delete cohort';
        
        if (errorData.code === 'COHORT_HAS_PARTICIPANTS') {
          errorMessage = 'Cannot delete cohort with existing participants. Please reassign or remove participants first.';
        }
        
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete cohort',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading cohorts...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Cohort Management</Title>
          <Text c="dimmed" size="sm">
            Create and manage cohorts for your organization
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateCohort}
        >
          Create Cohort
        </Button>
      </Group>

      {cohorts.length === 0 ? (
        <Card padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconUsers size={48} color="var(--mantine-color-gray-4)" />
            <Text size="lg" fw={500} c="dimmed">
              No cohorts found
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Create your first cohort to start organizing participants
            </Text>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCreateCohort}
            >
              Create Your First Cohort
            </Button>
          </Stack>
        </Card>
      ) : (
        <Card padding="md" radius="md" withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cohort Name</Table.Th>
                  <Table.Th>Participants</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Last Updated</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {cohorts.map((cohort) => (
                  <Table.Tr key={cohort.id}>
                    <Table.Td>
                      <Text fw={500}>{cohort.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={cohort.participantCount > 0 ? 'blue' : 'gray'}
                        variant="light"
                      >
                        {cohort.participantCount} participant{cohort.participantCount !== 1 ? 's' : ''}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconCalendar size={14} color="var(--mantine-color-gray-6)" />
                        <Text size="sm" c="dimmed">
                          {formatDate(cohort.createdAt)}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconCalendar size={14} color="var(--mantine-color-gray-6)" />
                        <Text size="sm" c="dimmed">
                          {formatDate(cohort.updatedAt)}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => handleViewStudents(cohort)}
                          title="View Students"
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEditCohort(cohort)}
                          title="Edit Cohort"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteCohort(cohort)}
                          disabled={cohort.participantCount > 0}
                          title={cohort.participantCount > 0 ? "Cannot delete cohort with students" : "Delete Cohort"}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      )}

      {/* Create Cohort Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Cohort"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Cohort Name"
            placeholder="Enter cohort name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            required
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              Create Cohort
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Cohort Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Cohort"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Cohort Name"
            placeholder="Enter cohort name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            required
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              Update Cohort
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Cohort Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Cohort"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            Are you sure you want to delete the cohort "{selectedCohort?.name}"? This action cannot be undone.
          </Alert>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={submitting}>
              Delete Cohort
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
