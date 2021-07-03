const { dateFormat, user_form, embedify } = require("../Utils");
const { DELETE_EDIT_CHANNELS, COLORS } = require("../Utils/constants.js");

module.exports = async (client, message) => {
    if (!message.guild) { // ignore if not in guild
		return;
	}
	const channel = (message.guild.id in DELETE_EDIT_CHANNELS ? DELETE_EDIT_CHANNELS[message.guild.id] : "");
	if (!channel) { // do nothing if message deleted on a server without the log channel
		return;
	}
	if (message.author.id === client.user.id) { // don't log client messages
		return;
	}

	var imageCountStr = "🖼".repeat(message.attachments.size);
	if (imageCountStr !== "") {
		imageCountStr = " • " + imageCountStr;
	}
	var msgContent = message.content;
	for (var embed of message.embeds) {
		if (embed.type === "image" || embed.type === "video") { // ignore image/video embeds (URL links)
			continue;
		}
		msgContent += " <embed>";
	}
	if (msgContent === "") {
		msgContent = "<blank message>";
	}

	var embed = embedify("", COLORS.DELETE,
	[
		["Channel", message.channel, true],
		["ID", message.id, true],
	], ["❌ Deletion from " + user_form(message.author) + " (#" + message.author.id + ")", message.author.displayAvatarURL()], msgContent, "✏ " + dateFormat(message.createdAt, "MEDTIMEDATE") + imageCountStr, "", "", Date.now(), "");
	client.channels.get(channel).send({ embed: embed });
};