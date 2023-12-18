const fs = require("fs");
const path = require("path");
const formatRepositoryUrl = (url) => {
	if (!url) return url;
	url = url.replace(/\/$/, "");
	url = url.replace(/\.git$/, "");
	url = url.replace(/^git:github\.com:/, "https://github.com/");
	url = url.replace(/^git:\/\//, "https://");
	return url;
};

const packageJSON = require(path.join(__dirname, "..", "package.json"));

const header = `NOTICES

This repository incorporates material as listed below or described in the code.
`;

const entries = Object.keys(packageJSON.dependencies).map((name, idx) => {
	console.log("===>>>");
	console.log(name);
	// url
	const manifestFile = require(
		path.join(__dirname, "..", "node_modules", name, "package.json"),
	);
	let url = manifestFile.repository?.url ?? manifestFile.repository;
	console.log(url, "\t", formatRepositoryUrl(url));
	url = formatRepositoryUrl(url);

	// license
	const packageRoot = path.join(__dirname, "..", "node_modules", name);
	const files = fs.readdirSync(packageRoot);
	const licenseFile = files.find((f) => f.match(/^license/i));
	const license = licenseFile
		? fs.readFileSync(path.join(packageRoot, licenseFile))
		: undefined;
	console.log("<<<===");
	return {
		name,
		url,
		license,
	};
});

const depsWithLicense = entries.filter(
	(e) => e.name !== undefined && e.license !== undefined,
);

const toc =
	depsWithLicense
		.map((dep, idx) => {
			return `${idx + 1}. ${dep.name} (${dep.url})`;
		})
		.join("\n") + "\n";

const licenses = depsWithLicense
	.map((dep) => {
		return `
${dep.name} NOTICES, INFORMATION, AND LICENSE BEGIN HERE
=========================================
${dep.license}
=========================================
END OF ${dep.name} NOTICES, INFORMATION, AND LICENSE
`;
	})
	.join("\n");

const content = [header, toc, licenses].join("\n");
fs.writeFileSync(path.join(__dirname, "..", "ThirdPartyNotices.txt"), content);
