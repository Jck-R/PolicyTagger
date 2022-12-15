import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

export const languages = ['en'];
export const defaultLang = 'en';

i18n
	.use(LanguageDetector)
	.use(resourcesToBackend((language, namespace, callback) => {
		const trueLanguage = language.split("-")[0];
		if (languages.includes(trueLanguage)) {
			import(`./${trueLanguage}.json`)
				.then((resources) => {
					callback(null, resources);
				})
				.catch((error) => {
					callback(error, null);
				})
		}
		else if (trueLanguage === "dev") {
			callback(null, null);
		}
		else {
			console.log(`${trueLanguage} not supported, use ${defaultLang} instead.`);
			import(`./${defaultLang}.json`)
				.then((resources) => {
					callback(null, resources);
				})
				.catch((error) => {
					console.log(error);
					callback(error, null);
				})
		}
	}))
	.use(initReactI18next)
	.init({
		debug: false,

		keySeparator: false,

		interpolation: {
			escapeValue: false
		},
		react: {
			useSuspense: false
		}
	});

export default i18n;