import { Outlet } from 'react-router-dom';
import { Box, Container, Flex, Heading, HStack, Text, Avatar, IconButton } from '@chakra-ui/react';
import { TriangleAlert, LogOut } from 'lucide-react';

export function Root() {
    return (
        <Box minH="100vh" bg="gray.50">
            <Box
                as="header"
                bg="white"
                borderBottomWidth="1px"
                borderColor="gray.200"
                position="sticky"
                top={0}
                zIndex={10}
                shadow="sm"
            >
                <Container maxW="container.xl" py={4}>
                    <Flex justify="space-between" align="center">
                        <HStack gap={3}>
                            <Box color="red.500">
                                <TriangleAlert size={32} />
                            </Box>
                            <Heading size="lg" color="blue.600" textTransform={'uppercase'}>
                                Incident Inbox
                            </Heading>
                        </HStack>
                        <HStack gap={4}>
                            <HStack gap={3}>
                                <Avatar.Root size="md">
                                    <Avatar.Fallback name="Оператор Анна" />
                                </Avatar.Root>
                                <Box>
                                    <Text fontWeight="medium">Оператор Анна</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        anna@logistics.ru
                                    </Text>
                                </Box>
                            </HStack>
                            <IconButton variant="ghost" colorPalette="gray" aria-label="Выйти">
                                <LogOut size={20} />
                            </IconButton>
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            <Box as="main" py={8}>
                <Outlet />
            </Box>
        </Box>
    );
}
