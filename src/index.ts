import { Env, PageContext, Page } from './types';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/favicon.ico') {
			return new Response(null, { status: 204 });
		}

		const pathParts = url.pathname.slice(1).split('/');
		if (pathParts.length !== 2) {
			return new Response('Invalid path format', { status: 400 });
		}

		const domain = pathParts[0]; // "example.com"
		const id = pathParts[1]; // "page-101"
		const pageKey = `page:${domain}:${id}`;
		const page = (await env.SITE_KV.get(pageKey, { type: 'json' })) as Page;

		console.log(page);
		if (!page) {
			return new Response('Page not found', { status: 404 });
		}

		const result: PageContext = {
			domain,
			page: {
				id: page.id,
				title: page.title,
				content: page.content,
				parent_id: page.parent_id,
				children: page.children || [],
				created_at: page.created_at,
			},
			metadata: {
				source: 'kv',
				retrieved_at: new Date().toISOString(),
				version: 'v1',
			},
		};

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
