import { ReactNode } from 'react';
import { Box, Container, Flex, Heading } from '@chakra-ui/react';


interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box minH="100vh" bg={'gray.50'}>
      <Box
        as="header"
        bg={'white'}
        borderBottomWidth="1px"
        borderColor="gray.200"
        py={4}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="blue.500">Incident Inbox</Heading>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};