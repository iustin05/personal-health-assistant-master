import { writable } from 'svelte/store';

export const createNavStore = () => ({
  isMobileMenuOpen: writable(false)
});