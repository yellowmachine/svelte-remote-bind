import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';

//console.log("import.meta.env.VITE_AUTH0_DOMAIN:", import.meta.env.VITE_AUTH0_DOMAIN)

export default function(t){
  const _a = writable(null)
	let timeoutId;
	// onDestroy(() => clearTimeout(timeoutId));

  return {
		msg: _a,
		timeout: (msg) => {
			clearTimeout(timeoutId)
			_a.set(msg)
			timeoutId = setTimeout(() => _a.set(null), t);
		}
	}
}