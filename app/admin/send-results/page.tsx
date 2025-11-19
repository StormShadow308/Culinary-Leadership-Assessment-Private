'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Title,
  Text,
  Table,
  Checkbox,
  Button,
  Group,
  TextInput,
  Badge,
  Alert,
  LoadingOverlay,
  Paper,
} from '@mantine/core';
import { IconMail, IconSearch, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useGlobalOrg } from '~/app/organisation/components/global-org-context';

interface Participant {
  id: string;
  email: string;
  fullName: string | null;
  cohortName: string | null;
  organizationName: string | null;
  preAssessmentStatus: string | null;
  postAssessmentStatus: string | null;
  preScore: number;
  postScore: number;
}

export default function AdminSendResultsPage() {
  const { selectedOrgId } = useGlobalOrg();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, [selectedOrgId]);

  const fetchParticipants = async () => {
    // Require an organization to be selected in the admin org selector
    if (!selectedOrgId) {
      setParticipants([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch participants for the currently selected organization
      const response = await fetch(`/api/organization/participants?orgId=${selectedOrgId}`);
      if (!response.ok) throw new Error('Failed to fetch participants');
      
      const data = await response.json();
      setParticipants(data.participants || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setResult({
        success: false,
        message: 'Failed to load participants',
      });
    } finally {
      setLoading(false);
    }
  };

  // If no organization is selected in the admin header, prompt the admin to choose one
  if (!selectedOrgId) {
    return (
      <Stack>
        <Alert icon={<IconAlertCircle />} title="No Organization Selected" color="yellow">
          Please select an organization in the header to send results.
        </Alert>
      </Stack>
    );
  }

  const filteredParticipants = participants.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    return (
      p.email.toLowerCase().includes(searchLower) ||
      (p.fullName && p.fullName.toLowerCase().includes(searchLower)) ||
      (p.cohortName && p.cohortName.toLowerCase().includes(searchLower))
    );
  });

  const completedParticipants = filteredParticipants.filter(
    p => p.preAssessmentStatus === 'completed' || p.postAssessmentStatus === 'completed'
  );

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === completedParticipants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(completedParticipants.map(p => p.id)));
    }
  };

  const handleSendResults = async () => {
    if (selectedIds.size === 0) return;

    try {
      setSending(true);
      setResult(null);

      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds: Array.from(selectedIds) }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully sent results to ${data.summary.sent} participant(s). ${data.summary.failed > 0 ? `Failed: ${data.summary.failed}` : ''}`,
        });
        setSelectedIds(new Set());
      } else {
        throw new Error(data.error || 'Failed to send results');
      }
    } catch (error) {
      console.error('Error sending results:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send results',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Stack>
      <div>
        <Title order={2}>Send Assessment Results</Title>
        <Text c="dimmed" size="sm" mt="xs">
          Send personalized assessment results via email to participants of the selected organization.
        </Text>
      </div>

      {result && (
        <Alert
          icon={result.success ? <IconCheck /> : <IconAlertCircle />}
          title={result.success ? 'Success' : 'Error'}
          color={result.success ? 'green' : 'red'}
          withCloseButton
          onClose={() => setResult(null)}
        >
          {result.message}
        </Alert>
      )}

      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md" wrap="wrap" gap="sm">
          <TextInput
            placeholder="Search by name, email, or cohort..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: 220, maxWidth: 400 }}
          />
          <Group gap="sm" wrap="wrap">
            <Button
              variant="light"
              onClick={toggleAll}
              disabled={completedParticipants.length === 0}
            >
              {selectedIds.size === completedParticipants.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              leftSection={<IconMail size={16} />}
              onClick={handleSendResults}
              disabled={selectedIds.size === 0 || sending}
              loading={sending}
            >
              Send Results ({selectedIds.size})
            </Button>
          </Group>
        </Group>

        <div style={{ position: 'relative', overflowX: 'auto' }}>
          <LoadingOverlay visible={loading} />
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }}>
                  <Checkbox
                    checked={selectedIds.size === completedParticipants.length && completedParticipants.length > 0}
                    indeterminate={selectedIds.size > 0 && selectedIds.size < completedParticipants.length}
                    onChange={toggleAll}
                  />
                </Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Cohort</Table.Th>
                <Table.Th>Pre-Assessment</Table.Th>
                <Table.Th>Post-Assessment</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {completedParticipants.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    <Text c="dimmed">
                      {loading ? 'Loading participants...' : 'No independent students with completed assessments found'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                completedParticipants.map((participant) => (
                  <Table.Tr
                    key={participant.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleSelection(participant.id)}
                  >
                    <Table.Td>
                      <Checkbox
                        checked={selectedIds.has(participant.id)}
                        onChange={() => toggleSelection(participant.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Table.Td>
                    <Table.Td>{participant.fullName || 'N/A'}</Table.Td>
                    <Table.Td>{participant.email}</Table.Td>
                    <Table.Td>{participant.cohortName || 'Independent'}</Table.Td>
                    <Table.Td>
                      {participant.preAssessmentStatus === 'completed' ? (
                        <Badge color="green" size="sm">
                          Completed ({participant.preScore}/40)
                        </Badge>
                      ) : (
                        <Badge color="gray" size="sm">
                          Not Completed
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {participant.postAssessmentStatus === 'completed' ? (
                        <Badge color="blue" size="sm">
                          Completed ({participant.postScore}/40)
                        </Badge>
                      ) : (
                        <Badge color="gray" size="sm">
                          Not Completed
                        </Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </Paper>
    </Stack>
  );
}
