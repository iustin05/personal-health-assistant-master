<script>
    export let profileLogic;
    export let pb;
    export let currentUser;
    export let profile;
  
    function handleFileChange(event) {
      const file = event.target.files?.[0];
      if (file) {
        profileLogic.handleAvatarChange(file);
      }
    }
  </script>
  
  <div class="mb-8 text-center">
    <div class="avatar mb-4">
      <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        {#if profile.avatar}
          <img 
            src={pb.files.getURL(currentUser, profile.avatar)} 
            alt="Profile" 
          />
        {:else}
          <img src="/api/placeholder/128/128" alt="Default Profile" />
        {/if}
      </div>
    </div>
    
    <div class="mb-4">
      <input
        type="file"
        class="hidden"
        id="avatar-upload"
        accept="image/*"
        on:change={handleFileChange}
      />
      <label for="avatar-upload" class="btn btn-outline btn-sm">
        Change Profile Picture
      </label>
    </div>
  
    <input 
      type="text"
      class="input input-bordered text-center text-xl font-bold"
      placeholder="Your Name"
      bind:value={profile.name}
    />
  </div>