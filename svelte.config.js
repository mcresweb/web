import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({ out: 'output' }),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE'],
		},
		vite: {
			resolve: {
				alias: {
					$components: path.resolve('./src/lib/components'),
					$database: path.resolve('./src/lib/database'),
					$defs: path.resolve('./src/lib/defs'),
					$helpers: path.resolve('./src/lib/helpers'),
					$lib: path.resolve('./src/lib'),
				},
			},
		},
	},
};

export default config;
