<script>
	import '../app.css'
	import { fade } from 'svelte/transition';
	import { sineOut } from 'svelte/easing';
	import Navbar from '$lib/components/Navbar.svelte';
  </script>
  
<div transition:fade={{duration: 300, easing: sineOut}} class="h-dvh w-dvw flex flex-col">
<Navbar />
<slot />
</div>