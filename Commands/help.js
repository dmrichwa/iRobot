const { find_command, invalid_usage, command_info } = require("../Utils/");

exports.run = async (client, msg, args) => {
	const command = find_command(args[1]);
	if (!command) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	msg.channel.send({ embed: command_info(command) });
};

exports.config = {
	delete: false,
	hidden: false,
}

exports.help = {
	name: "help",
	aliases: ["cmdinfo"],
	category: "Info",
	description: "Prints out information about a command",
	usage: "help (command)"
};