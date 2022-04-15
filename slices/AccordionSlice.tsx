import styles from '../styles/Page.module.css';
import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import { Slice } from '../types';

export default function AccordionSlice({ data }: { data: Slice }) {
	return (
		<details className={styles.accordion}>
			<summary className={styles.accordionTitle}>
				{asText(data.primary.accordiontitle)}
			</summary>
			{data.fields.map((inner, j) => {
				return (
					<div key={j} className={styles.accordionInner}>
						<PrismicRichText field={inner.heading} />
						<PrismicRichText field={inner.content} />
					</div>
				);
			})}
		</details>
	);
}
