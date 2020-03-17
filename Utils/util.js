const { PREFIX, CREATOR_ID, EMBED_FIELD_LENGTH, CATEGORIES, COLORS } = require("./constants.js");
const { client } = require("../Objects.js");
Discord = require("discord.js"); // main stuff
sql = require("sqlite"); // database
fs = require("fs"); // filestream
average = require("image-average-color"); // average image color
got = require("got"); // http stuff
dateFormat = require("dateformat"); // formatting of dates

/**
 * Returns a Command object based on the name or alias of the command
 * @param {string} name Name or alias of command to search
 * @returns {Command} The resulting command
 */
function find_command(name) {
	if (!name) {
		return null;
	}
	return client.commands.get(name.toLowerCase()) || client.commands.get(client.aliases.get(name.toLowerCase()));
}
exports.find_command = find_command;

/**
 * Returns a category string based on the name or alias of the category
 * @param {string} name Name or alias of category to search
 * @returns {string} The resulting category name
 */
function find_category(name) {
    name = name.toLowerCase();
    for (var category in CATEGORIES)
    {
        if (CATEGORIES[category].name.toLowerCase() === name || CATEGORIES[category].shortname.toLowerCase() === name) // found exact match
            return category;
        for (var alias of CATEGORIES[category].aliases)
        {
            if (alias.toLowerCase() === name) // found alias
                return category;
        }
    }
    return null; // did not find any matching categories
}
exports.find_category = find_category;

/**
 * Forms a string containing a username and discriminator from a Discord Member/User object
 * @param member "Member" or "User" types which contain username and discriminator field
 * @returns {string} A string of the form "Username#Discrim"
 * @throws Returns the object passed in if the type passed in is invalid
 */
function user_form(member) {
    if (!member) // if nothing was passed in, return an empty string
        return "";
    else if (member.username && member.discriminator) // User object
        return member.username + "#" + member.discriminator;
    else if (member.user && member.user.username && member.user.discriminator) // Member object
        return member.user.username + "#" + member.user.discriminator;
    return member; // default action -- return the object passed in
}
exports.user_form = user_form;

/**
 * Creates a RichEmbed object with appropriate properties
 * @param {string} title Title of Embed object
 * @param {('hex')} color Sidebar color
 * @param {string[]} fields Array of Field arrays -- each Field array must have a title string and value string, and optionally: inline boolean, seperator char
 * @param {string|string[]} [author] Author (string) or Author and Icon (string[]) or Author, Icon, and URL (string[])
 * @param {string} [desc] Description
 * @param {string|string[]} [footer] Footer (string) or Footer and Icon (string[])
 * @param {('URL')} [image] Image
 * @param {('URL')} [thumb] Thumbnail
 * @param {('Timestamp')} [time] Time
 * @param {('URL')} [url] URL
 * @param {Object} file File to upload with the embed
 * @returns {Object} A RichEmbed object
 * @throws Returns the object passed in if the type passed in is invalid
 */
function embedify(title, color, fields, author = "", desc = "", footer = "", image = "", thumb = "", time = "", url = "", file = "") {
    var embedObject = new Discord.RichEmbed();

    if (file !== "" && file.attachment && file.attachment !== "")
        embedObject.attachFile(file);

    embedObject.setTitle(title);
    embedObject.setColor(color);

    // handle fields
	var fieldLength = 0;
	const maxFieldLength = EMBED_FIELD_LENGTH - Math.max(desc.length, 2048);
    for (var field of fields)
    {
        // trim the field
        field[1] = field[1].toString(); // convert to string
        if (fieldLength < maxFieldLength) // cut off to max length
            field[1] = field[1].substr(0, maxFieldLength - fieldLength);
        else // destroy the rest of the fields
            break;
        fieldLength += field[1].length; // add to total field length
        var firstField = true;

        while (field[1].length > 0) // split apart by special chars every 1024 chars
        {
            var char = field[3]; // separator char
            if (!char) char = "\n";
            var pos = field[1].lastIndexOf(char, 1024); // find last separator char in first 1024 chars
            if (pos === -1 || field[1].length <= 1024) // do not do anything if no separator chars or field is short enough
                pos = field[1].length;
            embedObject.addField((firstField ? field[0] : (field[0] + " (cont.)")), field[1].substr(0, pos), field[2]);
            field[1] = field[1].substr(pos + 1); // cut off first part of field including separator char
            firstField = false; // add (cont.) to rest of fields
        }
    }
    
    if (typeof(author) === "string")
        embedObject.setAuthor(author);
    else
        if (author.length == 1)
            embedObject.setAuthor(author[0]);
        else if (author.length == 2)
            embedObject.setAuthor(author[0], author[1]);
        else
            embedObject.setAuthor(author[0], author[1], author[2]);
    embedObject.setDescription(desc.substr(0, 2048)); // descriptions are capped to 2048 characters
    if (typeof(footer) === "string")
        embedObject.setFooter(footer);
    else
        if (footer.length == 1)
            embedObject.setFooter(footer[0]);
        else
            embedObject.setFooter(footer[0], footer[1]);
    embedObject.setImage(image);
    embedObject.setThumbnail(thumb);
    embedObject.setTimestamp(time);
    embedObject.setURL(url);

    return embedObject;
}
exports.embedify = embedify;

/**
 * Creates a RichEmbed showing the correct usage of a command
 * @param {Object} command The Command object
 * @returns {Object} A RichEmbed object
 */
function invalid_usage(command)
{
    return embedify("", COLORS.ERROR,
    [
        ["Invalid Usage", "Correct usage: **" + PREFIX + command.help.usage + "**"]
    ]);
}
exports.invalid_usage = invalid_usage;

/**
 * Creates a RichEmbed showing information about a command
 * @param {Object} command The Command object
 * @returns {Object} A RichEmbed object
 */
function command_info(command)
{
    return embedify(PREFIX + command.help.name, CATEGORIES[find_category(command.help.category)].color,
    [
        ["Usage", "**" + PREFIX + command.help.usage + "**"],
        ["Category", command.help.category]
    ], "", command.help.description, (command.help.aliases.length === 0 ? "" : "Aliases: " + command.help.aliases.join(", ")), "", "", "", "");
}
exports.command_info = command_info;

/**
 * Adds a command to the appropriate category pool
 * @param {Object} command A Command object
 */
function add_command(command)
{
    var category = find_category(command.category);
    if (category)
    {
        CATEGORIES[category].cmds.push(command);
        return;
    }
    console.log("Could not find category " + command.help.category + " for command " + command.help.name + "!");
}
exports.add_command = add_command;

/**
 * Returns the total number of commands in an optional category
 * @param {string} [category] Limit search to this category
 * @param {Boolean} [hidden] Whether to count only hidden or only nonhidden commands
 * @returns {Number} The number of commands
 */
function count_commands(category = null, hidden = false)
{
    var count = 0;
    if (category) // if we passed in a category, limit to this category
    {
        for (var command of CATEGORIES[category].cmds)
        {
            if (!command.config.hidden || (hidden && command.config.hidden))
                count++;
        }
    }
    else // else count up every category
    {
        for (var category in CATEGORIES)
        {
            for (var command of CATEGORIES[category].cmds)
            {
                if (!command.config.hidden || (hidden && command.config.hidden))
                    count++;
            }
        }
    }
    return count;
}
exports.count_commands = count_commands;

/**
 * Returns an array of Role objects with @everyone omitted
 * @param {Object} guild The Guild to look through
 * @returns {Object[]} An array of Role objects
 */
function get_role_array(guild)
{
    return guild.roles.array().filter(function(role) {
        return role !== guild.defaultRole;
    }).sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        else if (b.name.toLowerCase() < a.name.toLowerCase())
            return 1;
        else
            return 0;
    });
}
exports.get_role_array = get_role_array;

/**
 * Returns a boolean whether a user has permission to run a command
 * @param {string[]} perms List of permissions to check for
 * @param {Object} member Member object of person to check against
 * @returns {boolean} Whether the user has permission
 */
function has_permission(perms, member)
{
    var hasPerm = true;
    for (var perm of perms)
    {
        if (!member.hasPermission(perm)) // user does not have permission if any permchecks fail
            hasPerm = false;
    }
    if (CREATOR_ID.includes(member.id)) // creator always has permission
        hasPerm = true;
    return hasPerm;
}
exports.has_permission = has_permission;

/**
 * Gets the average input color of an image from its URL
 * @param {string} url The URL to use
 * @returns {Number[]} An array of the R, G, B, and A components of the average color
 */
async function get_color_from_URL(url)
{
    return new Promise((resolve, reject) =>
    {
        (async () =>
        {
            try
            {
                const response = await got(url, { responseType: "buffer" });
                average(response.body, (err, col) =>
                {
                    if (err)
                        reject(err);
                    resolve(col);
                });
            }
            catch (err)
            {
                reject(err);
            }
        })();
    });
}	
exports.get_color_from_URL = get_color_from_URL;

/**
 * Generates a distinct bright random color
 * @param {Number} numOfSteps The total number of possible colors desired
 * @param {Number} step The current step in the color chain
 * @returns {String} RGB value in string hex form
 */
function rainbow(numOfSteps, step)
{
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
    // use white or black text
    // if (red*0.299 + green*0.587 + blue*0.114) > 186 use #000000 else use #ffffff
}
exports.rainbow = rainbow;

/**
 * Finds a Discord user based on user ID, username, or nickname
 * @param {Object} input User ID, username, or nickname to look for
 * @param {Object} [guild] The guild to search through
 * @param {Object} [defaultUser] The default User object to use if no input is provided
 * @returns {Object} Promise: success = User object, failure = Error object
 */
function get_user(input, guild = "", defaultUser = "")
{
    var sanInput = String(input).toLowerCase(); // sanitized input
    var mentionReg = /<@!?(\d+)>/g; // <@12345> and <@!12345>
    var match = mentionReg.exec(sanInput);
    if (match) { // if mention, squeeze input down to just the user ID
        sanInput = match[1];
    }
	var fuzzy; // fuzzy match - if only one fuzzy match, return fuzzy, otherwise return error
	var fuzzyReject = false; // reject for having multiple fuzzy matches -- delayed so we can still look for an exact match
    return new Promise((resolve, reject) => {
        if (!input) {
            if (defaultUser) { // if no input, just return the default user
                return resolve(defaultUser);
            }
            else { // input is required
                return reject(new Error("Please provide a user"));
            }
        }
        function get_user_lookthru(user) { // returns true when we should stop
            var username = user.username.toLowerCase(); // sanitized username
            if (sanInput === user.id || sanInput === username || sanInput === (username + "#" + user.discriminator)) { // exact match
                resolve(user);
                return true;
            }
            else if (username.indexOf(sanInput) > -1) { // fuzzy match
                if (!fuzzy) { // no other matches, so we can return this
                    fuzzy = user;
                }
                else { // we have multiple possible matches -- reject
                    fuzzyReject = true;
                }
            }
            return false;
        }
        if (guild) {
            for (var member of guild.members) { // first search through only the guild, if given
                if (get_user_lookthru(member[1].user)) { // [userid, member object]
                    return;
                }
			}
			if (fuzzyReject) {
				reject(new Error("Could not find user `" + input + "` (ambiguous input)"));
			}
            if (fuzzy) {
                return resolve(fuzzy); // we have only one fuzzy match, so we can safely assume this is the user they want
            }
        }
        for (var user of client.users) { // if we cannot find someone in the guild, try to find from other servers
            if (get_user_lookthru(user[1])) { // [userid, user object]
                return;
            }
		}
		if (fuzzyReject) {
			reject(new Error("Could not find user `" + input + "` (ambiguous input)"));
		}
        if (fuzzy) {
            return resolve(fuzzy); // we have only one fuzzy match, so we can safely assume this is the user they want
        }
        // we could not find the user in our database, so try to fetch by ID
        client.fetchUser(input).then((user) => {
            return resolve(user);
        }).catch((error) => {
            return reject(new Error("Could not find user `" + input + "` (no matches)"));
        });
    });
}
exports.get_user = get_user;

/**
 * Finds a Discord member based on user ID, username, or nickname
 * @param {Object} input User ID, username, or nickname to look for
 * @param {Object} guild The guild to search through
 * @param {Object} [defaultMember] The default Member object to use if no input is provided
 * @returns {Object} Promise: success = Member object, failure = Error object
 */
function get_member(input, guild, defaultMember = "")
{
    var sanInput = String(input).toLowerCase(); // sanitized input
    var mentionReg = /<@!?(\d+)>/g; // <@12345> and <@!12345>
    var match = mentionReg.exec(sanInput);
    if (match) { // if mention, squeeze input down to just the user ID
        sanInput = match[1];
	}
	var fuzzy; // fuzzy match - if only one fuzzy match, return fuzzy, otherwise return error
	var fuzzyReject = false; // reject for having multiple fuzzy matches -- delayed so we can still look for an exact match
    return new Promise((resolve, reject) => {
        if (!input) {
            if (defaultMember) { // if no input, just return the default member
                return resolve(defaultMember);
            }
            else { // input is required
                return reject(new Error("Please provide a member"));
            }
        }
        for (var member of guild.members) {
            member = member[1]; // [userId, member object]
			var username = member.user.username.toLowerCase(); // sanitized username
			var nickname = (member.nickname || "").toLowerCase(); // sanitized nickname
            if (sanInput === member.user.id || sanInput === username || (nickname !== "" && sanInput === nickname) || sanInput === (username + "#" + member.user.discriminator)) { // exact match
                return resolve(member);
            }
            else if (username.indexOf(sanInput) > -1 || nickname.indexOf(sanInput) > -1) { // fuzzy match
                if (!fuzzy) { // no other matches, so we can return this
                    fuzzy = member;
                }
                else { // we have multiple possible matches -- reject
                    fuzzyReject = true;
                }
            }
		}
		if (fuzzyReject) {
			return reject(new Error("Could not find member `" + input + "` (ambiguous input)"));
		}
        if (fuzzy) {
            return resolve(fuzzy); // we have only one fuzzy match, so we can safely assume this is the member they want
        }
        // the member is not in the guild, so reject
        return reject(new Error("Could not find member `" + input + "` (no matches)"));
    });
}
exports.get_member = get_member;

/**
 * Finds a Role based on role ID or role name
 * @param {Object} input Role ID or role name to look for
 * @param {Object} guild The guild to search through
 * @returns {Object} Promise: success = Role object, failure = Error object
 */
function get_role(input, guild)
{
    var sanInput = String(input).toLowerCase(); // sanitized input
    var mentionReg = /<@&(\d+)>/g; // <@&12345>
    var match = mentionReg.exec(sanInput);
    if (match) { // if mention, squeeze input down to just the role ID
        sanInput = match[1];
	}
	if (sanInput.charAt(0) === '@') { // remove the @ from beginning, @noob --> noob
		sanInput = sanInput.slice(1);
	}
	var fuzzy; // fuzzy match - if only one fuzzy match, return fuzzy, otherwise return error
	var fuzzyReject = false; // reject for having multiple fuzzy matches -- delayed so we can still look for an exact match
    return new Promise((resolve, reject) => {
        if (!input) {
            return reject(new Error("Please provide a role"));
        }
        for (var role of get_role_array(guild)) {
            if (sanInput === role.id || sanInput === role.name.toLowerCase()) { // exact match
                return resolve(role);
            }
			else if (role.name.toLowerCase().indexOf(sanInput) > -1) { // fuzzy match
                if (!fuzzy) { // no other matches, so we can return this
                    fuzzy = role;
                }
				else { // we have multiple possible matches -- reject
					fuzzyReject = true;
                }
            }
		}
		if (fuzzyReject) {
			return reject(new Error("Could not find role `" + input + "` (ambiguous input)"));
		}
        if (fuzzy) {
            return resolve(fuzzy); // we have only one fuzzy match, so we can safely assume this is the Role they want
        }
        // the Role is not in the guild, so reject
        return reject(new Error("Could not find role `" + input + "` (no matches)"));
    });
}
exports.get_role = get_role;

/**
 * Finds a Channel based on channel ID or channel name
 * @param {Object} input channel ID or channel name to look for
 * @param {Object} guild The guild to search through
 * @returns {Object} Promise: success = Channel object, failure = Error object
 */
function get_channel(input, guild)
{
    var sanInput = String(input).toLowerCase(); // sanitized input
    var mentionReg = /<#(\d+)>/g; // <#12345>
    var match = mentionReg.exec(sanInput);
    if (match) { // if mention, squeeze input down to just the channel ID
        sanInput = match[1];
	}
	if (sanInput.charAt(0) === '#') { // remove the # from beginning, #general --> general
		sanInput = sanInput.slice(1);
	}
	var fuzzy; // fuzzy match - if only one fuzzy match, return fuzzy, otherwise return error
	var fuzzyReject = false; // reject for having multiple fuzzy matches -- delayed so we can still look for an exact match
    return new Promise((resolve, reject) => {
        if (!input) {
            return reject(new Error("Please provide a channel"));
        }
        function get_channel_lookthru(channel) { // returns true when we should stop
            var channelName = channel.name.toLowerCase(); // sanitized channelname
            if (sanInput === channel.id || sanInput === channelName) { // exact match
                resolve(channel);
                return true;
            }
            else if (channelName.indexOf(sanInput) > -1) { // fuzzy match
                if (!fuzzy) { // no other matches, so we can return this
                    fuzzy = channel;
                }
                else { // we have multiple possible matches -- reject
                    fuzzyReject = true;
                }
            }
            return false;
        }
		for (var channel of guild.channels) { // first look through just text channels
			if (channel[1].type !== "text") {
				continue;
			}
			if (get_channel_lookthru(channel[1])) {
				return;
			}
		}
		if (fuzzyReject) {
			reject(new Error("Could not find channel `" + input + "` (ambiguous input)"));
		}
		if (fuzzy) {
			return resolve(fuzzy); // we have only one fuzzy match, so we can safely assume this is the channel they want
		}
		for (var channel of guild.channels) { // then look through the other types of channels (voice, category)
			if (get_channel_lookthru(channel[1])) {
				return;
			}
		}
		if (fuzzyReject) {
			reject(new Error("Could not find channel `" + input + "` (ambiguous input)"));
		}
		if (fuzzy) {
			return resolve(fuzzy); // we have only one fuzzy match, so we can safely assume this is the channel they want
		}
        // we could not find the channel
        return reject(new Error("Could not find channel `" + input + "` (no matches)"));
    });
}
exports.get_channel = get_channel;

/**
 * Returns the singular or plural version of a string
 * @param {string} singular Singular form of the string
 * @param {string} plural Plural form of the string
 * @param {Number} count Count to use
 * @returns {string} The singular or plural version of the string
 */
function pluralize(singular, plural, count)
{
    return (count === 1 ? singular : plural);
}
exports.pluralize = pluralize;

/**
 * Returns the colorized mentionable or plaintext name of a Role depending on if it has a color
 * @param {Object} role Role object to use
 * @param {boolean} id Whether to add the role ID at the end
 * @param {boolean} bold Whether to bold the role name/mentionable
 * @returns {string} The formatted string
 */
function format_role(role, id = false, bold = true)
{
	var str = "";
	if (bold) {
		str += "**";
	}
	if (role.color === 0) { // plaintext
		str += role.name;
	}
	else { // mentionable
		str += role.toString();
	}
	if (bold) {
		str += "**";
	}
	if (id) {
		str += " (`" + role.id + "`)";
	}
	return str;
}
exports.format_role = format_role;

/**
 * Converts a boolean to a Yes/No string
 * @param {boolean} bool The boolean to test
 * @param {boolean} [capital] If true, the first letter will be capitalized
 * @returns {string} The Yes/No string
 */
function boolean_to_yesno(bool, capital = true)
{
	switch (bool) {
		case true:
			if (capital) {
				return "Yes";
			}
			else {
				return "yes";
			}
			break;
		case false:
			if (capital) {
				return "No";
			}
			else {
				return "no";
			}
			break;
		default:
			break;
	}
}
exports.boolean_to_yesno = boolean_to_yesno;