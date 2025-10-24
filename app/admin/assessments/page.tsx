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
  Textarea,
  Table,
  Alert
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Assessment {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/admin/assessments');
      if (!response.ok) throw new Error('Failed to fetch assessments');
      const data = await response.json();
      setAssessments(data.assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch assessments',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    try {
      const response = await fetch('/api/admin/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create assessment');
      }

      const data = await response.json();
      setAssessments([...assessments, data.assessment]);
      setCreateModalOpen(false);
      setFormData({ title: '', description: '' });
      notifications.show({
        title: 'Success',
        message: 'Assessment created successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error creating assessment:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create assessment',
        color: 'red',
      });
    }
  };

  const handleEditAssessment = async () => {
    if (!selectedAssessment) return;

    try {
      const response = await fetch('/api/admin/assessments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAssessment.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update assessment');
      }

      const data = await response.json();
      setAssessments(assessments.map(a => a.id === selectedAssessment.id ? data.assessment : a));
      setEditModalOpen(false);
      setSelectedAssessment(null);
      setFormData({ title: '', description: '' });
      notifications.show({
        title: 'Success',
        message: 'Assessment updated successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error updating assessment:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update assessment',
        color: 'red',
      });
    }
  };

  const handleDeleteAssessment = async () => {
    if (!selectedAssessment) return;

    try {
      const response = await fetch('/api/admin/assessments/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: selectedAssessment.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete assessment');
      }

      setAssessments(assessments.filter(a => a.id !== selectedAssessment.id));
      setDeleteModalOpen(false);
      setSelectedAssessment(null);
      notifications.show({
        title: 'Success',
        message: 'Assessment deleted successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete assessment',
        color: 'red',
      });
    }
  };

  const openEditModal = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setFormData({ title: assessment.title, description: assessment.description });
    setEditModalOpen(true);
  };

  const openDeleteModal = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mobile-page-container">
      <Stack h="100%" gap="md">
        <Group justify="space-between">
          <Title order={2}>Assessment Management</Title>
          <Button leftSection={<IconPlus size="1rem" />} onClick={() => setCreateModalOpen(true)}>
            Create Assessment
          </Button>
        </Group>

      <Text size="sm" c="dimmed">
        {assessments.length} assessments total
      </Text>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((assessment) => (
            <tr key={assessment.id}>
              <td>
                <Text fw={500}>{assessment.title}</Text>
              </td>
              <td>
                <Text size="sm" c="dimmed">
                  {assessment.description || 'No description'}
                </Text>
              </td>
              <td>
                <Text size="sm">
                  {new Date(assessment.createdAt).toLocaleDateString()}
                </Text>
              </td>
              <td>
                <Group gap="xs">
                  <ActionIcon variant="light" color="blue" onClick={() => openEditModal(assessment)}>
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(assessment)}>
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {assessments.length === 0 && (
        <Card padding="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            No assessments found
          </Text>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Assessment"
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter assessment title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter assessment description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssessment}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Assessment"
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter assessment title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter assessment description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={3}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAssessment}>
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Assessment"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} title="Warning" color="red">
            This will delete the assessment and all associated data. This action cannot be undone.
          </Alert>
          <Text>Are you sure you want to delete &quot;{selectedAssessment?.title}&quot;?</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteAssessment}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
      </Stack>
    </div>
  );
}
