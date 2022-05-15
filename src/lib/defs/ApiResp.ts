import type { RequestHandlerOutput } from '@sveltejs/kit';

export type ApiRespBody<T> = { body: T };
export type ApiResp<T> = Promise<RequestHandlerOutput & ApiRespBody<T>>;
