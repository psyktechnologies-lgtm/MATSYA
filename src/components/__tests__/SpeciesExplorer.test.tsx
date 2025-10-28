import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SpeciesExplorer from '../SpeciesExplorer';

const queryClient = new QueryClient({ defaultOptions: { mutations: {} } as any });

test('renders search input and sync button', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <SpeciesExplorer />
    </QueryClientProvider>
  );
  expect(screen.getByLabelText(/Search Species/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /OBIS Sync/i })).toBeInTheDocument();
});
