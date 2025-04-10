export interface Env {
	SITE_KV: KVNamespace;
}

export type ContentBlock = TextBlock | ImageBlock | ListBlock | ButtonBlock | ContainerBlock;

interface BaseBlock {
	id?: string;
	type: string;
	children?: ContentBlock[];
}

interface TextBlock extends BaseBlock {
	type: 'text' | 'heading' | 'paragraph';
	text: string;
	level?: number; // for heading
}

interface ImageBlock extends BaseBlock {
	type: 'image';
	src: string;
	alt?: string;
}

interface ListBlock extends BaseBlock {
	type: 'list';
	items: string[];
}

interface ButtonBlock extends BaseBlock {
	type: 'button';
	text: string;
	href: string;
}

interface ContainerBlock extends BaseBlock {
	type: 'div' | 'section' | 'article';
}
export interface Page {
	id: string;
	title: string;
	content: ContentBlock[];
	parent_id?: string | null;
	children?: Array<{
		id: string;
		title: string;
	}>;
	created_at: string;
}

export interface PageContext {
	domain: string;
	page: {
		id: string;
		title: string;
		content: ContentBlock[];
		parent_id?: string | null;
		children: Array<{
			id: string;
			title: string;
		}>;
		created_at: string;
	};
	metadata: {
		source: 'kv';
		retrieved_at: string; // ISO 8601 (例: 2025-03-30T22:35:00Z)
		version?: string;
	};
}
