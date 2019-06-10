const { dateFormat, writeJsonFile, embedify, invalid_usage, rainbow } = require("../Utils/");
const { CHAN_UB_FOOD, EMOJI_FOOD, EMOJI_DELETE } = require("../Utils/constants.js");
const { getFood } = require("../Objects.js");

exports.run = async (client, msg, args) => {
		if (msg.channel.id !== CHAN_UB_FOOD) {
			return msg.channel.send("This command only enabled in the food drive channel (UB)");
		}
		if (args.length <= 2) {
			return msg.channel.send({ embed: invalid_usage(this) });
		}
		const count = Number(args[1]);
		if (!Number.isInteger(count)) {
			return msg.channel.send("Count must be an integer");
		}
		if (count < 1 || count > 10) {
			return msg.channel.send("Count must be between 1 and 10");
		}

		const swipeMsg = args.splice(2).join(" ").substr(0, 200);
		var embed = embedify("Food from " + msg.member.displayName, rainbow(25, Math.random() * 25),
		[
			["Claimers", "None", true],
		], "🔴 OPEN 🔴", swipeMsg, "Claimed: 0 / " + count + " • " + dateFormat(msg.createdAt, "SHORTTIMEDATEREV"), "", msg.author.avatarURL, "", "");

		msg.channel.send({ embed: embed }).then(message => {
			(async () => {
				var food = await getFood();
				food[message.id] = {
					giver: msg.author.id,
					claimers: [],
					maxAmount: count,
					created: msg.createdAt,
					msgId: message.id,
					embed: embed,
				};
				await writeJsonFile("./Objects/food.json", food);
				message.react(EMOJI_FOOD).then(() => {
					message.react(EMOJI_DELETE);
				});
			})();
		});
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "swipe",
	aliases: [],
	category: "Miscellaneous",
	description: "Gives away a swipe (UB)",
	usage: "swipe [count] (message)"
};