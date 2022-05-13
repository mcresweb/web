import { initStart, finishWaiter } from '$helpers/initer';
// import { config } from '$lib/api/conf';
import { config } from '$defs/config';
import type { GetSession, Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	initStart();
	await finishWaiter;

	const response = await resolve(event);
	return response;
};

export const getSession: GetSession = async (): Promise<App.Session> => {
	return { title: config.title };
};
