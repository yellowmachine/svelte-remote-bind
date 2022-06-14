import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-auto';
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
		  postcss: true,
		}),
	],
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$src: path.resolve('./src'),
					$components: path.resolve('./src/components'),
					$lib: path.resolve('./src/lib')
				}
			}
		}
	}
};

export default config;
