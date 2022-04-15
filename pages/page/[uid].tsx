import { PrismicRichText } from '@prismicio/react';
import { asText } from '@prismicio/richtext';
import { fetchFromPrismic } from '../../api/prismic';
import styles from '../../styles/Page.module.css';
import Header from '../header';
import { Data, Page, Slice } from '../../types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AccordionSlice from '../../slices/AccordionSlice';
import ImgSlice from '../../slices/ImgSlice';
import TextSlice from '../../slices/TextSlice';
import AuthorSlice from '../../slices/AuthorSlice';

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
					return <AccordionSlice data={parent} key={i} />;
				} else if (parent.type === 'image') {
					return <ImgSlice data={parent} key={i} />;
				} else if (parent.type === 'txt') {
					return <TextSlice data={parent} key={i} />;
				} else if (parent.type === 'author') {
					return <AuthorSlice data={parent} key={i} time={cDate} />;
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
		props: { page, fallback: false },
	};
}
