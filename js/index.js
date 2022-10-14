const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const readline = require("readline");

const getUrls = () => {
	const reader = readline.createInterface({
		input: fs.createReadStream("report.csv")
	});
	const urls = [];
	reader.on("line", (line) => {
		const items = line.split("\t");
		if (!(items.length === 1 && items[0] === "\x00")) {
			urls.push({
				id: items[0],
				url: items[2]
			});
		}
	});
	reader.on("close", () => {
		fs.writeFileSync("urls.json", JSON.stringify(urls));
	});
}

const fetchHtmlFromUrl = async (url, options) => {
	try {
		const response = await axios.get(url, options);
		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(response.status);
		}
	} catch (err) {
		console.error(`Error fetching ${url}`);
		console.error(err);
		return null;
	}
}

const fetchHtml = () => {
	// const urls = JSON.parse(fs.readFileSync("urls.json"));
	const urls = [
		{
			id: 6782596,
			url: "https://michmed-administration.policystat.com/policy/6782596/"
		},
		{
			id: 7265299,
			url: "https://michmed-administration.policystat.com/policy/7265299/"
		},
		{
			id: 11920501,
			url: "https://michmed-administration.policystat.com/policy/11920501/"
		},
	];
	const cookies = JSON.parse(fs.readFileSync("cookies.json"));
	let cookieHeader = "";
	for (const key in cookies) {
		cookieHeader += `${key}=${cookies[key]};`;
	}
	const options = {
		params: {
			// 
		},
		headers: {
			Cookie: cookieHeader
		},
		withCredentials: true
	};
	if (!fs.existsSync("html")){
		fs.mkdirSync("html");
	}
	let count = 0;
	const total = urls.length;
	process.stdout.write(`${count}/${total}`);
	urls.forEach(url => {
		let srcUrl = url.url;
		if (srcUrl.match(/public/)) {
			srcUrl = srcUrl.replace("public", "clinical");
		}
		fetchHtmlFromUrl(srcUrl, options)
			.then((data) => {
				process.stdout.write(`\r${++count}/${total}`);
				if (data) {
					fs.writeFile(
						path.resolve("html", `${url.id}.html`),
						data,
						(err) => {
							if (err) {
								console.error(err);
							}
						}
					);
				}
			})
		;
	})
}

const getMainContent = () => {
	const filePaths = fs.readdirSync("html");
	const result = [];
	let count = 0;
	const total = filePaths.length;
	process.stdout.write(`${count}/${total}`);
	filePaths.forEach(filePath => {
		fs.readFile(path.resolve("html", filePath), (err, file) => {
			process.stdout.write(`\r${++count}/${total}`);
			const dom = new JSDOM(file.toString());
			const document = dom.window.document;
			const id = filePath.replace(/\.html$/, "");
			const text = document.querySelector("tbody")
				.children[3].textContent
				.replaceAll("\n", " ")
				.replaceAll(/[^\x00-\x7F]+/g, "")
				.replaceAll(/\s{2,}/g, " ")
			;
			const tsvString = `${id}\t${text}\n`;
			fs.appendFileSync("docs.tsv", tsvString);
		});
	});
}

// getUrls();
// fetchHtml();
// getMainContent();