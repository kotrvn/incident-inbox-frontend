import '@chakra-ui/react';

declare module '@chakra-ui/react' {
  export interface ThemeConfig {
    initialColorMode?: 'light' | 'dark' | 'system';
    useSystemColorMode?: boolean;
  }
}