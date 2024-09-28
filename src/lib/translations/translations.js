import { writable, derived } from 'svelte/store';
import en from './en.json';
import da from './da.json';

// Available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'da', name: 'Danish' },
];

// Translation data
const translations = {
  en,
  da,
};

// Create the language store
export const language = writable(localStorage.getItem('language') || 'en');

// Subscribe to language changes and save to localStorage
language.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('language', value);
  }
});

// Create a derived store for the current translation strings
export const t = derived(language, ($language) => {
  const strings = translations[$language] || translations.en;
  
  // Return a function that handles nested keys (e.g., "nav.title")
  return (key) => {
    return key.split('.').reduce((obj, k) => obj?.[k], strings) || key;
  };
});