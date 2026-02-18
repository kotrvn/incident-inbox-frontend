import { ReactNode } from 'react';
import { Box, Container, Flex, Heading, IconButton, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Box as="header" bg={colorMode === 'light' ? 'white' : 'gray.800'} borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="blue.500">Incident Inbox</Heading>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};