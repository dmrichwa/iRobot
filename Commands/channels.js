const { embedify } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	const doId = (args[1] ? (args[1].toLowerCase() === "id") : false);
	const channels = msg.guild.channels.cache;

	// Create string for channels with no category
	let noCategoryStr = channels.filter(channel => channel.type !== 'category' && !channel.parent).sort((a, b) => {
		return a.position - b.position;
	}).reduce((acc, cur) => {
		acc += cur.toString();
		if (doId) {
			acc += " (`" + cur.id + "`)";
		}
		acc += "\n";
		return acc;
	}, "");

	// Create sorted list of category channels
	let categories = channels.filter(channel => channel.type === 'category').sort((a, b) => {
		return a.position - b.position;
	});

	// Sort children channels
	categories.each(category => {
		// .children property is read-only, so make a new property
		category.sortedChildren = category.children.sort((a, b) => {
			return a.position - b.position;
		});
	});

	// Build strings of channels in each category
	let fields = [];
	categories.each(category => {
		let catStr = "**• " + category.name + "**";
		if (doId) {
			catStr += " (`" + category.id + "`)";
		}
		catStr += "\n";
		let chanStr = "";
		for (let channel of category.sortedChildren) {
			channel = channel[1];
			chanStr += channel.toString();
			if (doId) {
				chanStr += " (`" + channel.id + "`)";
			}
			chanStr += "\n";
		}
		fields.push([catStr, chanStr, true]);
	});

	let embed = embedify("Channel List", CATEGORIES.INFO.color, fields, "", noCategoryStr, "", "", "", "", "");
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