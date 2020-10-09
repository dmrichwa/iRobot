const { embedify } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	const doId = (args[1] ? (args[1].toLowerCase() === "id") : false);
	const channels = msg.guild.channels.sort((a, b) => { // sort by position in channel list
		return a.position - b.position;
	});
	var noCategoryStr = "";	
	var categories = {};
	for (var channel of channels) {
		channel = channel[1]; // [channelId, channel]
		if (channel.type === "category") { // category
			categories[channel.id] = categories[channel.id] || []; // add blank category array to list if not exist
		}
		else if (channel.parent) { // in a category
			categories[channel.parentID] = categories[channel.parentID] || []; // create category array if not exist
			categories[channel.parentID].push(channel.id);
		}
		else { // not in a category
			noCategoryStr += channel.name;
			if (doId) {
				noCategoryStr += " (`" + channel.id + "`)";
			}
			noCategoryStr += "\n";
		}
	}
	let fields = [];
	for (var category in categories) {
		category = channels.get(category);
		var catStr = "**• " + category.name + "**";
		if (doId) {
			catStr += " (`" + category.id + "`)";
		}
		catStr += "\n";
		var chanStr = "";
		var vcStr = ""; // VCs are shunted to the bottom of a category, so make sure we place it last
		for (var channel of categories[category.id]) {
			channel = channels.get(channel);
			if (channel.type === "voice") {
				vcStr += "🔈" + channel.name;
				if (doId) {
					vcStr += " (`" + channel.id + "`)";
				}
				vcStr += "\n";
			}
			else {
				chanStr += channel.toString();
				if (doId) {
					chanStr += " (`" + channel.id + "`)";
				}
				chanStr += "\n";
			}
		}
		fields.push([catStr, chanStr + vcStr, true]);
	}
	var embed = embedify("Channel List", CATEGORIES.INFO.color, fields, "", noCategoryStr, "", "", "", "", "");
	msg.channel.send({ embed: embed});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "channels",
	aliases: ["clist"],
	category: "Info",
	description: "Prints out every channel, along with their ID",
	usage: "clist (id)"
};