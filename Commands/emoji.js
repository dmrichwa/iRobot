const { invalid_usage } = require("../Utils/");

exports.run = async (client, msg, args) => {
	if (args.length < 2) {
        return msg.channel.send({ embed: invalid_usage(this) });
    }
    const idEx = /<(a?):\S+:(\d+)>/g;
    const parsed = idEx.exec(args.slice(1).join(" "));
    if (!parsed) {
        return msg.channel.send({ embed: invalid_usage(this) });
    }
    const isGif = parsed[1];
    const id = parsed[2];
    let url;
    if (isGif) {
        url = `https://cdn.discordapp.com/emojis/${id}.gif`;
    }
    else {
        url = `https://cdn.discordapp.com/emojis/${id}.png`;
    }
    msg.channel.send({files: [url]});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "emoji",
	aliases: ["e", "hugeemoji", "hugemoji"],
	category: "Basic",
	description: "Shows the enlarged picture of an emoji",
	usage: "emoji (emoji)"
};