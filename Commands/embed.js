const { embedify } = require("../Utils/");

exports.run = async (client, msg, args) => {
	var embedObject1 = embedify("title", "#FF0000", [["mother", "gay"], ["father", "gayer", true], ["yes", "yes", true], ["yes", "yes", true], ["no", "maybe"], ["sometimes", "yes", true], ["ok work", "for it", true]]);
	var embedObject2 = embedify("title", "#FF0000", [["mother", "gay"], ["father", "gayer", true], ["yes", "yes", true], ["yes", "yes", true], ["no", "maybe"], ["sometimes", "yes", true], ["ok work", "for it", true]], "author", "desc", "footer", "https://cdn.discordapp.com/icons/406941589538340903/cfbd24fc9b9f042bd0cb920aa00762be.jpg", "https://cdn.discordapp.com/icons/332922421382479882/d877e9a75f216f777f56292ae3c28139.jpg", msg.createdAt, "http://google.com");
	var embedObject3 = embedify("title", "#FF0000", [["mother", "gay"], ["father", "gayer", true], ["yes", "yes", true], ["yes", "yes", true], ["no", "maybe"], ["sometimes", "yes", true], ["ok work", "for it", true]], ["author", "https://cdn.discordapp.com/avatars/194180105537454080/afdabdf8e90a5f83e16378ff7e2eef50.webp"], "desc", ["footer", "https://cdn.discordapp.com/avatars/277791261790830593/3a2f9b081c44b58c883a57e58c6a2c14.webp"], "https://cdn.discordapp.com/icons/406941589538340903/cfbd24fc9b9f042bd0cb920aa00762be.jpg", "https://cdn.discordapp.com/icons/332922421382479882/d877e9a75f216f777f56292ae3c28139.jpg", msg.createdAt, "http://google.com");
	var embedObject4 = embedify("title", "#FF0000", [["mother", "gay"], ["father", "gayer", true], ["yes", "yes", true], ["yes", "yes", true], ["no", "maybe"], ["sometimes", "yes", true], ["ok work", "for it", true]], ["author", "https://cdn.discordapp.com/avatars/194180105537454080/afdabdf8e90a5f83e16378ff7e2eef50.webp", "http://yahoo.com/"], "desc", ["footer", "https://cdn.discordapp.com/avatars/277791261790830593/3a2f9b081c44b58c883a57e58c6a2c14.webp"], "https://cdn.discordapp.com/icons/406941589538340903/cfbd24fc9b9f042bd0cb920aa00762be.jpg", "https://cdn.discordapp.com/icons/332922421382479882/d877e9a75f216f777f56292ae3c28139.jpg", msg.createdAt, "http://google.com");
	msg.channel.send({ embed: embedObject1 });
	msg.channel.send({ embed: embedObject2 });
	msg.channel.send({ embed: embedObject3 });
	msg.channel.send({ embed: embedObject4 });
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "embed",
	aliases: [],
	category: "Test",
	description: "Tests embed stuff",
	usage: "embed"
};