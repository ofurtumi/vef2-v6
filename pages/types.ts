export type PrismicRichText = any;

export type PrismicImage = {
	dimensions: {
		width: Number;
		height: Number;
	};
	copyright: any;
	alt: string;
	url: string;
};

export type Author = {
	_meta: {
		uid: string;
	};
	name: PrismicRichText;
	title: PrismicRichText;
	image: PrismicImage;
	description: PrismicRichText;
};

export type Slice = {
	type: string;
	primary: {
		text?: PrismicRichText;
		position?: boolean;
		img?: PrismicImage;
		imgtxt?: PrismicRichText;
		accordiontitle?: PrismicRichText;
	};
	fields: Array<{
		heading: PrismicRichText;
		content: PrismicRichText;
	}>;
};

export type SliceBody = Array<Slice>;

export type Page = {
	_meta: {
		uid: String;
	};
	title: PrismicRichText;
	textContent: PrismicRichText;
	image: PrismicImage;
	authorGroup: Array<{ author: Author }>;
	body?: SliceBody;
};

export type HomePage = {
	title: PrismicRichText;
	content: PrismicRichText;
};

export type Data = {
	page?: Page;
	allPages?: AllPages;
	homepage?: HomePage;
};

export type node = {
	_meta: {
		uid: string;
	};
	title: PrismicRichText;
	content?: string;
};

export type Edges = Array<{ node: node }>;

export type AllPages = {
	edges: Edges;
};

export type Pages = {
	homepage: HomePage;
	allPages: AllPages;
};
