<script>
    import { slide } from 'svelte/transition';
    import { sineOut } from 'svelte/easing';
    import { pb, currentUser, authHelpers } from '$lib/pocketbase';
  
    // Language options
    export let languages = [
      { code: 'en', name: 'English' },
      { code: 'dk', name: 'Danish' },
    ];
    export let currentLanguage = languages[0];
  
    // Mobile menu state
    let isMobileMenuOpen = false;
  
    function toggleMobileMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;
    }
  
    async function handleLogin() {
      try {
        await authHelpers.signInWithMitId();
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  
    async function handleLogout() {
      try {
        await authHelpers.logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
</script>
  
<nav class="bg-base-200 border-b border-base-300">
  <div class="mx-auto px-4">
    <div class="flex justify-between h-16">
      <!-- Left side -->
      <div class="flex items-center">
        <span class="text-xl font-bold">Health Assistant</span>
      </div>

      <!-- Right side - Nav Items (Desktop) -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Language Switcher -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost">
            {currentLanguage.name}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {#each languages as language}
              <li>
                <button 
                  class="w-full text-left {currentLanguage.code === language.code ? 'bg-base-200' : ''}"
                  on:click={() => currentLanguage = language}
                >
                  {language.name}
                </button>
              </li>
            {/each}
          </ul>
        </div>

        <!-- User Menu -->
        {#if $currentUser}
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-8 rounded-full">
                {#if $currentUser.avatar}
                  <img src={pb.files.getURL($currentUser, $currentUser.avatar)} alt="user avatar" />
                {:else}
                  <!-- <img src="/api/placeholder/32/32" alt="default avatar" /> -->
                {/if}
              </div>
            </label>
            <ul tabindex="0" class="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li><a href="profile">{$currentUser.name || 'Profile'}</a></li>
              <li><button on:click={handleLogout}>Log out</button></li>
            </ul>
          </div>
        {:else}
          <button class="btn btn-primary" on:click={handleLogin}>Sign In with MitID</button>
        {/if}
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden flex items-center">
        <button 
          class="btn btn-ghost btn-circle"
          on:click={toggleMobileMenu}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if isMobileMenuOpen}
    <div 
      transition:slide={{duration: 200, easing: sineOut}}
      class="md:hidden border-t border-base-300"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        {#if $currentUser}
          <a href="profile" class="block px-3 py-2 rounded-md hover:bg-base-300">
            {$currentUser.name || 'Profile'}
          </a>
          <button 
            class="w-full text-left px-3 py-2 rounded-md hover:bg-base-300"
            on:click={handleLogout}
          >
            Log out
          </button>
        {:else}
          <button 
            class="w-full px-3 py-2 btn btn-primary"
            on:click={handleLogin}
          >
            Sign In with MitID
          </button>
        {/if}

        <!-- Mobile Language Switcher -->
        <div class="px-3 py-2">
          <select 
            class="select select-bordered w-full"
            bind:value={currentLanguage}
          >
            {#each languages as language}
              <option value={language}>{language.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  {/if}
</nav>