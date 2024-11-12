<script>
  import { slide, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { 
    Menu, 
    Globe, 
    User,
    LogOut,
    Settings,
    ChevronDown,
    Bell
  } from 'lucide-svelte';
  import { pb, currentUser, authHelpers } from '$lib/pocketbase';
  import { language, languages, t } from '$lib/translations/translations';
  import { createNavStore } from '../stores/navStore';
  import { NavLogic } from '../utils/navLogic';
  
  const stores = createNavStore();
  const navLogic = new NavLogic(pb, authHelpers, stores, language);
  const { isMobileMenuOpen } = stores;
  
  // let notificationCount = 3;
</script>

<nav class="sticky top-0 z-50 bg-base-200 border-b border-base-300 backdrop-blur-lg bg-opacity-90">
  <div class="mx-auto px-4">
    <div class="flex justify-between h-16">
      <!-- Left side -->
      <div class="flex items-center gap-4">
        <a href="/" class="flex items-center gap-2 transition-transform hover:scale-105">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-primary-content font-bold">AI</span>
          </div>
          <span class="text-xl font-bold hidden sm:block">{$t('nav.title')}</span>
        </a>
      </div>

      <!-- Right side - Desktop -->
      <div class="hidden md:flex items-center gap-4">
        <!-- Language Switcher -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm gap-2">
            <Globe class="w-4 h-4" />
            <span>{languages.find(l => l.code === $language)?.name}</span>
            <ChevronDown class="w-4 h-4" />
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2">
            {#each languages as lang}
              <li>
                <button 
                  class="flex items-center gap-2 {$language === lang.code ? 'bg-primary/10 text-primary' : ''}"
                  on:click={() => navLogic.setLanguage(lang.code)}
                >
                  {#if $language === lang.code}
                    <div class="w-2 h-2 rounded-full bg-primary"/>
                  {/if}
                  {lang.name}
                </button>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Notifications -->
        <!-- <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <Bell class="w-5 h-5" />
              {#if notificationCount > 0}
                <span class="badge badge-sm badge-primary indicator-item">
                  {notificationCount}
                </span>
              {/if}
            </div>
          </label>
        </div> -->

        <!-- User Menu -->
        {#if $currentUser}
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost gap-2">
              <div class="avatar">
                <div class="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {#if pb.authStore.record}
                    <img 
                      src={pb.files.getURL($currentUser, $currentUser.avatar)} 
                      alt={$t('nav.avatarAlt')}
                    />
                  {:else}
                    <img src="/api/placeholder/32/32" alt={$t('nav.defaultAvatarAlt')} />
                  {/if}
                </div>
              </div>
              <span class="hidden sm:inline-block">{$currentUser.name || 'User'}</span>
              <ChevronDown class="w-4 h-4" />
            </label>
            <ul tabindex="0" 
                class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2"
                transition:slide={{duration: 200, easing: quintOut}}
            >
              <li>
                <a href="profile" class="flex items-center gap-2">
                  <User class="w-4 h-4" />
                  {$t('nav.profile')}
                </a>
              </li>
              <!-- <li>
                <a href="settings" class="flex items-center gap-2">
                  <Settings class="w-4 h-4" />
                  {$t('nav.settings')}
                </a>
              </li> -->
              <div class="divider my-1"></div>
              <li>
                <button 
                  class="text-error flex items-center gap-2"
                  on:click={() => navLogic.handleLogout()}
                >
                  <LogOut class="w-4 h-4" />
                  {$t('nav.logout')}
                </button>
              </li>
            </ul>
          </div>
        {:else}
          <button 
            class="btn btn-primary btn-sm"
            on:click={() => navLogic.handleLogin()}
          >
            {$t('nav.signin')}
          </button>
        {/if}
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden flex items-center">
        <button 
          class="btn btn-ghost btn-circle"
          on:click={() => navLogic.toggleMobileMenu()}
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if $isMobileMenuOpen}
    <div 
      transition:slide={{duration: 200, easing: quintOut}}
      class="md:hidden border-t border-base-300"
    >
      <div class="p-4 space-y-4">
        {#if $currentUser}
          <div class="flex items-center gap-3 p-2 rounded-lg bg-base-300/50">
            <div class="avatar">
              <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {#if pb.authStore.record}
                  <img 
                    src={pb.files.getURL($currentUser, $currentUser.avatar)} 
                    alt={$t('nav.avatarAlt')} 
                  />
                {:else}
                  <img src="/api/placeholder/40/40" alt={$t('nav.defaultAvatarAlt')} />
                {/if}
              </div>
            </div>
            <div>
              <div class="font-medium">{$currentUser.name || 'User'}</div>
              <div class="text-sm text-base-content/70">{$currentUser.email}</div>
            </div>
          </div>

          <div class="space-y-2">
            <a 
              href="profile" 
              class="flex items-center gap-2 p-2 hover:bg-base-300 rounded-lg transition-colors"
            >
              <User class="w-5 h-5" />
              {$t('nav.profile')}
            </a>
            <!-- <a 
              href="settings" 
              class="flex items-center gap-2 p-2 hover:bg-base-300 rounded-lg transition-colors"
            >
              <Settings class="w-5 h-5" />
              {$t('nav.settings')}
            </a> -->
            <button 
              class="w-full flex items-center gap-2 p-2 hover:bg-base-300 rounded-lg transition-colors text-error"
              on:click={() => navLogic.handleLogout()}
            >
              <LogOut class="w-5 h-5" />
              {$t('nav.logout')}
            </button>
          </div>
        {:else}
          <button 
            class="btn btn-primary w-full"
            on:click={() => navLogic.handleLogin()}
          >
            {$t('nav.signin')}
          </button>
        {/if}

        <div class="divider"></div>

        <!-- Mobile Language Switcher -->
        <div class="space-y-2">
          <label class="text-sm font-medium">{$t('nav.language')}</label>
          <select 
            class="select select-bordered w-full"
            value={$language}
            on:change={(e) => navLogic.setLanguage(e.target.value)}
          >
            {#each languages as lang}
              <option value={lang.code}>{lang.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  {/if}
</nav>