import { Slice } from '../types';
import styles from '../styles/Page.module.css';
import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';

export default function Author({ data, time }: { data: Slice; time: string }) {
	const name = data.primary.name;
	const title = data.primary.role;
	const desc = data.primary.description;
	const img = data.primary.img;
	let date = new Date(Date.parse(time));
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
			<div className={styles.authorCell}>
				<div className={styles.authorContent}>
					<div>
						<PrismicRichText field={name} />
						<PrismicRichText field={title} />
					</div>
					<PrismicRichText field={desc} />
				</div>
				<div className={styles.authorImg}>
					<img src={img?.url ?? ''} alt={img?.alt} />
				</div>
			</div>
		</div>
	);
}
