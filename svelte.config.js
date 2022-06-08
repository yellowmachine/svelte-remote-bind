import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$src: resolve('./src'),
					$components: resolve('./src/components'),
					$lib: resolve('./src/lib')
				}
			}
		}
	}
};

export default config;
