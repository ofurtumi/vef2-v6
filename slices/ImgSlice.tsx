import { Slice } from '../types';
import styles from '../styles/Page.module.css';
import { asText } from '@prismicio/helpers';
import Image from 'next/image';

export default function Img({ data }: { data: Slice }) {
	const left = { gridColumn: 1, gridRow: 1 };
	const right = { gridColumn: 2, gridRow: 1 };
	return (
		<div className={styles.imgSliceHolder}>
			<div>
				<img
					style={data.primary.position ? right : left}
					src={data.primary.img?.url ?? ''}
					alt={asText(data.primary.imgtxt) ?? 'enginn texti'}
				/>
			</div>
			<p style={data.primary.position ? left : right}>
				{asText(data.primary.imgtxt)}
			</p>
		</div>
	);
}
