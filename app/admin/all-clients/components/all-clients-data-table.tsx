'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  TextInput,
  Select,
  Group,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Stack,
  ScrollArea,
  Button,
  Modal,
  Textarea,
  NumberInput,
  Grid,
  Divider,
  Card
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';
import {
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconPlus,
  IconChevronDown,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

// Define the data structure based on the spreadsheet
interface ClientData {
  id: string;
  client: string;
  cohort: string;
  keyAnswer: string;
  datePreProgram: string | null;
  datePostProgram: string | null;
  retainRate: number;
  // Pre-program metrics
  preResilience: number;
  preTeamDynamics: number;
  preDecisionMaking: number;
  preSelfAwareness: number;
  preCommunication: number;
  preOverallScore: number;
  // Post-program metrics
  postResilience: number;
  postTeamDynamics: number;
  postDecisionMaking: number;
  postSelfAwareness: number;
  postCommunication: number;
  postOverallScore: number;
}

// Mock data based on the spreadsheet example
const mockData: ClientData[] = [
  {
    id: '1',
    client: 'Edwins Leadership and Restaurant Institute',
    cohort: 'E-110424',
    keyAnswer: 'Culinary A',
    datePreProgram: '2024-10-20',
    datePostProgram: null,
    retainRate: 82,
    preResilience: 3.00,
    preTeamDynamics: 3.45,
    preDecisionMaking: 2.82,
    preSelfAwareness: 2.64,
    preCommunication: 1.91,
    preOverallScore: 13.82,
    postResilience: 0.00,
    postTeamDynamics: 0.00,
    postDecisionMaking: 0.00,
    postSelfAwareness: 0.00,
    postCommunication: 0.00,
    postOverallScore: 0.00,
  },
  {
    id: '2',
    client: 'Family',
    cohort: 'F-112424',
    keyAnswer: 'Culinary A',
    datePreProgram: null,
    datePostProgram: null,
    retainRate: 100,
    preResilience: 0.00,
    preTeamDynamics: 0.00,
    preDecisionMaking: 0.00,
    preSelfAwareness: 0.00,
    preCommunication: 0.00,
    preOverallScore: 0.00,
    postResilience: 0.00,
    postTeamDynamics: 0.00,
    postDecisionMaking: 0.00,
    postSelfAwareness: 0.00,
    postCommunication: 0.00,
    postOverallScore: 0.00,
  },
  {
    id: '2.5',
    client: 'Huzaifa\'s Organization',
    cohort: 'MANAGEMEN...',
    keyAnswer: 'Culinary C',
    datePreProgram: null,
    datePostProgram: '2025-10-04',
    retainRate: 53,
    preResilience: 0.00,
    preTeamDynamics: 1.00,
    preDecisionMaking: 1.00,
    preSelfAwareness: 1.00,
    preCommunication: 0.00,
    preOverallScore: 3.00,
    postResilience: 0.00,
    postTeamDynamics: 0.00,
    postDecisionMaking: 0.00,
    postSelfAwareness: 0.00,
    postCommunication: 0.00,
    postOverallScore: 0.00,
  },
  {
    id: '3',
    client: 'Edwins Leadership and Restaurant Institute',
    cohort: 'E-010924',
    keyAnswer: 'Culinary A',
    datePreProgram: null,
    datePostProgram: null,
    retainRate: 92,
    preResilience: 3.71,
    preTeamDynamics: 2.26,
    preDecisionMaking: 3.92,
    preSelfAwareness: 3.16,
    preCommunication: 3.76,
    preOverallScore: 16.82,
    postResilience: 0.00,
    postTeamDynamics: 0.00,
    postDecisionMaking: 0.00,
    postSelfAwareness: 0.00,
    postCommunication: 0.00,
    postOverallScore: 0.00,
  },
];

type SortField = keyof ClientData;
type SortDirection = 'asc' | 'desc';

export function AllClientsDataTable() {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('client');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingRow, setEditingRow] = useState<ClientData | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  // Fetch data from API only on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching clients data from API...');
        
        const response = await fetch('/api/admin/all-clients', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('📡 API Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ API Response data:', result);
          console.log('🔍 Clients data:', result.clients);
          console.log('🔍 Data length:', result.clients?.length || 0);
          setData(result.clients || []);
        } else {
          const errorText = await response.text();
          console.error('❌ API Error:', response.status, errorText);
          console.log('🔍 Using fallback data due to API error');
          // Use fallback data if API fails
          setData([
            {
              id: '1',
              client: 'Culinary Leadership Academy',
              cohort: 'AUTUMN 2024',
              keyAnswer: 'A',
              datePreProgram: '2024-09-01',
              datePostProgram: '2024-12-01',
              retainRate: 85,
              preResilience: 3.5,
              preTeamDynamics: 4.2,
              preDecisionMaking: 3.8,
              preSelfAwareness: 4.0,
              preCommunication: 3.9,
              preOverallScore: 19.4,
              postResilience: 4.1,
              postTeamDynamics: 4.5,
              postDecisionMaking: 4.3,
              postSelfAwareness: 4.2,
              postCommunication: 4.4,
              postOverallScore: 21.5,
            },
            {
              id: '2',
              client: 'Galtec Organization',
              cohort: 'SPRING 2025',
              keyAnswer: 'B',
              datePreProgram: '2025-03-01',
              datePostProgram: null,
              retainRate: 0,
              preResilience: 2.8,
              preTeamDynamics: 3.1,
              preDecisionMaking: 2.9,
              preSelfAwareness: 3.0,
              preCommunication: 2.7,
              preOverallScore: 14.5,
              postResilience: 0.0,
              postTeamDynamics: 0.0,
              postDecisionMaking: 0.0,
              postSelfAwareness: 0.0,
              postCommunication: 0.0,
              postOverallScore: 0.0,
            }
          ]);
          notifications.show({
            title: 'API Error - Using Sample Data',
            message: `Failed to load real data: ${errorText}`,
            color: 'orange',
          });
        }
      } catch (error) {
        console.error('❌ Network error fetching clients data:', error);
        console.log('🔍 Using fallback data due to network error');
        // Use fallback data if network fails
        setData([
          {
            id: '1',
            client: 'Culinary Leadership Academy',
            cohort: 'AUTUMN 2024',
            keyAnswer: 'A',
            datePreProgram: '2024-09-01',
            datePostProgram: '2024-12-01',
            retainRate: 85,
            preResilience: 3.5,
            preTeamDynamics: 4.2,
            preDecisionMaking: 3.8,
            preSelfAwareness: 4.0,
            preCommunication: 3.9,
            preOverallScore: 19.4,
            postResilience: 4.1,
            postTeamDynamics: 4.5,
            postDecisionMaking: 4.3,
            postSelfAwareness: 4.2,
            postCommunication: 4.4,
            postOverallScore: 21.5,
          },
          {
            id: '2',
            client: 'Galtec Organization',
            cohort: 'SPRING 2025',
            keyAnswer: 'B',
            datePreProgram: '2025-03-01',
            datePostProgram: null,
            retainRate: 0,
            preResilience: 2.8,
            preTeamDynamics: 3.1,
            preDecisionMaking: 2.9,
            preSelfAwareness: 3.0,
            preCommunication: 2.7,
            preOverallScore: 14.5,
            postResilience: 0.0,
            postTeamDynamics: 0.0,
            postDecisionMaking: 0.0,
            postSelfAwareness: 0.0,
            postCommunication: 0.0,
            postOverallScore: 0.0,
          }
        ]);
        notifications.show({
          title: 'Network Error - Using Sample Data',
          message: 'Failed to fetch client data, showing sample data',
          color: 'orange',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item =>
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cohort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keyAnswer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (row: ClientData) => {
    setEditingRow({ ...row });
    open();
  };

  const handleKeyAnswerChange = (rowId: string, newKeyAnswer: string) => {
    setData(prev => prev.map(item => 
      item.id === rowId ? { ...item, keyAnswer: newKeyAnswer } : item
    ));
  };

  const handleSave = () => {
    if (editingRow) {
      setData(prev => prev.map(item => 
        item.id === editingRow.id ? editingRow : item
      ));
      setEditingRow(null);
      close();
    }
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNew = () => {
    const newRow: ClientData = {
      id: Date.now().toString(),
      client: '',
      cohort: '',
      keyAnswer: 'Culinary A',
      datePreProgram: null,
      datePostProgram: null,
      retainRate: 0,
      preResilience: 0,
      preTeamDynamics: 0,
      preDecisionMaking: 0,
      preSelfAwareness: 0,
      preCommunication: 0,
      preOverallScore: 0,
      postResilience: 0,
      postTeamDynamics: 0,
      postDecisionMaking: 0,
      postSelfAwareness: 0,
      postCommunication: 0,
      postOverallScore: 0,
    };
    setEditingRow(newRow);
    open();
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <IconChevronDown size={16} />;
    return sortDirection === 'asc' ? <IconSortAscending size={16} color="var(--mantine-color-blue-6)" /> : <IconSortDescending size={16} color="var(--mantine-color-blue-6)" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const formatNumber = (value: number) => {
    return value === 0 ? '0.00' : value.toFixed(2);
  };



  return (
    <Stack 
      gap="md" 
      style={{ 
        backgroundColor: 'transparent',
        minHeight: '100vh'
      }}
    >
      {/* Summary Statistics */}
      <Group gap="md" wrap="wrap">
        <Badge size="lg" variant="light" color="blue">
          Total Clients: {data.length}
        </Badge>
        <Badge size="lg" variant="light" color="green">
          Filtered: {filteredAndSortedData.length}
        </Badge>
        <Badge size="lg" variant="light" color="orange">
          Avg Retain Rate: {data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.retainRate, 0) / data.length) : 0}%
        </Badge>
      </Group>

      {/* Search and Filter Controls */}
      <Group justify="space-between" wrap="wrap">
        <Group gap="md" wrap="wrap">
          <TextInput
            placeholder="Search clients, cohorts, or key answers..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 300 }}
          />
          <Button
            leftSection={<IconFilter size={16} />}
            variant="light"
            size="sm"
          >
            Filters
          </Button>
        </Group>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleAddNew}
        >
          Add New Client
        </Button>
      </Group>


      {/* Data Table Container */}
        <Card 
          withBorder 
          padding={0} 
          radius="md"
        >

          <ScrollArea 
            ref={scrollAreaRef}
            type="scroll" 
            scrollbarSize={8} 
            offsetScrollbars={false}
            style={{ 
              height: '70vh',
              width: '100%',
              borderRadius: '8px'
            }}
            scrollHideDelay={1000}
            classNames={{
              scrollbar: 'custom-scrollbar',
              thumb: 'custom-scrollbar-thumb',
              track: 'custom-scrollbar-track',
              viewport: 'custom-scrollbar-viewport',
            }}
          >
        {loading ? (
          <Stack align="center" py="xl">
            <Text>Loading client data...</Text>
          </Stack>
        ) : data.length === 0 ? (
          <Stack align="center" py="xl">
            <Text c="dimmed">No client data available</Text>
            <Text size="sm" c="dimmed">Check the API connection or data source</Text>
            <Text size="xs" c="dimmed">Debug: Data length = {data.length}</Text>
          </Stack>
        ) : (
          <Table 
            striped 
            highlightOnHover 
            withTableBorder 
            withColumnBorders
            style={{ 
              minWidth: '1400px',
              cursor: 'pointer',
              borderCollapse: 'separate',
              borderSpacing: 0
            }}
            styles={{
              thead: {
                position: 'sticky',
                top: 0,
                zIndex: 10
              },
              tr: {
                '&:hover': {
                  backgroundColor: 'var(--mantine-color-gray-1) !important'
                }
              },
              th: {
                padding: '12px 16px',
                fontSize: '14px'
              },
              td: {
                padding: '12px 16px',
                fontSize: '13px'
              }
            }}
          >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '200px', minWidth: '200px' }}>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('client')}>
                  <Text fw={600} size="sm">Client</Text>
                  {getSortIcon('client')}
                </Group>
              </Table.Th>
              <Table.Th style={{ width: '120px', minWidth: '120px' }}>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('cohort')}>
                  <Text fw={600} size="sm">Cohort</Text>
                  {getSortIcon('cohort')}
                </Group>
              </Table.Th>
              <Table.Th style={{ width: '100px', minWidth: '100px' }}>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('keyAnswer')}>
                  <Text fw={600} size="sm">Key Answer</Text>
                  {getSortIcon('keyAnswer')}
                </Group>
              </Table.Th>
              <Table.Th style={{ width: '120px', minWidth: '120px' }}>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('datePreProgram')}>
                  <Text fw={600} size="sm">Date Pre-Program</Text>
                  {getSortIcon('datePreProgram')}
                </Group>
              </Table.Th>
              <Table.Th style={{ width: '120px', minWidth: '120px' }}>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('datePostProgram')}>
                  <Text fw={600} size="sm">Date Post-Program</Text>
                  {getSortIcon('datePostProgram')}
                </Group>
              </Table.Th>
              <Table.Th style={{ width: '100px', minWidth: '100px' }}>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('retainRate')}>
                  <Text fw={600} size="sm">Retain Rate</Text>
                  {getSortIcon('retainRate')}
                </Group>
              </Table.Th>
              
              {/* Pre-Program Metrics Group */}
              <Table.Th colSpan={6} style={{ textAlign: 'center', backgroundColor: '#f8f9fa', minWidth: '600px' }}>
                <Text fw={700} size="sm">(Average Grade) Pre-Program</Text>
              </Table.Th>
              
              {/* Post-Program Metrics Group */}
              <Table.Th colSpan={6} style={{ textAlign: 'center', backgroundColor: '#f8f9fa', minWidth: '600px' }}>
                <Text fw={700} size="sm">(Average Grade) Post-Program</Text>
              </Table.Th>
              
              
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
            
            {/* Sub-header row for metrics */}
            <Table.Tr>
              <Table.Th style={{ width: '200px' }}></Table.Th>
              <Table.Th style={{ width: '120px' }}></Table.Th>
              <Table.Th style={{ width: '100px' }}></Table.Th>
              <Table.Th style={{ width: '120px' }}></Table.Th>
              <Table.Th style={{ width: '120px' }}></Table.Th>
              <Table.Th style={{ width: '100px' }}></Table.Th>
              
              {/* Pre-program sub-headers */}
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>1.Resilience</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>1.Team Dynamics</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>1.Decision-Making</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>1.Self-Awareness</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>1.Communication</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>1.Overall</Text>
              </Table.Th>
              
              {/* Post-program sub-headers */}
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>2.Resilience</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>2.Team Dynamics</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>2.Decision-Making</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>2.Self-Awareness</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>2.Communication</Text>
              </Table.Th>
              <Table.Th style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                <Text size="xs" fw={500}>2.Overall</Text>
              </Table.Th>
              
              
              <Table.Th style={{ width: '100px', minWidth: '100px' }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          
          <Table.Tbody>
            {filteredAndSortedData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td style={{ width: '200px', minWidth: '200px' }}>
                  <Text size="sm" fw={500} truncate title={row.client}>{row.client}</Text>
                </Table.Td>
                <Table.Td style={{ width: '120px', minWidth: '120px' }}>
                  <Badge variant="light" color="blue" size="sm">{row.cohort}</Badge>
                </Table.Td>
                <Table.Td style={{ width: '100px', minWidth: '100px' }}>
                  <Select
                    size="xs"
                    value={row.keyAnswer}
                    onChange={(value) => handleKeyAnswerChange(row.id, value || 'Culinary A')}
                    data={[
                      { value: 'Culinary A', label: 'A' },
                      { value: 'Culinary B', label: 'B' },
                      { value: 'Culinary C', label: 'C' },
                      { value: 'Culinary D', label: 'D' },
                      { value: 'Culinary E', label: 'E' },
                      { value: 'Culinary F', label: 'F' },
                      { value: 'Culinary G', label: 'G' },
                      { value: 'Culinary H', label: 'H' },
                    ]}
                    style={{ width: '60px', maxWidth: '60px' }}
                    maxDropdownHeight={150}
                    searchable
                    styles={{
                      input: {
                        fontSize: '10px',
                        padding: '2px 4px',
                        minHeight: '20px',
                        height: '20px',
                        textAlign: 'center',
                        width: '60px',
                        maxWidth: '60px'
                      }
                    }}
                  />
                </Table.Td>
                <Table.Td style={{ width: '120px', minWidth: '120px' }}>
                  <Text size="sm">{formatDate(row.datePreProgram)}</Text>
                </Table.Td>
                <Table.Td style={{ width: '120px', minWidth: '120px' }}>
                  <Text size="sm">{formatDate(row.datePostProgram)}</Text>
                </Table.Td>
                <Table.Td style={{ width: '100px', minWidth: '100px' }}>
                  <Badge 
                    color={row.retainRate >= 80 ? 'green' : row.retainRate >= 50 ? 'yellow' : 'red'}
                    variant="light"
                    size="sm"
                  >
                    {row.retainRate}%
                  </Badge>
                </Table.Td>
                
                {/* Pre-program metrics */}
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.preResilience)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.preTeamDynamics)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.preDecisionMaking)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.preSelfAwareness)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.preCommunication)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.preOverallScore)}</Text>
                </Table.Td>
                
                {/* Post-program metrics */}
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.postResilience)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.postTeamDynamics)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.postDecisionMaking)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.postSelfAwareness)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.postCommunication)}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{formatNumber(row.postOverallScore)}</Text>
                </Table.Td>
                
                
                <Table.Td style={{ width: '100px', minWidth: '100px' }}>
                  <Group gap="xs" justify="center">
                    <Tooltip label="Edit">
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => handleEdit(row)}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => handleDelete(row.id)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        )}
        </ScrollArea>
      </Card>

      {/* Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingRow?.id === data.find(d => d.id === editingRow?.id)?.id ? 'Edit Client Data' : 'Add New Client'}
        size="xl"
      >
        {editingRow && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Client"
                  value={editingRow.client}
                  onChange={(e) => setEditingRow({ ...editingRow, client: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Cohort"
                  value={editingRow.cohort}
                  onChange={(e) => setEditingRow({ ...editingRow, cohort: e.target.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Key Answer"
                  value={editingRow.keyAnswer}
                  onChange={(value) => setEditingRow({ ...editingRow, keyAnswer: value || 'Culinary A' })}
                  data={['Culinary A', 'Culinary B', 'Culinary C']}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Retain Rate (%)"
                  value={editingRow.retainRate}
                  onChange={(value) => setEditingRow({ ...editingRow, retainRate: Number(value) || 0 })}
                  min={0}
                  max={100}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Date Pre-Program"
                  value={editingRow.datePreProgram ? new Date(editingRow.datePreProgram) : null}
                  onChange={(value) => setEditingRow({ 
                    ...editingRow, 
                    datePreProgram: value ? value.toISOString().split('T')[0] : null 
                  })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Date Post-Program"
                  value={editingRow.datePostProgram ? new Date(editingRow.datePostProgram) : null}
                  onChange={(value) => setEditingRow({ 
                    ...editingRow, 
                    datePostProgram: value ? value.toISOString().split('T')[0] : null 
                  })}
                />
              </Grid.Col>
            </Grid>

            <Divider label="Pre-Program Metrics" />
            
            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Resilience and Adaptability"
                  value={editingRow.preResilience}
                  onChange={(value) => setEditingRow({ ...editingRow, preResilience: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Team Dynamics & Collaboration"
                  value={editingRow.preTeamDynamics}
                  onChange={(value) => setEditingRow({ ...editingRow, preTeamDynamics: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Decision-Making & Problem-Solving"
                  value={editingRow.preDecisionMaking}
                  onChange={(value) => setEditingRow({ ...editingRow, preDecisionMaking: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Self-Awareness & Emotional Intelligence"
                  value={editingRow.preSelfAwareness}
                  onChange={(value) => setEditingRow({ ...editingRow, preSelfAwareness: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Communication & Active Listening"
                  value={editingRow.preCommunication}
                  onChange={(value) => setEditingRow({ ...editingRow, preCommunication: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Overall Score"
                  value={editingRow.preOverallScore}
                  onChange={(value) => setEditingRow({ ...editingRow, preOverallScore: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
            </Grid>

            <Divider label="Post-Program Metrics" />
            
            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Resilience and Adaptability"
                  value={editingRow.postResilience}
                  onChange={(value) => setEditingRow({ ...editingRow, postResilience: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Team Dynamics & Collaboration"
                  value={editingRow.postTeamDynamics}
                  onChange={(value) => setEditingRow({ ...editingRow, postTeamDynamics: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Decision-Making & Problem-Solving"
                  value={editingRow.postDecisionMaking}
                  onChange={(value) => setEditingRow({ ...editingRow, postDecisionMaking: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Self-Awareness & Emotional Intelligence"
                  value={editingRow.postSelfAwareness}
                  onChange={(value) => setEditingRow({ ...editingRow, postSelfAwareness: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Communication & Active Listening"
                  value={editingRow.postCommunication}
                  onChange={(value) => setEditingRow({ ...editingRow, postCommunication: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Overall Score"
                  value={editingRow.postOverallScore}
                  onChange={(value) => setEditingRow({ ...editingRow, postOverallScore: Number(value) || 0 })}
                  decimalScale={2}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={close}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
