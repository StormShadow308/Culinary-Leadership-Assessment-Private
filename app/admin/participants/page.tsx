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
  Alert,
  Switch
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Participant {
  id: string;
  fullName: string;
  email: string;
  organizationId: string | undefined;
  organizationName: string;
  cohortId: string | null;
  cohortName: string | null;
  stayOut: boolean;
  createdAt: string;
  lastActiveAt: string | null;
}

interface Organization {
  id: string;
  name: string;
}

interface Cohort {
  id: string;
  name: string;
  organizationId: string;
}

export default function AdminParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    organizationId: '', 
    cohortId: '', 
    stayOut: false 
  });

  useEffect(() => {
    fetchParticipants();
    fetchOrganizations();
    fetchCohorts();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/admin/participants');
      if (!response.ok) throw new Error('Failed to fetch participants');
      const data = await response.json();
      console.log('🔍 Fetched participants data:', data);
      console.log('🔍 Participants count:', data.participants?.length || 0);
      if (data.participants && data.participants.length > 0) {
        console.log('🔍 First participant:', data.participants[0]);
        console.log('🔍 First participant organizationId:', data.participants[0].organizationId, typeof data.participants[0].organizationId);
      }
      setParticipants(data.participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch participants',
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

  const fetchCohorts = async () => {
    try {
      const response = await fetch('/api/admin/cohorts');
      if (!response.ok) throw new Error('Failed to fetch cohorts');
      const data = await response.json();
      setCohorts(data.cohorts);
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const handleCreateParticipant = async () => {
    try {
      const response = await fetch('/api/admin/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizationId: formData.organizationId,
          cohortId: formData.cohortId || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create participant');
      }

      const data = await response.json();
      setParticipants([...participants, data.participant]);
      setCreateModalOpen(false);
      setFormData({ fullName: '', email: '', organizationId: '', cohortId: '', stayOut: false });
      
      // Show success message with invitation status
      if (data.invitationSent) {
        notifications.show({
          title: 'Success',
          message: 'Participant created and invitation email sent successfully!',
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Success',
          message: 'Participant created successfully, but invitation email failed to send',
          color: 'yellow',
        });
      }
    } catch (error) {
      console.error('Error creating participant:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create participant',
        color: 'red',
      });
    }
  };

  const handleEditParticipant = async () => {
    if (!selectedParticipant) return;

    try {
      const response = await fetch('/api/admin/participants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedParticipant.id,
          ...formData,
          organizationId: formData.organizationId,
          cohortId: formData.cohortId || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update participant');
      }

      const data = await response.json();
      setParticipants(participants.map(p => p.id === selectedParticipant.id ? data.participant : p));
      setEditModalOpen(false);
      setSelectedParticipant(null);
      setFormData({ fullName: '', email: '', organizationId: '', cohortId: '', stayOut: false });
      notifications.show({
        title: 'Success',
        message: 'Participant updated successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error updating participant:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update participant',
        color: 'red',
      });
    }
  };

  const handleDeleteParticipant = async () => {
    if (!selectedParticipant) return;

    try {
      const response = await fetch('/api/admin/participants/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: selectedParticipant.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete participant');
      }

      setParticipants(participants.filter(p => p.id !== selectedParticipant.id));
      setDeleteModalOpen(false);
      setSelectedParticipant(null);
      notifications.show({
        title: 'Success',
        message: 'Participant deleted successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting participant:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete participant',
        color: 'red',
      });
    }
  };

  const openEditModal = (participant: Participant) => {
    console.log('🔍 Opening edit modal for participant:', participant);
    console.log('🔍 Participant organizationId:', participant.organizationId, typeof participant.organizationId);
    console.log('🔍 Participant cohortId:', participant.cohortId, typeof participant.cohortId);
    
    setSelectedParticipant(participant);
    setFormData({ 
      fullName: participant.fullName, 
      email: participant.email, 
      organizationId: participant.organizationId?.toString() || '', 
      cohortId: participant.cohortId?.toString() || '', 
      stayOut: participant.stayOut 
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    setDeleteModalOpen(true);
  };

  const getFilteredCohorts = (organizationId: string | undefined) => {
    if (!organizationId) return [];
    return cohorts.filter(c => c.organizationId === organizationId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>Participant Management</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={() => setCreateModalOpen(true)}>
          Create Participant
        </Button>
      </Group>

      <Text size="sm" c="dimmed">
        {participants.length} participants total
      </Text>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Cohort</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td>
                <Text fw={500}>{participant.fullName}</Text>
              </td>
              <td>
                <Text size="sm">{participant.email}</Text>
              </td>
              <td>
                <Badge variant="light" color="blue">
                  {participant.organizationName}
                </Badge>
              </td>
              <td>
                {participant.cohortName ? (
                  <Badge variant="light" color="green">
                    {participant.cohortName}
                  </Badge>
                ) : (
                  <Text size="sm" c="dimmed">No cohort</Text>
                )}
              </td>
              <td>
                <Badge 
                  color={participant.stayOut ? 'red' : 'green'}
                  variant="light"
                >
                  {participant.stayOut ? 'Opted Out' : 'Active'}
                </Badge>
              </td>
              <td>
                <Text size="sm">
                  {new Date(participant.createdAt).toLocaleDateString()}
                </Text>
              </td>
              <td>
                <Group gap="xs">
                  <ActionIcon variant="light" color="blue" onClick={() => openEditModal(participant)}>
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(participant)}>
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {participants.length === 0 && (
        <Card padding="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            No participants found
          </Text>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Participant"
      >
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Select
            label="Organization"
            placeholder="Select organization"
            data={organizations.map(org => ({ value: org.id.toString(), label: org.name }))}
            value={formData.organizationId}
            onChange={(value) => setFormData({ ...formData, organizationId: value || '', cohortId: '' })}
            required
          />
          <Select
            label="Cohort"
            placeholder="Select cohort (optional)"
            data={getFilteredCohorts(formData.organizationId).map(cohort => ({ 
              value: cohort.id.toString(), 
              label: cohort.name 
            }))}
            value={formData.cohortId}
            onChange={(value) => setFormData({ ...formData, cohortId: value || '' })}
            disabled={!formData.organizationId}
          />
          <Switch
            label="Opted Out"
            checked={formData.stayOut}
            onChange={(e) => setFormData({ ...formData, stayOut: e.currentTarget.checked })}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateParticipant}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Participant"
      >
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Select
            label="Organization"
            placeholder="Select organization"
            data={organizations.map(org => ({ value: org.id.toString(), label: org.name }))}
            value={formData.organizationId}
            onChange={(value) => setFormData({ ...formData, organizationId: value || '', cohortId: '' })}
            required
          />
          <Select
            label="Cohort"
            placeholder="Select cohort (optional)"
            data={getFilteredCohorts(formData.organizationId).map(cohort => ({ 
              value: cohort.id.toString(), 
              label: cohort.name 
            }))}
            value={formData.cohortId}
            onChange={(value) => setFormData({ ...formData, cohortId: value || '' })}
            disabled={!formData.organizationId}
          />
          <Switch
            label="Opted Out"
            checked={formData.stayOut}
            onChange={(e) => setFormData({ ...formData, stayOut: e.currentTarget.checked })}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditParticipant}>
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Participant"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} title="Warning" color="red">
            This will delete the participant and all associated data. This action cannot be undone.
          </Alert>
          <Text>Are you sure you want to delete &quot;{selectedParticipant?.fullName}&quot;?</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteParticipant}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}