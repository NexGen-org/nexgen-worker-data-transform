export interface Env {
	SITE_KV: KVNamespace;
}

interface Page {
	id: string;
	title: string;
	content: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/favicon.ico') {
			return new Response(null, { status: 204 });
		}

		const pathParts = url.pathname.split('/').filter(Boolean);

		if (pathParts.length < 2) {
			return new Response('Bad Request: Missing domain or page ID', { status: 400 });
		}

		const domain = pathParts[0]; // "example.com"
		const id = pathParts[1]; // "page-101"
		console.log('typeof env.SITE_KV:', typeof env.SITE_KV);
		console.log(`page:${domain}:${id}`);
		const page = (await env.SITE_KV.get(`page:${domain}:${id}`, { type: 'json' })) as Page | null;

		if (!page) {
			return new Response('Page not found', { status: 404 });
		}

		const markdown = `# ${page.title}\n\n${page.content}`;

		return new Response(JSON.stringify({ id: page.id, markdown }), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
