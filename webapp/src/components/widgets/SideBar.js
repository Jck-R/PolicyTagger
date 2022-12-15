import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { scrollWith } from '../control/scroll';


function SideNavi(name) {
	const { t, i18n } = useTranslation();
	return (
		<li key={name}>
			<a
				href={`#${name}`}
				id={`side-navi-${name}`}
			>
				<span>
					{t(name)}
				</span>
			</a>
		</li>
	);
}

function ToolBar() {
	const { t, i18n } = useTranslation();
	return (
		<>
			<h3>{t("Tools")}</h3>
			<ul>
				<li>
					<span
						onClick={() => {
							const folders = document.getElementsByClassName('fold-block');
							for (const folder of folders) {
								folder.style.display = 'block';
							}
						}}
						className="no-href-a"
					>
						{t("Expand")}
					</span>
				</li>
				<li>
					<span
						onClick={() => {
							const folders = document.getElementsByClassName('fold-block');
							for (const folder of folders) {
								folder.style.display = '';
							}
						}}
						className="no-href-a"
					>
						{t("Fold")}
					</span>
				</li>
			</ul>
		</>
	);
}

function foldSideBar() {
	const side_content = document.getElementById('side-content');
	if (side_content.style.display !== 'none') {
		side_content.style.display = 'none';
	}
	else {
		side_content.style.display = 'block';
	}
	document.getElementById('fold-png').classList.toggle('reverse-z');
	document.getElementById('sidebar').classList.toggle('small-aside');
}

function SideBar({sections, tool = false}) {
	const { t, i18n } = useTranslation();
	const fold = require("../../assets/fold.png");
	const screen_width = window.innerWidth;
	const mobile_view = (screen_width < 425);
	let navis = [];
	for (let i = 0; i < sections.length; i ++) {
		navis.push(SideNavi(sections[i]));
	}
	useEffect(() => {
		if (mobile_view) {
			foldSideBar();
			document.getElementById('sidebar').classList.add('right-aside');
		}
		scrollWith(sections);
	}, []);
	return (
		<aside className="sidebar float" id="sidebar">
			{mobile_view &&
				<div onClick={() => foldSideBar()}>
					<div>
						<img src={fold} id="fold-png" className="fold-png" alt="" />
					</div>
				</div>
			}
			<div id="side-content" style={{display: 'block'}}>
				<h3>
						<span lang="en">{t("Contents")}</span>
				</h3>
				<ul>
						{navis}
				</ul>
				{tool && <ToolBar />}
			</div>
		</aside>
	);
}

export default SideBar;