import { describe, it, expect } from 'vitest';
import { page, selectedPlant } from '../src/lib/navigation';
import { user, supabaseUrl, supabaseAnonKey } from '../src/lib/stores';

// navigation.js

describe('navigation store', () => {
  it('should set and get page', () => {
    let value;
    page.subscribe(v => value = v)();
    expect(value).toBe('dashboard');
    page.set('profile');
    page.subscribe(v => value = v)();
    expect(value).toBe('profile');
  });

  it('should set and get selectedPlant', () => {
    let value;
    selectedPlant.set({ id: 1, name: 'Test' });
    selectedPlant.subscribe(v => value = v)();
    expect(value).toEqual({ id: 1, name: 'Test' });
  });
});

// stores.js

describe('user store', () => {
  it('should set and get user', () => {
    let value;
    user.set({ id: 1, email: 'test@example.com' });
    user.subscribe(v => value = v)();
    expect(value).toEqual({ id: 1, email: 'test@example.com' });
  });
});

describe('env variables', () => {
  it('should have supabase env variables defined (may be empty)', () => {
    expect(supabaseUrl).toBeDefined();
    expect(supabaseAnonKey).toBeDefined();
  });
});
