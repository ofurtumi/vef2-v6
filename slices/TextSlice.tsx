import { PrismicRichText } from '@prismicio/react';
import { Slice } from '../types';
import styles from '../styles/Page.module.css';

export default function Text({ data }: { data: Slice }) {
	return (
		<div className={styles.txtSliceHolder}>
			<PrismicRichText field={data.primary.text} />
		</div>
	);
}
