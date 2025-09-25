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

    try {
      const response = await fetch('/api/organization/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create organization');
      }

      notifications.show({
        title: 'Success',
        message: 'Organization created successfully!',
        color: 'green',
        icon: <IconCheck size={16} />
      });

      // Reset form
      setFormData({ name: '', description: '' });
      
      // Close modal
      close();
      
      // Reload page to show the new organization
      window.location.reload();

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
                You'll be the owner of this organization.
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
