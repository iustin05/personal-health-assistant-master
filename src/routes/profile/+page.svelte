<script>
    import { fade } from 'svelte/transition';
    import { sineOut } from 'svelte/easing';
  
    // User profile state
    let userProfile = {
      name: "Jane Doe",
      medications: "",
      allergies: "",
      medicalHistory: "",
      avatar: "/api/placeholder/128/128"
    };
  
    // Form state
    let isSaving = false;
    let saveSuccess = false;
  
    async function handleSave() {
      isSaving = true;
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      isSaving = false;
      saveSuccess = true;
      setTimeout(() => saveSuccess = false, 3000);
    }
  </script>
  
  <div transition:fade={{duration: 300, easing: sineOut}} class="h-dvh w-dvw flex flex-col">
    <!-- Navigation Bar (reused from Chat.svelte) -->
    <nav class="bg-base-200 border-b border-base-300">
      <div class="mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
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
              <img src={userProfile.avatar} alt="Profile" />
            </div>
          </div>
          <h2 class="text-2xl font-bold mb-2">{userProfile.name}</h2>
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
              <span class="label-text font-medium">Medical History</span>
            </label>
            <textarea 
              bind:value={userProfile.medicalHistory}
              class="textarea textarea-bordered h-32"
              placeholder="Describe your medical history..."
            ></textarea>
          </div>
  
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