const { fs, dateFormat, user_form, invalid_usage, pluralize } = require("../Utils/");
const { CREATOR_ID } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
		if (!CREATOR_ID.includes(msg.author.id)) { // only bot creator may run this command
			return;
		}
		if (args.length < 2) {
			return msg.channel.send({ embed: invalid_usage(this) });
		}
		const guild = (args[3] ? client.guilds.get(args[3]) : msg.guild); // guildId is 3rd arg or this guild if not provided
		const channel = guild.channels.get(args[1]);
		if (!channel) { // could not find channel
			return msg.channel.send({ embed: invalid_usage(this) });
		}
		var amount = args[2] ? Number(args[2]) : 100; // default to 100 messages
		(async () => {
			var str = "";
			var beforeMsg;
			var count = 0;
			while (amount > 0) {
				await new Promise(next => {
					channel.fetchMessages({ limit: 100, before: beforeMsg }).then(messages => {
						console.log("Dumping; " + amount + " left to go");
						amount -= 100; // subtract 100 from messages remaining
						for (var message of messages) {
							message = message[1];
							count++;
							const member = (message.member ? message.member : message.author); // if member is not in server anymore, just use their user instead
							var localStr = "[" + dateFormat(message.createdAt, "FILE") + "] " + user_form(member);
							if (message.type === "GUILD_MEMBER_JOIN") { // user joined guild
								localStr += " joined the server";
							}
							else if (message.type === "PINS_ADD") { // user pinned a message
								localStr += " pinned a message";
							}
							else { // assume it is a normal message
								localStr += ": " + message.content;
								if (message.content === "") {
									localStr += "(no message content)";
								}
							}
							for (var attachment of message.attachments) { // add links to attachments at the end
								localStr += " [" + attachment[1].url + "]";
							}
							for (var embed of message.embeds) { // add some info about embeds to the end
								if (embed.type === "image" || embed.type === "video") { // do not try to write down image/video embeds
									continue;
								}
								localStr += " {" + (embed.title ? "Title: " + embed.title + "; " : "")
												+ (embed.description ? "Description: " + embed.description + "; " : "")
												+ "Fields: ";
								for (var field of embed.fields) {
									localStr += "(" + field.name + ": " + field.value + ") "; 
								}
								localStr = localStr.slice(0, -1); // cut off space
								localStr += "; "
											+ (embed.footer ? "Footer: " + embed.footer.text + (embed.footer.iconURL ? "@" + embed.footer.iconURL : "") + "; " : "")
											+ (embed.image ? "Image: " + embed.image.url + "; " : "")
											+ (embed.thumbnail ? "Thumbnail: " + embed.thumbnail.url + "; " : "")
											+ (embed.url ? "URL: " + embed.url + "; " : "")
											+ (embed.timestamp ? "Timestamp: " + embed.timestamp + "; " : "")
											+ (embed.color ? "Color: " + embed.hexColor + "; " : "");
								localStr = localStr.slice(0, -2); // remove last semicolon and space
								localStr += "}";
							}
							localStr += "\n";
							str = localStr + str; // add to the beginning of string so messages are printed out chronologically
							beforeMsg = message.id; // set earliest message ID
						}
						if (messages.size < 100) { // stop if we run out of messages
							amount = 0;
						}
						next();
					}).catch(console.error);
				});
			}
			str += "Last message: " + beforeMsg + "\n";
			str += "Count: " + count + "\n";
			str += "Guild ID: " + guild.id + "\n";
			str += "Channel ID: " + channel.id + "\n";
			str = str.replace(/[\u0080-\uffff]+/g, function (match) { // escape Unicode
				return escape(match).replace(/%u/g, "\\u");
			});
			const fileName = guild.name + "-" + channel.name + "-" + Date.now() + ".txt";
			fs.writeFile("./Objects/Chandump/" + fileName, str, { encoding: "utf-8", flag: "w" }, function (err) {
				if (err) {
					console.log(err);
				}
				console.log(fileName + " dumped " + count + " " + pluralize("message", "messages", count));
			});
			msg.channel.send(count + " " + pluralize("message", "messages", count) + " dumped");
		})();
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "channeldump",
	aliases: ["chandump"],
	category: "Info",
	description: "Goes through a specified channel and dumps the messages into a text file",
	usage: "channeldump (channelId) [amount] [guildId]"
};