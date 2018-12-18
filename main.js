const { client } = require("./Objects.js");
const { find_category } = require("./Utils/util.js");
const { CATEGORIES } = require("./Utils/constants.js");

const readdir = require("util").promisify(require("fs").readdir);

client.commands = new Map();
client.aliases = new Map();

client.config = require("./config.js");
client.logger = require("./modules/logger");

client.loadCommand = (commandName) => {
	try {
		client.logger.log(`Loading Command: ${commandName}`);
		const props = require(`./Commands/${commandName}`);
		client.commands.set(props.help.name, props);
		props.help.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});

		var category = find_category(props.help.category);
		if (category) {
			CATEGORIES[category].cmds.push(props);
		}
		else {
			return `Cannot find category for command ${commandName}`;
		}
		return false;
	} catch (e) {
		return `Unable to load command ${commandName}: ${e}`;
	}
};

(async () => {
	const cmdFiles = await readdir("./Commands/");
	client.logger.log(`Loading ${cmdFiles.length} commands.`);
	cmdFiles.forEach(f => {
		if (!f.endsWith(".js")) {
			return;
		}
		const response = client.loadCommand(f);
		if (response) {
			console.log(response);
		}
	});
	
	const evtFiles = await readdir("./Events/");
	client.logger.log(`Loading ${evtFiles.length} events.`);
	evtFiles.forEach(file => {
		const eventName = file.split(".")[0];
		client.logger.log(`Loading Event: ${eventName}`);
		const event = require(`./Events/${file}`);
		client.on(eventName, event.bind(null, client));
	});
	
	client.login(client.config.token);
	client.options.fetchAllMembers = true;
})();