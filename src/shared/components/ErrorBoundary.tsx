import { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  Code,
  HStack,
  Collapsible,
  Portal,
} from '@chakra-ui/react';
import { ChevronDown, ChevronUp, TriangleAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }


  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    console.error('Error caught by boundary:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxW="container.md" py={20}>
          <VStack gap={6} align="stretch">
            <Box textAlign="center">
              <Icon size="2xl" color="red.500" mb={4}>
                <TriangleAlert />
              </Icon>
              <Heading size="xl" mb={2}>
                Что-то пошло не так
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Произошла критическая ошибка. Наша команда уже уведомлена.
              </Text>
            </Box>

            <Box bg="red.50" p={4} borderRadius="md" borderWidth="1px" borderColor="red.200">
              <Text fontWeight="bold" color="red.800" mb={2}>
                {this.state.error?.name || 'Ошибка'}
              </Text>
              <Text color="red.600">
                {this.state.error?.message || 'Неизвестная ошибка'}
              </Text>
            </Box>

            <Collapsible.Root
              open={this.state.showDetails}
              onOpenChange={({ open }) => this.setState({ showDetails: open })}
            >
              <Collapsible.Trigger asChild>
                <Button variant="ghost" size="sm" width="fit-content" mx="auto">
                  <HStack gap={2}>
                    <Text>
                      {this.state.showDetails ? 'Скрыть детали' : 'Показать детали'}
                    </Text>
                    <Icon size="sm">
                      {this.state.showDetails ? <ChevronUp /> : <ChevronDown />}
                    </Icon>
                  </HStack>
                </Button>
              </Collapsible.Trigger>
              <Portal>
                <Collapsible.Content>
                  <Box bg="gray.800" p={4} borderRadius="md" mt={4}>
                    <Code
                      as="pre"
                      display="block"
                      whiteSpace="pre-wrap"
                      fontSize="sm"
                      color="white"
                      bg="transparent"
                    >
                      {this.state.error?.stack}
                    </Code>
                    {this.state.errorInfo && (
                      <Code
                        as="pre"
                        display="block"
                        whiteSpace="pre-wrap"
                        fontSize="sm"
                        color="white"
                        bg="transparent"
                        mt={4}
                      >
                        Component Stack:
                        {this.state.errorInfo.componentStack}
                      </Code>
                    )}
                  </Box>
                </Collapsible.Content>
              </Portal>
            </Collapsible.Root>

            <HStack gap={4} justify="center" pt={4}>
              <Button onClick={this.handleGoBack} variant="outline">
                Вернуться назад
              </Button>
              <Button onClick={this.handleReload} colorPalette="blue">
                Перезагрузить страницу
              </Button>
            </HStack>
          </VStack>
        </Container>
      );
    }

    return this.props.children;
  }
}