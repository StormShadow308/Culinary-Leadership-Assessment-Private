'use client';

import { useState } from 'react';
import { 
  Modal, 
  TextInput, 
  Textarea, 
  Button, 
  Stack, 
  Group, 
  Alert,
  Title,
  Text
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconBuilding, IconCheck, IconX } from '@tabler/icons-react';

interface CreateOrganizationModalProps {
  opened?: boolean;
  onClose?: () => void;
}

export default function CreateOrganizationModal({ opened, onClose }: CreateOrganizationModalProps) {
  const [isOpen, { open, close }] = useDisclosure(opened || false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Organization name is required',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    setIsLoading(true);
    console.log('🚀 Creating organization:', formData);

    try {
      const response = await fetch('/api/organization/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('📡 Organization creation response:', { status: response.status, result });

      if (!response.ok) {
        // Handle specific error cases
        if (result.error === 'User already has an organization membership') {
          notifications.show({
            title: 'Organization Already Exists',
            message: 'You already have an organization membership. Please refresh the page to see your organization dashboard.',
            color: 'blue',
            icon: <IconBuilding size={16} />
          });
          // Close modal and reload page
          close();
          window.location.reload();
          return;
        }
        
        if (result.error === 'Only organization users can create organizations') {
          notifications.show({
            title: 'Access Denied',
            message: 'Only organization users can create organizations. Please contact your administrator.',
            color: 'red',
            icon: <IconX size={16} />
          });
          return;
        }
        
        throw new Error(result.error || 'Failed to create organization');
      }

      notifications.show({
        title: 'Success',
        message: 'Organization created successfully! You will be redirected to your dashboard.',
        color: 'green',
        icon: <IconCheck size={16} />
      });

      // Reset form
      setFormData({ name: '', description: '' });
      
      // Close modal
      close();
      
      // Reload page to show the new organization
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error creating organization:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create organization',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      close();
      onClose?.();
    }
  };

  return (
    <>
      <Button 
        leftSection={<IconBuilding size={16} />}
        onClick={open}
        size="md"
      >
        Create Organization
      </Button>

      <Modal
        opened={isOpen}
        onClose={handleClose}
        title={
          <Group>
            <IconBuilding size={20} />
            <Title order={3}>Create New Organization</Title>
          </Group>
        }
        size="md"
        centered
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Alert color="blue" icon={<IconBuilding size={16} />}>
              <Text size="sm">
                Create a new organization to start managing participants and cohorts. 
                You'll be the owner of this organization and will automatically receive 
                all 8 predefined cohorts for your organization.
              </Text>
            </Alert>

            <TextInput
              label="Organization Name"
              placeholder="Enter organization name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={isLoading}
            />

            <Textarea
              label="Description (Optional)"
              placeholder="Enter organization description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              minRows={3}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                leftSection={<IconCheck size={16} />}
              >
                Create Organization
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
