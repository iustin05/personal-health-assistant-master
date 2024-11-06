import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NavLogic } from '../../utils/navLogic';
import { createNavStore } from '../../stores/navStore';
import { writable, get } from 'svelte/store';

describe('NavLogic', () => {
  let navLogic;
  let mockPb;
  let mockAuthHelpers;
  let stores;
  let mockLanguageStore;
  let mockUpdateFn;

  beforeEach(() => {
    mockUpdateFn = vi.fn().mockResolvedValue({});
    
    mockPb = {
      authStore: {
        record: { id: 'user123' }
      },
      collection: vi.fn(() => ({
        update: mockUpdateFn
      }))
    };

    mockAuthHelpers = {
      signInWithMitId: vi.fn(),
      logout: vi.fn()
    };

    stores = createNavStore();
    mockLanguageStore = writable('en');

    navLogic = new NavLogic(mockPb, mockAuthHelpers, stores, mockLanguageStore);
  });

  describe('toggleMobileMenu', () => {
    it('should toggle mobile menu state', () => {
      expect(get(stores.isMobileMenuOpen)).toBe(false);
      navLogic.toggleMobileMenu();
      expect(get(stores.isMobileMenuOpen)).toBe(true);
    });
  });

  describe('setLanguage', () => {
    it('should update language and user preference', async () => {
      await navLogic.setLanguage('es');

      expect(get(mockLanguageStore)).toBe('es');
      expect(mockPb.collection).toHaveBeenCalledWith('users');
      expect(mockUpdateFn).toHaveBeenCalledWith('user123', {
        preferred_language: 'es'
      });
    });

    it('should only update language store when user is not logged in', async () => {
      mockPb.authStore.record = null;
      await navLogic.setLanguage('es');

      expect(get(mockLanguageStore)).toBe('es');
      expect(mockUpdateFn).not.toHaveBeenCalled();
    });

    it('should handle update errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockUpdateFn.mockRejectedValue(new Error('Update failed'));

      await navLogic.setLanguage('es');

      expect(get(mockLanguageStore)).toBe('es');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('authentication', () => {
    it('should handle login', async () => {
      await navLogic.handleLogin();
      expect(mockAuthHelpers.signInWithMitId).toHaveBeenCalled();
    });

    it('should handle login errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuthHelpers.signInWithMitId.mockRejectedValue(new Error('Login failed'));

      await navLogic.handleLogin();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle logout', async () => {
      await navLogic.handleLogout();
      expect(mockAuthHelpers.logout).toHaveBeenCalled();
    });
  });
});