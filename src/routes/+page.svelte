<script>
    import { onDestroy, onMount } from 'svelte';
    import UserChat from '$lib/components/UserChat.svelte';
    import GuestChat from '$lib/components/GuestChat.svelte';
    import { currentUser } from '$lib/pocketbase';

    let isLoggedIn = false;
    onMount(() => {
        currentUser.subscribe((val) => {
            isLoggedIn = val !== null && val !== "";
        });
    });

</script>

{#if isLoggedIn}
    <UserChat />
{:else}
    <GuestChat />
{/if}