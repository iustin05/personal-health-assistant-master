import { writable } from 'svelte/store';

export const createProfileStore = () => ({
  loading: writable(true),
  isSaving: writable(false),
  saveSuccess: writable(false),
  errorMessage: writable(''),
  profile: writable({
    name: '',
    medications: '',
    allergies: '',
    medical_conditions: '',
    avatar: ''
  })
});