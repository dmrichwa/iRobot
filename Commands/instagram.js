const { got, embedify, invalid_usage, pluralize } = require("../Utils/");
const { CATEGORIES, COLORS } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	// Disabled until converted to use proper instagram API
	return msg.channel.send("Command disabled");
	(async () => {
		if (args.length < 2) {
			return msg.channel.send(invalid_usage(this));
		}
		// grab user ID
		var url = "https://www.instagram.com/" + args[1];
		var response;
		try {
			response = await got(url);
		}
		catch (error) {
			// Display error if not 404 (which indicates user is not found)
			if (error.response?.statusCode !== 404) {
				console.log(error);
				return msg.channel.send("Error " + (error.response?.statusCode ?? "unknown") + " trying to find user `" + args[1] + "`");
			}
			return msg.channel.send("Could not find user `" + args[1] + "`");
		}
		if (!response) {
			return msg.channel.send("Could not load instagram profile page");
		}
		var regex = /profilePage_(\d+)/g;
		var userId = regex.exec(response.body);
		if (userId[1]) {
			userId = userId[1]; // get the first matched group (the actual user ID)
		}
		if (typeof userId !== "string") {
			return msg.channel.send("Could not find User ID");
		}
		// grab stories
		url = "https://i.instagram.com/api/v1/feed/user/" + userId + "/reel_media/";
		const headers = {
			'x-ig-capabilities': '3w==',
			'user-agent': 'Instagram 9.5.1 (iPhone9,2; iOS 10_0_2; en_US; en-US; scale=2.61; 1080x1920) AppleWebKit/420+',
			host: 'i.instagram.com',
			cookie: `sessionid=IGSC9c6a6597aaa5a2baa9d43a3ff9efdd5c357625800d61f2173dc4c9ddb42458a9%3AMj5rdqJJIIoAXDxI1rDbw3O5JKjKo4lC%3A%7B%22_auth_user_id%22%3A1946091133%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22_token%22%3A%221946091133%3A0LhuvvFN6PoSH9TGyGFZgt3mjmWEkSHZ%3Aa63531c34cf8b1c47621c10c5876188f9e181a765409f2f759a5bd1d69d74818%22%2C%22last_refreshed%22%3A1533022184.2869796753%7D; ds_user_id=22486465`
		}
		try {
			response = await got(url, {headers: headers});
		}
		catch (error) {
			var embed = embedify("", COLORS.ERROR, [ ], "", "Could not find user `" + args[1] + "`", "", "", "", "", "");
			return msg.channel.send({ embed: embed });
		}
		try {
			var parsed = JSON.parse(response.body);
			if (parsed.items.length === 0) { // no stories
				var embed = embedify("", COLORS.ERROR, [ ], "", "`" + args[1] + "` has no stories", "", "", "", "", "");
				return msg.channel.send({ embed: embed });
			}
			else {
				if (!args[2]) { // tell them how many stories they have
					var embed = embedify("", CATEGORIES.MISC.color, [ ], "", "`" + args[1] + "` has " + parsed.items.length + " " + pluralize("story", "stories", parsed.items.length) + ". Use `!ig [username] [#]` to view one.", "", "", "", "", "");
					return msg.channel.send({ embed: embed });
				}
				else { // give them a specific story
					if (isNaN(args[2]) || args[2] < 1 || args[2] > parsed.items.length) { // invalid story number
						var embed = embedify("", COLORS.ERROR, [ ], "", "Invalid story number. `" + args[1] + "` has " + parsed.items.length + " " + pluralize("story", "stories", parsed.items.length) + ".", "", "", "", "", "");
						return msg.channel.send({ embed: embed });
					}
					else { // valid story number
						const arrayIndex = parseInt(args[2]) - 1;
						var directUrl;
						if (parsed.items[arrayIndex].video_versions) { // video
							directUrl = parsed.items[arrayIndex].video_versions[0].url;
						}
						else { // image
							directUrl = parsed.items[arrayIndex].image_versions2.candidates[0].url;
						}
						msg.channel.send(directUrl);
					}
				}
			}
		}
		catch (error) {
			console.log(error);
			msg.channel.send("Couldn't find story URL... (this isn't supposed to happen)");
		}
	})();
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "instagram",
	aliases: ["ig", "igstory"],
	category: "Miscellaneous",
	description: "Gets the current stories from an instagram user",
	usage: "instagram (user) (page)"
};