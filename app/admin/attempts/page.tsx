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
  Select,
  Table,
  Badge,
  Alert,
  Textarea,
  Grid,
  Paper,
  Divider,
  Progress,
  NumberInput
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Attempt {
  id: string;
  participantId: string;
  assessmentId: string;
  organizationName: string;
  participantName: string;
  participantEmail: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  reportData: Record<string, unknown> | null;
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
}

interface Assessment {
  id: string;
  title: string;
}

interface ReportData {
  totalScore: number;
  totalPossible: number;
  overallPercentage: number;
  categoryResults: Array<{
    category: string;
    score: number;
    total: number;
    percentage: number;
  }>;
}

// Component to display report data in a user-friendly format
function ReportDataDisplay({ reportData }: { reportData: ReportData | null }) {
  if (!reportData) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="gray">
        No report data available
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      {/* Overall Score */}
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="sm">
          <Text fw={600} size="lg">Overall Performance</Text>
          <Badge color="blue" size="lg">
            {reportData.overallPercentage.toFixed(1)}%
          </Badge>
        </Group>
        <Progress 
          value={reportData.overallPercentage} 
          size="lg" 
          radius="md"
          color={reportData.overallPercentage >= 80 ? 'green' : reportData.overallPercentage >= 60 ? 'yellow' : 'red'}
        />
        <Group justify="space-between" mt="xs">
          <Text size="sm" c="dimmed">
            Score: {reportData.totalScore} / {reportData.totalPossible}
          </Text>
          <Text size="sm" c="dimmed">
            {reportData.overallPercentage >= 80 ? 'Excellent' : 
             reportData.overallPercentage >= 60 ? 'Good' : 
             reportData.overallPercentage >= 40 ? 'Fair' : 'Needs Improvement'}
          </Text>
        </Group>
      </Paper>

      {/* Category Breakdown */}
      {reportData.categoryResults && reportData.categoryResults.length > 0 && (
        <Paper p="md" withBorder>
          <Text fw={600} size="lg" mb="md">Category Breakdown</Text>
          <Grid>
            {reportData.categoryResults.map((category, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                <Card p="sm" withBorder>
                  <Text fw={500} size="sm" mb="xs">{category.category}</Text>
                  <Progress 
                    value={category.percentage} 
                    size="sm" 
                    radius="md"
                    color={category.percentage >= 80 ? 'green' : category.percentage >= 60 ? 'yellow' : 'red'}
                  />
                  <Group justify="space-between" mt="xs">
                    <Text size="xs" c="dimmed">
                      {category.score} / {category.total}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {category.percentage.toFixed(1)}%
                    </Text>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Raw Data (Collapsible) */}
      <Paper p="md" withBorder>
        <Text fw={600} size="md" mb="sm">Raw Report Data</Text>
        <Textarea
          value={JSON.stringify(reportData, null, 2)}
          readOnly
          minRows={8}
          maxRows={12}
          styles={{
            input: {
              fontFamily: 'monospace',
              fontSize: '12px',
            }
          }}
        />
      </Paper>
    </Stack>
  );
}

export default function AdminAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [formData, setFormData] = useState({ 
    participantId: '', 
    assessmentId: '', 
    status: 'in_progress',
    reportData: ''
  });

  useEffect(() => {
    fetchAttempts();
    fetchParticipants();
    fetchAssessments();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await fetch('/api/admin/attempts');
      if (!response.ok) throw new Error('Failed to fetch attempts');
      const data = await response.json();
      setAttempts(data.attempts);
    } catch (error) {
      console.error('Error fetching attempts:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch attempts',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/admin/participants');
      if (!response.ok) throw new Error('Failed to fetch participants');
      const data = await response.json();
      setParticipants(data.participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/admin/assessments');
      if (!response.ok) throw new Error('Failed to fetch assessments');
      const data = await response.json();
      setAssessments(data.assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleCreateAttempt = async () => {
    try {
      const response = await fetch('/api/admin/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create attempt');
      }

      const data = await response.json();
      setAttempts([...attempts, data.attempt]);
      setCreateModalOpen(false);
      setFormData({ participantId: '', assessmentId: '', status: 'in_progress', reportData: '' });
      notifications.show({
        title: 'Success',
        message: 'Attempt created successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error creating attempt:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create attempt',
        color: 'red',
      });
    }
  };

  const handleEditAttempt = async () => {
    if (!selectedAttempt) return;

    try {
      // Validate JSON if reportData is provided
      let parsedReportData = null;
      if (formData.reportData && formData.reportData.trim()) {
        try {
          parsedReportData = JSON.parse(formData.reportData);
        } catch (jsonError) {
          notifications.show({
            title: 'Invalid JSON',
            message: 'Please check the JSON format in the report data field',
            color: 'red',
          });
          return;
        }
      }

      const response = await fetch('/api/admin/attempts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAttempt.id,
          status: formData.status,
          reportData: parsedReportData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update attempt');
      }

      const data = await response.json();
      setAttempts(attempts.map(a => a.id === selectedAttempt.id ? data.attempt : a));
      setEditModalOpen(false);
      setSelectedAttempt(null);
      setFormData({ participantId: '', assessmentId: '', status: 'in_progress', reportData: '' });
      notifications.show({
        title: 'Success',
        message: 'Attempt updated successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error updating attempt:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update attempt',
        color: 'red',
      });
    }
  };

  const handleDeleteAttempt = async () => {
    if (!selectedAttempt) return;

    try {
      const response = await fetch('/api/admin/attempts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: selectedAttempt.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete attempt');
      }

      setAttempts(attempts.filter(a => a.id !== selectedAttempt.id));
      setDeleteModalOpen(false);
      setSelectedAttempt(null);
      notifications.show({
        title: 'Success',
        message: 'Attempt deleted successfully',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting attempt:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete attempt',
        color: 'red',
      });
    }
  };

  const openEditModal = (attempt: Attempt) => {
    setSelectedAttempt(attempt);
    setFormData({ 
      participantId: attempt.participantId, 
      assessmentId: attempt.assessmentId, 
      status: attempt.status,
      reportData: attempt.reportData ? JSON.stringify(attempt.reportData, null, 2) : ''
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (attempt: Attempt) => {
    setSelectedAttempt(attempt);
    setDeleteModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'abandoned': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>Assessment Attempts</Title>
        <Button leftSection={<IconPlus size="1rem" />} onClick={() => setCreateModalOpen(true)}>
          Create Attempt
        </Button>
      </Group>

      <Text size="sm" c="dimmed">
        {attempts.length} attempts total
      </Text>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Organization</th>
            <th>Status</th>
            <th>Score</th>
            <th>Started</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt) => (
            <tr key={attempt.id}>
              <td>
                <Stack gap={2}>
                  <Text fw={500} size="sm">
                    {attempt.participantName || 'Unknown'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {attempt.participantEmail || 'No email'}
                  </Text>
                </Stack>
              </td>
              <td>
                <Text size="sm">{attempt.organizationName || 'Unknown'}</Text>
              </td>
              <td>
                <Badge 
                  color={getStatusColor(attempt.status)}
                  variant="light"
                  size="sm"
                >
                  {attempt.status}
                </Badge>
              </td>
              <td>
                {attempt.reportData ? (
                  <Group gap="xs">
                    <Badge 
                      color={
                        (attempt.reportData as any).overallPercentage >= 80 ? 'green' :
                        (attempt.reportData as any).overallPercentage >= 60 ? 'yellow' :
                        (attempt.reportData as any).overallPercentage >= 40 ? 'orange' : 'red'
                      }
                      size="sm"
                    >
                      {(attempt.reportData as any).overallPercentage?.toFixed(1) || 0}%
                    </Badge>
                    <Text size="sm" c="dimmed">
                      {(attempt.reportData as any).totalScore || 0} / {(attempt.reportData as any).totalPossible || 0}
                    </Text>
                  </Group>
                ) : (
                  <Text size="sm" c="dimmed">-</Text>
                )}
              </td>
              <td>
                <Text size="sm">
                  {attempt.startedAt ? new Date(attempt.startedAt).toLocaleDateString() : '-'}
                </Text>
              </td>
              <td>
                <Text size="sm">
                  {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : '-'}
                </Text>
              </td>
              <td>
                <Group gap="xs">
                  <ActionIcon variant="light" color="blue" onClick={() => openEditModal(attempt)}>
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon variant="light" color="red" onClick={() => openDeleteModal(attempt)}>
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {attempts.length === 0 && (
        <Card padding="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            No assessment attempts found
          </Text>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Attempt"
      >
        <Stack gap="md">
          <Select
            label="Participant"
            placeholder="Select participant"
            data={participants.map(p => ({ value: p.id, label: `${p.fullName} (${p.email})` }))}
            value={formData.participantId}
            onChange={(value) => setFormData({ ...formData, participantId: value || '' })}
            required
          />
          <Select
            label="Assessment"
            placeholder="Select assessment"
            data={assessments.map(a => ({ value: a.id, label: a.title }))}
            value={formData.assessmentId}
            onChange={(value) => setFormData({ ...formData, assessmentId: value || '' })}
            required
          />
          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'abandoned', label: 'Abandoned' }
            ]}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value || 'in_progress' })}
            required
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAttempt}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Attempt"
        size="xl"
      >
        <Stack gap="md">
          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'abandoned', label: 'Abandoned' }
            ]}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value || 'in_progress' })}
            required
          />
          
          {/* Report Data Display */}
          {selectedAttempt?.reportData && (
            <>
              <Divider label="Report Data" labelPosition="center" />
              <ReportDataDisplay reportData={selectedAttempt.reportData as ReportData} />
            </>
          )}
          
          {/* Raw JSON Editor (for advanced users) */}
          <Paper p="md" withBorder>
            <Text fw={600} size="md" mb="sm">Raw JSON Editor</Text>
            <Text size="sm" c="dimmed" mb="sm">
              Advanced: Edit the raw JSON data below. Changes will be validated before saving.
            </Text>
            <Textarea
              label="Report Data (JSON)"
              placeholder="Enter report data as JSON"
              value={formData.reportData}
              onChange={(e) => setFormData({ ...formData, reportData: e.target.value })}
              minRows={8}
              styles={{
                input: {
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }
              }}
            />
          </Paper>
          
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAttempt}>
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Attempt"
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="1rem" />} title="Warning" color="red">
            This will delete the attempt and all associated data. This action cannot be undone.
          </Alert>
          <Text>Are you sure you want to delete this attempt?</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteAttempt}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}