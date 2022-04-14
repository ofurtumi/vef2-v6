import { asText } from '@prismicio/helpers';
import Link from 'next/link';
import { fetchFromPrismic } from '../api/prismic';
import styles from '../styles/Home.module.css';
import Header from './header';
import { PrismicRichText } from '@prismicio/react';

import { Pages, AllPages, Edges, HomePage } from './types';

type Props = {
	allPages: AllPages;
	homepage: HomePage;
};

function PageList({ pages }: { pages: Edges | undefined }) {
	return (
		<ul className={styles.pageNav}>
			{pages?.map((item, i) => {
				const title = asText(item.node.title);
				return (
					<li key={i}>
						<Link href={`/page/${item.node._meta.uid}`}>{title}</Link>
					</li>
				);
			})}
		</ul>
	);
}

export default function Home({ allPages, homepage }: Props) {
	return (
		<>
			<Header title="Forsíða" />
			<main className={styles.main}>
				<h1 className={styles.title}>{asText(homepage.title)}</h1>
				<div className={styles.content}>
					<PrismicRichText field={homepage.content} />
				</div>

				<PageList pages={allPages.edges}></PageList>
			</main>
		</>
	);
}

const query = `
{
homepage(uid:"home",lang:"is") {
	title,
	content,
}
allPages (sortBy: meta_firstPublicationDate_DESC){
	edges {
	node {
		_meta {
		uid
		}
		title
	}
	}
}
}`;

export async function getServerSideProps() {
	const pages = await fetchFromPrismic<Pages>(query);

	if (!pages) {
		return {
			notFound: true,
			props: {},
		};
	}

	const allPages = pages.allPages;
	const homepage = pages.homepage;

	return {
		props: { allPages, homepage },
	};
}
