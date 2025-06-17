import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Dashboard from '../src/lib/Dashboard.svelte';
import PlantDetail from '../src/lib/PlantDetail.svelte';
import UserProfile from '../src/lib/UserProfile.svelte';

// Mock navigation store
vi.mock('../src/lib/navigation', () => ({
  page: { subscribe: fn => fn('dashboard'), set: () => {} },
  selectedPlant: { subscribe: fn => fn(null), set: () => {} },
}));

// Mock supabaseClient
vi.mock('../src/lib/supabaseClient', () => ({
  fetchTable: async () => [
    { id: 1, name: 'Monstera', species: 'Monstera deliciosa', cover_image_url: '', notes: 'Pianta test' }
  ]
}));

describe('Dashboard', () => {
  it('renders plant cards and add button', async () => {
    const { getByText } = render(Dashboard);
    expect(getByText('Le tue piante')).toBeTruthy();
    expect(getByText('Monstera')).toBeTruthy();
    expect(getByText('Aggiungi nuova pianta')).toBeTruthy();
  });
});

describe('PlantDetail', () => {
  it('shows placeholder if no plant selected', () => {
    const { getByText } = render(PlantDetail);
    expect(getByText('Nessuna pianta selezionata.')).toBeTruthy();
  });
});

describe('UserProfile', () => {
  it('shows unauthenticated message if no user', () => {
    const { getByText } = render(UserProfile);
    expect(getByText('Utente non autenticato.')).toBeTruthy();
  });
});
