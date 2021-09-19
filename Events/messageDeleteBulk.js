const { MessageAttachment } = require("discord.js");
const { dateFormat, user_form, embedify } = require("../Utils");
const { DELETE_EDIT_CHANNELS, COLORS } = require("../Utils/constants.js");

module.exports = async (client, messages) => {
	const channel = (messages.first().guild.id in DELETE_EDIT_CHANNELS ? DELETE_EDIT_CHANNELS[messages.first().guild.id] : "");
	if (!channel) { // do nothing if messages deleted on a server without a log channel
		return;
	}

    let totalContent = "";

    for (let message of messages) {
        message = message[1];
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

        totalContent += "(" + message.id + ") "
                      + "[" + dateFormat(message.createdAt, "MEDTIMEDATE") + "] "
                      + user_form(message.author) + " (#" + message.author.id + "): "
                      + msgContent
                      + imageCountStr
                      + "\n";
    }

    let fileAttachment = new MessageAttachment(Buffer.from(totalContent), "bulkMessageDelete-" + messages.first().channel.name + "-" + dateFormat(Date.now(), "isoDateTime") + ".txt");
	var embed = embedify("", COLORS.DELETE,
	[
        ["Channel", messages.first().channel, true]
	], "❌ Bulk deletion", "", "", "", "", Date.now(), "", fileAttachment);
	client.channels.cache.get(channel).send({ embed: embed });
};