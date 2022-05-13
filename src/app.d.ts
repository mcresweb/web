/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {}

	// interface Platform {}

	interface Session {
		/** 网站标题 */
		title: string;
	}

	// interface Stuff {}
}
