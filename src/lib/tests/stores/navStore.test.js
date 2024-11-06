import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { createNavStore } from '../../stores/navStore';

describe('navStore', () => {
  it('should create store with initial value', () => {
    const stores = createNavStore();
    expect(get(stores.isMobileMenuOpen)).toBe(false);
  });

  it('should update mobile menu state', () => {
    const stores = createNavStore();
    stores.isMobileMenuOpen.set(true);
    expect(get(stores.isMobileMenuOpen)).toBe(true);
  });
});
