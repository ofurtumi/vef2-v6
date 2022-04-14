import { PrismicRichText } from '@prismicio/react';
import { asText } from '@prismicio/richtext';
import Link from 'next/link';
import { fetchFromPrismic } from '../../api/prismic';
import styles from '../../styles/Page.module.css';
import Header from '../header';
import { Author, Data, Page, Slice } from '../types';

type Props = {
	page: Page;
};

export default function Home({ page }: Props) {
	return (
		<>
			<Header title={page ? asText(page.title) : '404'} />
			<div className={styles.main}>
				<PrismicRichText field={page.title} />
				<div className={styles.pageContent}>
					<div className={styles.homeCell}>
						{page.image ? (
							<img src={page.image.url} alt={page.image.alt} />
						) : (
							''
						)}
						<div>
							<PrismicRichText field={page.textContent} />
						</div>
					</div>
					{page.body ? <Slices data={page.body} /> : null}
				</div>
				{page.authorGroup ? (
					<Authors authors={page.authorGroup} />
				) : null}
			</div>
		</>
	);
}

function Slices({ data }: { data: Array<Slice> }) {
	return (
		<div className={styles.accordionPrison}>
			{data.map((parent, i) => {
				console.log('parent --> ', parent);
				if (parent.type === 'accordion') {
					return (
						<details className={styles.accordion} key={i}>
							<summary className={styles.accordionTitle}>
								{asText(parent.primary.accordiontitle)}
							</summary>
							{parent.fields.map((inner, j) => {
								return (
									<div
										key={j}
										className={styles.accordionInner}
									>
										<PrismicRichText
											field={inner.heading}
										/>
										<PrismicRichText
											field={inner.content}
										/>
									</div>
								);
							})}
						</details>
					);
				} else if (parent.type === 'image') {
					const left = { gridColumn: 1, gridRow: 1 };
					const right = { gridColumn: 2, gridRow: 1 };
					return (
						<div className={styles.imgSliceHolder}>
							<img
								style={parent.primary.position ? right : left}
								src={parent.primary.img?.url}
								alt={asText(parent.primary.imgtxt)}
							/>
							<p style={parent.primary.position ? left : right}>
								{asText(parent.primary.imgtxt)}
							</p>
						</div>
					);
				} else if (parent.type === 'txt') {
					return (
						<div className={styles.txtSliceHolder}>
							<PrismicRichText field={parent.primary.text} />
						</div>
					)
				}
			})}
		</div>
	);
}

function Authors({ authors }: { authors: Array<{ author: Author }> }) {
	return (
		<div className={styles.authorPrison}>
			{authors.map((au, i) => {
				const name = asText(au.author.name);
				const title = asText(au.author.title);
				const desc = au.author.description;
				const imgUrl = au.author.image.url;
				const imgAlt = au.author.image.alt;
				return (
					<Link key={i} href={au.author._meta.uid}>
						<div className={styles.authorCell}>
							<h2>
								{name}
								<span>{title}</span>
							</h2>
							<div>
								<PrismicRichText field={desc} />
								<img src={imgUrl} alt={imgAlt} />
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}

const query = `
fragment page on Page {
  _meta {
    uid
  }
  title
  textContent
  image
  authorGroup {
    author {
      ... on Author {
		_meta {
			uid
		}
        name
        title
        image
        description
      }
    }
  }
  body {
    ... on PageBodyImage {
      type
      primary {
        position
        img
        imgtxt
      }
    }
    ... on PageBodyAccordion {
      type
      primary {
        accordiontitle
      }
      fields {
        heading
        content
	  }
	}
	... on PageBodyTxt {
	  type
	  primary {text}
	}
  }
}

query ($uid: String = "") {
  page(uid: $uid, lang: "is") {
    ...page
  }
}`;

export async function getServerSideProps({ params }: { params: any }) {
	const { uid } = params;

	let data = null;
	if (typeof uid === 'string')
		data = await fetchFromPrismic<Data>(query, { uid: uid });

	if (!data) {
		return {
			notFound: true,
			props: {},
		};
	}

	const page = data.page;

	return {
		props: { page },
	};
}
