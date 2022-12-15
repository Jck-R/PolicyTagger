import { useTranslation } from 'react-i18next';

function Title() {
	const { t, i18n } = useTranslation();
	document.title = t('t');
	return (<></>);
}

export { Title };