import { PrismicRichText } from '@prismicio/react';
import { asText } from '@prismicio/richtext';
import Link from 'next/link';
import { fetchFromPrismic } from '../../api/prismic';
import styles from '../../styles/Page.module.css';
import Header from '../header';
import { Author, Data, Page, Slice } from '../../types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Props = {
	page: Page;
};

export default function Home({ page }: Props) {
	const router = useRouter();
	useEffect(() => {
		if (!page) router.push('/');
	});
	if (page) {
		return (
			<>
				<Header title={asText(page.title)} />
				<div className={styles.main}>
					<PrismicRichText field={page.title} />
					<div className={styles.pageContent}>
						{page.body ? (
							<Slices
								data={page.body}
								cDate={page._meta.lastPublicationDate}
							/>
						) : null}
					</div>
				</div>
			</>
		);
	} else {
		return (
			<div
				style={{
					height: '100vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<h1 style={{ fontSize: '3em' }}>
					Þessi síða er ekki til, sendi þig heim
				</h1>
			</div>
		);
	}
}

function Slices({ data, cDate = '' }: { data: Array<Slice>; cDate: string }) {
	return (
		<div>
			{data.map((parent, i) => {
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
						<div className={styles.imgSliceHolder} key={i}>
							<div>
								<img
									style={
										parent.primary.position ? right : left
									}
									src={parent.primary.img?.url}
									alt={asText(parent.primary.imgtxt)}
								/>
							</div>
							<p style={parent.primary.position ? left : right}>
								{asText(parent.primary.imgtxt)}
							</p>
						</div>
					);
				} else if (parent.type === 'txt') {
					return (
						<div className={styles.txtSliceHolder} key={i}>
							<PrismicRichText field={parent.primary.text} />
						</div>
					);
				} else if (parent.type === 'author') {
					const name = parent.primary.name;
					const title = parent.primary.role;
					const desc = parent.primary.description;
					const img = parent.primary.img;
					let date = new Date(Date.parse(cDate));
					const outDate =
						'' +
						date.getDate() +
						'/' +
						(date.getMonth() + 1) +
						'/' +
						date.getFullYear();
					return (
						<div className={styles.authorPrison}>
							<div className={styles.authorMeta}>
								<h4>Höfundur</h4>
								<p>síðast uppfært {outDate}</p>
							</div>
							<div className={styles.authorCell} key={i}>
								<div className={styles.authorContent}>
									<div>
										<PrismicRichText field={name} />
										<PrismicRichText field={title} />
									</div>
									<PrismicRichText field={desc} />
								</div>
								<div className={styles.authorImg}>
									<img src={img?.url} alt={img?.alt} />
								</div>
							</div>
						</div>
					);
				}
			})}
		</div>
	);
}

const query = `
fragment page on Page {
  _meta {
    uid,
	lastPublicationDate
  }
  title
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
	... on PageBodyAuthor {
		type,
		primary {
			name,
			role,
			description,
			img,
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
