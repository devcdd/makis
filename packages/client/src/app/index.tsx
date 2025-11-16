import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes } from './providers/router';
import '../index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  );
}
