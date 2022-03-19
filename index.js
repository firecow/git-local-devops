const fs = require("fs-extra");
const yaml = require("js-yaml");
const {doProject} = require("./project");
const assert = require("assert");

process.on("uncaughtException", (e) => {
	if (e instanceof assert.AssertionError) {
		console.log(`AssertionError: ${e.message}`);
	} else if (e.message.startsWith("Process exited")) {
		process.stderr.write(`${e.stderr}`);
	} else {
		throw e;
	}
});

(async () => {
	const scriptToRun = process.argv[2];
	assert(scriptToRun != null, "1st argument must be specified (script to run)");
	const domainToRun = process.argv[3];
	assert(domainToRun != null, "2nd argument must be specified (domain to run)");
	const home = process.env.HOME;
	assert(home != null, "Could not find home directory");
	const cwd = `${process.env.HOME}/git-local-devops`;

	const fileContent = await fs.readFile("example.yml", "utf8");
	const cnf = yaml.load(fileContent);

	for (const projectObj of cnf["projects"]) {
		await doProject(cwd, projectObj, scriptToRun, domainToRun);
	}

})();




