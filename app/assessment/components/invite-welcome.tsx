'use client';

import { useEffect, useState } from 'react';
import { Alert, Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconMail, IconUser } from '@tabler/icons-react';

interface Participant {
  id: string;
  fullName: string;
  email: string;
  organizationName?: string;
  cohortName?: string;
}

interface InviteWelcomeProps {
  participantName?: string;
  participantEmail?: string;
  isInvite?: boolean;
}

export function InviteWelcome({ participantName, participantEmail, isInvite }: InviteWelcomeProps) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if this is an invite link
    const urlParams = new URLSearchParams(window.location.search);
    const isInviteLink = urlParams.get('invite') === 'true';
    const participantId = urlParams.get('participant');
    const name = urlParams.get('name');
    const email = urlParams.get('email');

    if (isInviteLink && (participantId || name || email)) {
      setShowWelcome(true);
      
      // If we have participant data, use it
      if (participantName && participantEmail) {
        setParticipant({
          id: participantId || '',
          fullName: participantName,
          email: participantEmail,
        });
      } else if (email) {
        // Fetch participant data dynamically
        fetchParticipantData(email);
      }
      
      // Clear the invite parameters from URL after showing welcome
      setTimeout(() => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('invite');
        newUrl.searchParams.delete('participant');
        newUrl.searchParams.delete('name');
        newUrl.searchParams.delete('email');
        window.history.replaceState({}, '', newUrl.toString());
      }, 5000);
    }
  }, [participantName, participantEmail, isInvite]);

  const fetchParticipantData = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/participant-info?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setParticipant(data.participant);
      }
    } catch (error) {
      console.error('Error fetching participant data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showWelcome && !isInvite) {
    return null;
  }

  const displayName = participant?.fullName || participantName || 'Participant';
  const displayEmail = participant?.email || participantEmail;

  return (
    <Box mb="md">
      <Alert
        icon={<IconCheck size="1rem" />}
        title="Welcome to the Assessment!"
        color="green"
        variant="light"
        radius="md"
      >
        <Stack gap="sm">
          <Text size="sm">
            Hello <strong>{displayName}</strong>! You've been invited to participate in the Culinary Leadership Assessment.
          </Text>
          
          <Group gap="xs" wrap="nowrap">
            <IconUser size="1rem" />
            <Text size="sm" c="dimmed">
              <strong>Participant:</strong> {displayName}
            </Text>
          </Group>
          
          {displayEmail && (
            <Group gap="xs" wrap="nowrap">
              <IconMail size="1rem" />
              <Text size="sm" c="dimmed">
                <strong>Email:</strong> {displayEmail}
              </Text>
            </Group>
          )}
          
          {participant?.organizationName && (
            <Group gap="xs" wrap="nowrap">
              <IconUser size="1rem" />
              <Text size="sm" c="dimmed">
                <strong>Organization:</strong> {participant.organizationName}
              </Text>
            </Group>
          )}
          
          {participant?.cohortName && (
            <Group gap="xs" wrap="nowrap">
              <IconUser size="1rem" />
              <Text size="sm" c="dimmed">
                <strong>Cohort:</strong> {participant.cohortName}
              </Text>
            </Group>
          )}
          
          <Text size="sm" mt="xs">
            Please complete the form below to begin your assessment. This assessment will help evaluate your leadership skills and potential in the culinary industry.
          </Text>
        </Stack>
      </Alert>
    </Box>
  );
}
