'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TextInput,
  Button,
  Group,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  Stack,
  Select,
  Alert,
  Center,
  Loader,
  ScrollArea
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconAlertCircle,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Cohort {
  id: string;
  name: string;
  organizationId: string;
  organizationName: string;
  createdAt: string;
  updatedAt: string;
  participantCount: number;
}

interface Organization {
  id: string;
  name: string;
}

export function CohortManagement() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    organizationId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/cohorts');
      if (response.ok) {
        const data = await response.json();
        setCohorts(data.cohorts || []);
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch cohorts',
          color: 'red',
        });
      }
    } catch (error) {
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
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  };

  useEffect(() => {
    fetchCohorts();
    fetchOrganizations();
  }, []);

  const handleCreateCohort = () => {
    setEditingCohort(null);
    setFormData({ name: '', organizationId: '' });
    setModalOpen(true);
  };

  const handleEditCohort = (cohort: Cohort) => {
    setEditingCohort(cohort);
    setFormData({
      name: cohort.name,
      organizationId: cohort.organizationId
    });
    setModalOpen(true);
  };

  const handleDeleteCohort = async (cohortId: string) => {
    if (!confirm('Are you sure you want to delete this cohort? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/cohorts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortId }),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Cohort deleted successfully',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        fetchCohorts();
      } else {
        const errorData = await response.json();
        notifications.show({
          title: 'Error',
          message: errorData.error || 'Failed to delete cohort',
          color: 'red',
          icon: <IconX size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete cohort',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.organizationId) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingCohort ? '/api/admin/cohorts' : '/api/admin/cohorts';
      const method = editingCohort ? 'PUT' : 'POST';
      const body = editingCohort 
        ? { id: editingCohort.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: editingCohort ? 'Cohort updated successfully' : 'Cohort created successfully',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        setModalOpen(false);
        fetchCohorts();
      } else {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Failed to save cohort';
        
        // Handle specific error codes
        if (errorData.code === 'COHORT_EXISTS') {
          errorMessage = 'A cohort with this name already exists in this organization';
        }
        
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
          icon: <IconX size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save cohort',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getOrganizationName = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    return org ? org.name : organizationId;
  };

  if (loading) {
    return (
      <Center h={200}>
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
        <Text size="lg" fw={500}>
          Cohort Management
        </Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateCohort}
        >
          Create Cohort
        </Button>
      </Group>

      {cohorts.length === 0 ? (
        <Alert icon={<IconAlertCircle size={16} />} title="No Cohorts" color="blue">
          No cohorts found. Create your first cohort to get started.
        </Alert>
      ) : (
        <ScrollArea>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Organization</Table.Th>
                <Table.Th>Participants</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Updated</Table.Th>
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
                    <Badge variant="light" color="blue">
                      {cohort.organizationName || getOrganizationName(cohort.organizationId)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      color={cohort.participantCount > 0 ? 'green' : 'gray'}
                      variant="light"
                    >
                      {cohort.participantCount} participant{cohort.participantCount !== 1 ? 's' : ''}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(cohort.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(cohort.updatedAt).toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="Edit cohort">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEditCohort(cohort)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete cohort">
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteCohort(cohort.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCohort ? 'Edit Cohort' : 'Create Cohort'}
        size="md"
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
            data={organizations.map(org => ({ value: org.id, label: org.name }))}
            value={formData.organizationId}
            onChange={(value) => setFormData({ ...formData, organizationId: value || '' })}
            required
          />

          <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
            <Text size="sm">
              Cohort names must be unique within each organization. 
              You cannot create multiple cohorts with the same name in the same organization.
            </Text>
          </Alert>

          <Group justify="flex-end" gap="md">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!formData.name.trim() || !formData.organizationId}
            >
              {editingCohort ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
