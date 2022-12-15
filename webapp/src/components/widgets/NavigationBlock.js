import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSettingBar, hideSideBar } from './SettingBar';

function navigate(path) {
	return (() => {
		hideSideBar();
		window.location.href = `#/${(path === 'home') ? '' : path}`;
		window.scrollTo(0, 0);
		selectNavi(path);
	}
	);
}

export function selectNavi(path) {
	const navi_items = document.getElementsByClassName('title-center');
	const menu_items = document.getElementsByClassName('menu-item');
	const menu_btn = document.getElementById('menu');
	const menu_block = document.getElementById('menu-block');

	for (const navi_item of navi_items) {
		if (navi_item?.id && (navi_item.id === `navi-${path}`)) {
			navi_item.classList?.add('title-selected');
		}
		else {
			navi_item?.classList?.remove('title-selected');
		}
	}
	for (const menu_item of menu_items) {
		if (menu_item?.id && (menu_item.id === `menu-${path}`)) {
			menu_item.classList?.add('menu-item-selected');
		}
		else {
			menu_item?.classList?.remove('menu-item-selected');
		}
	}
	menu_btn?.classList?.remove('menu-btn-selected');
	menu_block.style.display = '';
}

function Menu() {
	const { t, i18n } = useTranslation();
	return (
		<div className="menu-bar" id="menu-block">
			<div onClick={navigate("home")} className="menu-item" id="menu-home">
				{t('Home')}
			</div>
			<div onClick={navigate("profile")} className="menu-item" id="menu-profile">
				{t('Info')}
			</div>
			<div onClick={navigate("project")} className="menu-item" id="menu-project">
				{t('Repos')}
			</div>
			<div onClick={navigate("game")} className="menu-item" id="menu-game">
				{t('Game')}
			</div>
		</div>
	);
}

export function NavigationBlock({setTheme, languages, defaultLang}) {
	const { t, i18n } = useTranslation();
	// const logo = require("../../assets/favicon.png");
	return (
		<div className="wrapper nav-block">
			<div className="left-container">
				{/*<div id="head-logo">
					<img src={logo} className="logo" alt="logo" />
				</div>
				<div
					className="title-left menu-btn" 
					onClick={() => {
						const menu_block = document.getElementById('menu-block');
						if (menu_block.style.display) {
							menu_block.style.display = '';
						}
						else {
							menu_block.style.display = 'block';
						}
						document.getElementById('menu').classList.toggle('menu-btn-selected');
					}}
					id="menu"
				>
					<span></span>
				</div>
				<Menu />*/}
			</div>
			<div className="guide-container">
				<h1 id="title">
					{/*{t("tt")}*/}
				</h1>
				{/*<div className="title-center" onClick={navigate("game")} id="navi-game">
					{t('Game')}
				</div>*/}
			</div>
			<div className="right-action-container">
				<div className="title-right" onClick={() => createSettingBar(setTheme, t, i18n, languages, defaultLang)} id="title-right-setting">
				</div>
			</div>
		</div>
	);
}
