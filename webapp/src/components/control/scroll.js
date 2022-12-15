import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollWith(sections) {
	naviChanger(sections);
	window.onscroll = function() {
		naviChanger(sections);
	}
}

function naviChanger(sections) {
	const y = document.documentElement.scrollTop;
	const h = document.documentElement.clientHeight;
	const top_btn = document.getElementById('totop');
	if (y > h) {
		top_btn.style.bottom = '1%';
	}
	else {
		top_btn.style.bottom = '-90px';
	}
	for (let i = 0; i < sections.length; i++) {
		const section = document.getElementById(sections[i]);
		const section_next = document.getElementById(sections[i + 1]);
		const section_navi = document.getElementById(`side-navi-${sections[i]}`);
		let prev_h = section?.offsetTop - 150;
		if (i === 0) {
			prev_h = 0;
		}
		let next_h = document.documentElement.scrollHeight;
		if (i !== sections.length - 1) {
			next_h = section_next?.offsetTop - 150;
		}
		if ((y >= prev_h) && (y < next_h)) {
			section_navi.style.borderColor = "#2083e0";
		}
		else {
			section_navi.style.borderColor = "#eee";
		}
	}
}

function ScrollHandler() {
	const { pathname, hash, key } = useLocation();
	useEffect(() => {
		if (hash === '') {
			window.scrollTo(0, 0);
		}
		else {
			setTimeout(() => {
				const id = hash.replace('#', '');
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView();
				}
			}, 0);
		}
	}, [pathname, hash, key]);
	return (<></>);
}

export { scrollWith, ScrollHandler };