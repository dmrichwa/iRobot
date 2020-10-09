const { dateFormat, user_form, embedify } = require("../Utils");
const { DELETE_EDIT_CHANNELS, COLORS } = require("../Utils/constants.js");
const { run_slur_checker } = require("../Utils/slurChecker.js");

module.exports = async (client, oldMessage, message) => {
    if (!message.guild) { // ignore if not in guild
		return;
	}
	const channel = (message.guild.id in DELETE_EDIT_CHANNELS ? DELETE_EDIT_CHANNELS[message.guild.id] : "");
	if (!channel) { // do nothing if message edited on a server without the log channel
		return;
	}
	if (message.author.id === client.user.id) { // don't log client messages
		return;
	}
	if (message.content === oldMessage.content) { // when a message is sent which embeds something (i.e. a link), this event is erroneously triggered -- ignore (NB: blocks true embed updates; no practical impact)
		return;
	}

	// Perform per-message functions
	run_slur_checker(client, message);

	var embed = embedify("", COLORS.EDIT,
	[
		["Old Content", oldMessage.content, false, " "],
		["Channel", message.channel, true],
		["ID", message.id, true],
	], ["✏ Edit from " + user_form(message.author) + " (#" + message.author.id + ")", message.author.displayAvatarURL], message.content, "✏ " + dateFormat(message.createdAt, "MEDTIMEDATE"), "", "", Date.now(), "");
	client.channels.get(channel).send({ embed: embed });
};