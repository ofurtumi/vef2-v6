import Link from 'next/link';

import style from '../styles/FourOFour.module.css';

export default function Custom404() {
	return (
		<>
			<div className={style.divStyle}>
				<h1 className={style.h1Style}>404 - Engin síða hérna</h1>
				<Link href="/" passHref>
					<h2 className={style.h2Style}>Aftur til baka</h2>
				</Link>
			</div>
		</>
	);
}
