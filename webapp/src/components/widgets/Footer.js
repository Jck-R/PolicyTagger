function Footer() {
	const logo = require('../../assets/favicon.png');
	return (
		<footer>
			<div id="foot-logo">
				<img src={logo} className="logo" alt="logo" />
			</div>
			<span>
				&copy; 2022 Remisiki
			</span>
		</footer>
	);
}

export default Footer;