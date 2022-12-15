import React, { useState, useEffect } from 'react';
import { languages, defaultLang } from './components/translation/i18n';
import { NavigationBlock } from './components/widgets/NavigationBlock';
import { Title } from './components/control/Title';
import { checkThemeMode, getTheme } from './components/control/dark';
import { MainScreen } from './components/Main';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	const [theme, setTheme] = useState(getTheme());
	useEffect(() => {
		checkThemeMode();
	}, [theme]);
	return (
		<>
			<Title />
			<header>
				<NavigationBlock setTheme={setTheme} languages={languages} defaultLang={defaultLang} />
			</header>
			<MainScreen />
			<img id="totop" alt="go to page top" onClick={() => {window.scrollTo(0, 0);}} />{/**/}
		</>
	);
}

export default App;