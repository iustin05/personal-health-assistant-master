<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { sineOut } from 'svelte/easing';
    import { pb, currentUser, userHelpers } from '$lib/pocketbase';
    import { createProfileStore } from '../stores/profileStore';
    import { ProfileLogic } from '../utils/profileLogic';
    import ProfileHeader from './ProfileHeader.svelte';
    import ProfileForm from './ProfileForm.svelte';
    import Alert from './Alert.svelte';
    import { t } from '$lib/translations/translations';
  
    const stores = createProfileStore();
    const profileLogic = new ProfileLogic(pb, userHelpers, stores);
    const { loading, profile, isSaving, saveSuccess, errorMessage } = stores;
  
    onMount(() => {
      profileLogic.initializeProfile($currentUser);
    });
  </script>
  
  {#if !$loading}
    <div transition:fade={{duration: 300, easing: sineOut}} class="h-dvh w-dvw flex flex-col">
      <!-- Navigation Bar -->
      <nav class="bg-base-200 border-b border-base-300">
        <div class="mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-4">
              <button 
                class="btn btn-ghost btn-circle"
                on:click={() => profileLogic.navigateBack()}
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="text-xl font-bold">{$t('profile.title')}</span>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto bg-base-100 p-4">
        <div class="max-w-2xl mx-auto">
          <ProfileHeader
            {profileLogic}
            {pb}
            currentUser={$currentUser}
            profile={$profile}
          />
  
          <ProfileForm
            {profileLogic}
            profile={$profile}
            isSaving={$isSaving}
          />
  
          {#if $errorMessage}
            <Alert type="error" message={$errorMessage} />
          {/if}
  
          {#if $saveSuccess}
            <Alert type="success" message="{$t('profile.successMessage')}" />
          {/if}
        </div>
      </div>
    </div>
  {/if}