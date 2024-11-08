import { get } from 'svelte/store';
import { goto } from '$app/navigation';

export class ProfileLogic {
  constructor(pb, userHelpers, stores) {
    this.pb = pb;
    this.userHelpers = userHelpers;
    this.stores = stores;
  }

  async initializeProfile(currentUser) {
    if (!currentUser) {
      goto('/');
      return;
    }

    try {
      const profile = await this.userHelpers.getProfile();
      this.stores.profile.set({
        name: profile.name || '',
        medications: profile.medications || '',
        allergies: profile.allergies || '',
        medical_conditions: profile.medical_conditions || '',
        avatar: profile.avatar || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      this.stores.errorMessage.set('Failed to load profile data');
    } finally {
      this.stores.loading.set(false);
    }
  }

  async handleSave() {
    this.stores.isSaving.set(true);
    this.stores.errorMessage.set('');

    try {
      const currentProfile = get(this.stores.profile);
      await this.userHelpers.updateProfile({
        name: currentProfile.name,
        medications: currentProfile.medications,
        allergies: currentProfile.allergies,
        medical_conditions: currentProfile.medical_conditions
      });

      this.stores.saveSuccess.set(true);
      setTimeout(() => this.stores.saveSuccess.set(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      this.stores.errorMessage.set('Failed to save profile changes');
    } finally {
      this.stores.isSaving.set(false);
    }
  }

  async handleAvatarChange(file) {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await this.userHelpers.updateProfile(formData);
      
      const updatedProfile = await this.userHelpers.getProfile();
      this.stores.profile.update(profile => ({
        ...profile,
        avatar: updatedProfile.avatar
      }));
    } catch (error) {
      console.error('Error updating avatar:', error);
      this.stores.errorMessage.set('Failed to update profile picture');
    }
  }

  navigateBack() {
    goto('/');
  }
}