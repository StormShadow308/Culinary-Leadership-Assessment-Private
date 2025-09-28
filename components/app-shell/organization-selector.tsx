'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Select, 
  Group, 
  Text, 
  Badge,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { IconBuilding, IconRefresh } from '@tabler/icons-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  participantCount?: number;
}

interface OrganizationSelectorProps {
  isAdmin: boolean;
  currentOrgId?: string;
}

export function OrganizationSelector({ isAdmin, currentOrgId }: OrganizationSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(currentOrgId || null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch organizations
  const fetchOrganizations = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, [isAdmin]);

  // Update selected organization when currentOrgId changes
  useEffect(() => {
    if (currentOrgId) {
      setSelectedOrgId(currentOrgId);
    }
  }, [currentOrgId]);

  const handleOrganizationChange = (orgId: string | null) => {
    if (!orgId) return;
    
    setSelectedOrgId(orgId);
    
    // Get current path and update with new orgId
    const currentPath = window.location.pathname;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('orgId', orgId);
    
    // Navigate to the same page with new orgId
    router.push(newUrl.pathname + newUrl.search);
  };

  const handleRefresh = () => {
    fetchOrganizations();
  };

  if (!isAdmin) {
    return null;
  }

  const selectedOrg = organizations.find(org => org.id === selectedOrgId);

  return (
    <Group gap="sm" align="center">
      <IconBuilding size={16} />
      <Text size="sm" fw={500}>Organization:</Text>
      <Select
        placeholder="Select organization"
        value={selectedOrgId}
        onChange={handleOrganizationChange}
        data={organizations.map(org => ({
          value: org.id,
          label: org.name,
        }))}
        searchable
        clearable={false}
        size="sm"
        style={{ minWidth: 200 }}
        disabled={loading}
      />
      {selectedOrg && (
        <Badge size="sm" variant="light" color="blue">
          {selectedOrg.participantCount || 0} participants
        </Badge>
      )}
      <Tooltip label="Refresh organizations">
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={handleRefresh}
          loading={loading}
        >
          <IconRefresh size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
