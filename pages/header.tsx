import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Header.module.css';

const Header = ({ title }: { title: string }) => {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<header>
				<nav className={styles.navbar}>
					<Link href='/'>Heim</Link>
					<div>

					</div>
				</nav>
			</header>
		</>
	);
};

export default Header;
