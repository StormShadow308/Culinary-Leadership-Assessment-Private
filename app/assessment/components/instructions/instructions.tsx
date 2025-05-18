import { Alert, List, ListItem, Text } from '@mantine/core';

export function Instructions() {
  return (
    <>
      <Alert variant="light" title="Instructions" color="gray">
        <List withPadding>
          <ListItem>Read each situation carefully</ListItem>
          <ListItem>
            Choose the <strong>BEST</strong> and <strong>WORST</strong> options
          </ListItem>
          <ListItem>Select from the available options</ListItem>
          <ListItem>You can navigate back to change answers</ListItem>
        </List>
      </Alert>
      <Alert variant="light" title="Note">
        <Text>
          This assessment takes approximately 15-20 minutes to complete. Please ensure you have
          enough time to complete it in one sitting for the most accurate leadership profile.
        </Text>
      </Alert>
    </>
  );
}
