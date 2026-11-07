import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import { attachWebSocket } from './src/lib/server/ws-room.ts';

const webSocketDev: Plugin = {
	name: 'websocket-dev',
	configureServer(server: ViteDevServer) {
		if (server.httpServer) attachWebSocket(server.httpServer);
	}
};

export default defineConfig({
	plugins: [
		webSocketDev,
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	]
});
