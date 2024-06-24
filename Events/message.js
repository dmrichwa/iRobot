const { PREFIX } = require("../Utils/constants.js");
const { dateFormat, user_form } = require("../Utils/");

module.exports = async (client, msg) => {
    if (msg.author.bot) return; // do not respond to other bots or itself
	if (msg.channel.type != "text") { // do not use these commands in DMs or group DMs, but still log to console
		var str = "{" + msg.channel.type + "} [" + dateFormat(msg.createdAt, "FILE") + "] " + user_form(msg.author) + ": " + (msg.content ? msg.content : "(blank content)");
		for (var attachment of msg.attachments) { // add links to attachments at the end
			str += " [" + attachment[1].url + "]";
		}
		console.log(str);
	}

	// Stop if the message does not start with the prefix
	if (!msg.content.startsWith(PREFIX)) return;

	let args = msg.content.match(/\S+/gi);
	const command = client.commands.get(args[0].toLowerCase().substr(PREFIX.length)) || client.commands.get(client.aliases.get(args[0].toLowerCase().substr(PREFIX.length)));
	if (!command) {
        return;
    }
    
	client.logger.cmd(`[CMD] ${msg.author.username} (${msg.author.id}): ${msg}`);
	if (command.config.delete) {
		msg.delete();
	}
    command.run(client, msg, args); // run the command
};