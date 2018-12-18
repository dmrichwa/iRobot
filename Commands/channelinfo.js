const { dateFormat, embedify, invalid_usage, rainbow, get_channel, boolean_to_yesno } = require("../Utils/");

exports.run = async (client, msg, args) => {
	if (args.length < 2) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	get_channel(args.splice(1).join(" "), msg.guild).then(channel => {
		if (channel.type !== "text" && channel.type !== "voice") {
			return msg.channel.send("This command only works on text and voice channels");
		}
		var str;
		var title;
		switch (channel.type) {
			case "text":
				str = "🆔 **ID**: " + channel.id + "\n"
					+ "👪 **Members**: " + channel.members.size + " / " + msg.guild.members.size + " (" + Math.round(channel.members.size / msg.guild.members.size * 10 * 100) / 10 + "%)\n"
					+ "😏 **NSFW**: " + boolean_to_yesno(channel.nsfw) + "\n"
					+ "📁 **Category**: " + (channel.parent ? channel.parent.name : "None") + "\n"
					+ "💬 **Topic**: " + (channel.topic ? channel.topic : "None") + "\n"
					+ "📆 **Created**: " + dateFormat(channel.createdAt, "MEDTIMEDATE");
				title = "#" + channel.name;
				break;
			case "voice":
				str = "🆔 **ID**: " + channel.id + "\n"
					+ "🔢 **Bitrate**: " + channel.bitrate + " kbps\n"
					+ "📁 **Category**: " + (channel.parent ? channel.parent.name : "None") + "\n"
					+ "🗣 **Max Users**: " + (channel.userLimit === 0 ? "Unlimited" : channel.userLimit) + "\n"
					+ "📆 **Created**: " + dateFormat(channel.createdAt, "MEDTIMEDATE");
				title = "🔊 " + channel.name;
				break;
			default:
				str = "Unknown channel type...";
				title = "?"
				break;
		}
		var embed = embedify(title, rainbow(25, Math.random() * 25), [ ], "", str, "", "", "", "", "");
		msg.channel.send({ embed: embed});
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "channelinfo",
	aliases: ["cinfo"],
	category: "Info",
	description: "Gives information about a certain channel",
	usage: "cinfo (channel name or ID)"
};