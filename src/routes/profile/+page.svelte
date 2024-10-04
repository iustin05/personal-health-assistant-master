<script>
    import { fade } from 'svelte/transition';
    import { sineOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    import { pb, currentUser, userHelpers } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
  
    // Form state
    let isSaving = false;
    let saveSuccess = false;
    let errorMessage = '';
    let loading = true;

    // Profile state
    let userProfile = {
      name: '',
      medications: '',
      allergies: '',
      medical_conditions: '',
      avatar: ''
    };
  
    onMount(async () => {
        if (!$currentUser) {
            goto('/');
            return;
        }
    
        try {
            const profile = await userHelpers.getProfile();
            userProfile = {
            name: profile.name || '',
            medications: profile.medications || '',
            allergies: profile.allergies || '',
            medical_conditions: profile.medical_conditions || '',
            avatar: profile.avatar || ''
            };
        } catch (error) {
            console.error('Error loading profile:', error);
            errorMessage = 'Failed to load profile data';
        }

        loading = false;
    });
  
    async function handleSave() {
      isSaving = true;
      errorMessage = '';
  
      try {
        await userHelpers.updateProfile({
          name: userProfile.name,
          medications: userProfile.medications,
          allergies: userProfile.allergies,
          medical_conditions: userProfile.medical_conditions
        });
  
        saveSuccess = true;
        setTimeout(() => saveSuccess = false, 3000);
      } catch (error) {
        console.error('Error saving profile:', error);
        errorMessage = 'Failed to save profile changes';
      } finally {
        isSaving = false;
      }
    }
  
    async function handleAvatarChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;
  
      try {
        const formData = new FormData();
        formData.append('avatar', file);
  
        await userHelpers.updateProfile(formData);
        
        // Refresh user data
        const updatedProfile = await userHelpers.getProfile();
        userProfile.avatar = updatedProfile.avatar;
      } catch (error) {
        console.error('Error updating avatar:', error);
        errorMessage = 'Failed to update profile picture';
      }
    }
  </script>
  
  {#if !loading}
  <div transition:fade={{duration: 300, easing: sineOut}} class="h-dvh w-dvw flex flex-col">
    <!-- Navigation Bar -->
    <nav class="bg-base-200 border-b border-base-300">
      <div class="mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <!-- Back button -->
            <button 
              class="btn btn-ghost btn-circle"
              on:click={() => goto('/')}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="text-xl font-bold">Profile Settings</span>
          </div>
        </div>
      </div>
    </nav>
  
    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto bg-base-100 p-4">
      <div class="max-w-2xl mx-auto">
        <!-- Profile Header -->
        <div class="mb-8 text-center">
          <div class="avatar mb-4">
            <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {#if userProfile.avatar}
                <img 
                  src={pb.files.getURL($currentUser, userProfile.avatar)} 
                  alt="Profile" 
                />
              {:else}
                <img src="/api/placeholder/128/128" alt="Default Profile" />
              {/if}
            </div>
          </div>
          
          <!-- Avatar Upload -->
          <div class="mb-4">
            <input
              type="file"
              class="hidden"
              id="avatar-upload"
              accept="image/*"
              on:change={handleAvatarChange}
            />
            <label for="avatar-upload" class="btn btn-outline btn-sm">
              Change Profile Picture
            </label>
          </div>
  
          <input 
            type="text"
            class="input input-bordered text-center text-xl font-bold"
            placeholder="Your Name"
            bind:value={userProfile.name}
          />
        </div>
  
        <!-- Medical Information Form -->
        <div class="space-y-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Medications</span>
            </label>
            <textarea 
              bind:value={userProfile.medications}
              class="textarea textarea-bordered h-24"
              placeholder="List your current medications..."
            ></textarea>
          </div>
  
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Allergies</span>
            </label>
            <textarea 
              bind:value={userProfile.allergies}
              class="textarea textarea-bordered h-24"
              placeholder="List any allergies..."
            ></textarea>
          </div>
  
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Medical Conditions</span>
            </label>
            <textarea 
              bind:value={userProfile.medical_conditions}
              class="textarea textarea-bordered h-32"
              placeholder="Describe your medical conditions..."
            ></textarea>
          </div>
  
          <!-- Error Message -->
          {#if errorMessage}
            <div class="alert alert-error shadow-lg" transition:fade>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          {/if}
  
          <!-- Save Button -->
          <div class="flex justify-end space-x-4">
            <button 
              class="btn btn-primary {isSaving ? 'loading' : ''}"
              on:click={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
  
          <!-- Success Message -->
          {#if saveSuccess}
            <div class="alert alert-success shadow-lg" transition:fade>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your profile has been updated successfully!</span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  {/if}