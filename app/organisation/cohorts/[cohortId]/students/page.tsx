'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, 
  Group, 
  Stack, 
  Text, 
  Title, 
  Button, 
  ActionIcon, 
  Modal, 
  Table,
  Badge,
  Alert,
  Loader,
  Center,
  ScrollArea,
  TextInput,
  Select
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle, IconUsers, IconArrowLeft, IconSearch } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useOrgContext } from '../../../components/use-org-context';

interface Student {
  id: string;
  email: string;
  fullName: string;
  stayOut: string;
  createdAt: string;
  lastActiveAt: string;
  cohortId: string;
  cohortName: string;
}

interface Cohort {
  id: string;
  name: string;
  organizationId: string;
  participantCount: number;
}

export default function CohortStudents() {
  const params = useParams();
  const router = useRouter();
  const { selectedOrgId, isInitialized } = useOrgContext();
  const cohortId = params.cohortId as string;
  
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stayOutFilter, setStayOutFilter] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('🔍 Students page useEffect:', { cohortId, selectedOrgId, isInitialized });
    // For organization users, fetch data immediately as the API gets org from user membership
    // For admin users, wait for selectedOrgId
    if (cohortId && (selectedOrgId || isInitialized)) {
      console.log('✅ Fetching students data...');
      fetchCohortData();
      fetchStudents();
    } else {
      console.log('❌ Not fetching students yet - waiting for context');
    }
  }, [cohortId, selectedOrgId, isInitialized]);

  const fetchCohortData = async () => {
    try {
      console.log('🔄 Fetching cohort data for cohortId:', cohortId);
      const response = await fetch('/api/organization/cohorts', {
        credentials: 'include',
      });
      
      console.log('📡 Cohort data API response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Cohort data received:', data);
        const cohortData = data.cohorts.find((c: Cohort) => c.id === cohortId);
        console.log('🔍 Found cohort data:', cohortData);
        setCohort(cohortData || null);
      } else {
        console.error('❌ Cohort data API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error fetching cohort data:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('🔄 Fetching students for cohortId:', cohortId);
      setLoading(true);
      const response = await fetch(`/api/organization/cohorts/${cohortId}/students`, {
        credentials: 'include',
      });
      
      console.log('📡 Students API response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Students data received:', data);
        setStudents(data.students || []);
      } else {
        const error = await response.json();
        console.error('❌ Students API error:', error);
        notifications.show({
          title: 'Error',
          message: error.error || 'Failed to fetch students',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch students',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/organization/cohorts/${cohortId}/students/${selectedStudent.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Student removed from cohort successfully',
          color: 'green',
        });
        setDeleteModalOpen(false);
        fetchStudents();
        fetchCohortData(); // Update participant count
      } else {
        const errorData = await response.json();
        notifications.show({
          title: 'Error',
          message: errorData.error || 'Failed to remove student',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove student',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStayOut = !stayOutFilter || student.stayOut === stayOutFilter;
    return matchesSearch && matchesStayOut;
  });

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
          <Text>Loading students...</Text>
        </Stack>
      </Center>
    );
  }

  if (!cohort) {
    return (
      <Stack gap="md">
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Cohort not found or access denied.
        </Alert>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.push('/organisation/cohorts')}
        >
          Back to Cohorts
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Group gap="md">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => router.push('/organisation/cohorts')}
          >
            Back to Cohorts
          </Button>
          <div>
            <Title order={2}>{cohort.name}</Title>
            <Text c="dimmed" size="sm">
              Manage students in this cohort
            </Text>
          </div>
        </Group>
        <Badge color="blue" variant="light" size="lg">
          {cohort.participantCount} student{cohort.participantCount !== 1 ? 's' : ''}
        </Badge>
      </Group>

      {/* Filters */}
      <Card padding="md" radius="md" withBorder>
        <Group gap="md">
          <TextInput
            placeholder="Search students..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by status"
            data={[
              { value: 'Stay', label: 'Stay' },
              { value: 'Out', label: 'Out' },
            ]}
            value={stayOutFilter}
            onChange={setStayOutFilter}
            clearable
            style={{ minWidth: 150 }}
          />
        </Group>
      </Card>

      {filteredStudents.length === 0 ? (
        <Card padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconUsers size={48} color="var(--mantine-color-gray-4)" />
            <Text size="lg" fw={500} c="dimmed">
              {students.length === 0 ? 'No students in this cohort' : 'No students match your search'}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {students.length === 0 
                ? 'Students will appear here once they are invited to this cohort'
                : 'Try adjusting your search or filter criteria'
              }
            </Text>
          </Stack>
        </Card>
      ) : (
        <Card padding="md" radius="md" withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Joined</Table.Th>
                  <Table.Th>Last Active</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredStudents.map((student) => (
                  <Table.Tr key={student.id}>
                    <Table.Td>
                      <Text fw={500}>{student.fullName}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{student.email}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={student.stayOut === 'Stay' ? 'green' : 'red'}
                        variant="light"
                      >
                        {student.stayOut}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {formatDate(student.createdAt)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {formatDate(student.lastActiveAt)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDeleteStudent(student)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      )}

      {/* Delete Student Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Student from Cohort"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            Are you sure you want to remove <strong>{selectedStudent?.fullName}</strong> from this cohort? 
            This action cannot be undone.
          </Alert>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={submitting}>
              Remove Student
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
