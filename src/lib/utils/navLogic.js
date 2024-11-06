export class NavLogic {
  constructor(pb, authHelpers, stores, languageStore) {
    this.pb = pb;
    this.authHelpers = authHelpers;
    this.stores = stores;
    this.language = languageStore;
  }

  toggleMobileMenu() {
    this.stores.isMobileMenuOpen.update(value => !value);
  }

  async handleLogin() {
    try {
      await this.authHelpers.signInWithMitId();
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async handleLogout() {
    try {
      await this.authHelpers.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async setLanguage(lang) {
    this.language.set(lang);
    if (this.pb.authStore.record?.id) {
      try {
        await this.pb.collection('users').update(this.pb.authStore.record.id, {
          preferred_language: lang
        });
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
  }
}