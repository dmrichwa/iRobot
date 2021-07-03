const { slurs } = require("../Objects/slurs.js");
const { dateFormat, user_form, embedify } = require(".");
const { DELETE_EDIT_CHANNELS, COLORS, SERV_TYLER } = require("./constants.js");

/**
 * Checks a message for slurs and takes action if it does
 * @param {Object} client The bot client
 * @param {Object} msg The message to check
 * @returns {void}
 */
function run_slur_checker(client, msg) {
    // Disable slur checker on Tylersters
    if (msg.guild && msg.guild.id === SERV_TYLER) {
        return;
    }
    let detected_slurs = check_for_slurs(msg);
    if (detected_slurs.length > 0) {
        let converted_slurs = make_safe_slurs(detected_slurs);
        msg.channel.send("⚠️ Warning: Please refrain from using slurs. A copy of your message has been sent to the staff.\n`Slurs used: " + converted_slurs.join(", ") + "`");
        client.logger.log(`[SLUR] ${msg.author.username} (${msg.author.id}) used slurs (${detected_slurs.join(",")}): ${msg}`);
        send_slur_embed(client, msg);
    }
}

/**
 * Checks a message to see if it contains slurs
 * @param {Object} msg The message to check
 * @returns {Object[]} An array of slurs used
 */
function check_for_slurs(msg) {
    //let words = msg.content.match(/\w+/g);
    
    // Does a simple case-insensitive string match, to make sure slurs hidden in words and plurals are caught
    // TODO: Better system would be to actually detect word variations to prevent slurs-inside-words as this is rarely intentional

    let detected_slurs = [];
    let lower_msg = msg.content.toLowerCase();

    for (let slur in slurs) {
        if (lower_msg.includes(slur)) {
            detected_slurs.push(slur);
        }
    }

    return detected_slurs;
}

/**
 * Sends an embed in the slur log channel
 * @param {Object} client The bot client
 * @param {Object} msg The offending message
 * @returns {void}
 */
function send_slur_embed(client, msg) {
    if (!msg.guild) { // ignore if not in guild
		return;
	}
	const channel = (msg.guild.id in SLUR_LOG_CHANNELS ? SLUR_LOG_CHANNELS[msg.guild.id] : "");
	if (!channel) { // do nothing if message on a server without a log channel
		return;
	}
	if (msg.author.id === client.user.id) { // don't log client messages
		return;
	}

	let embed = embedify("", COLORS.SLUR,
	[
		["Channel", msg.channel, true],
		["Message ID", msg.id, true],
	], ["🤬 Slurs used by " + user_form(msg.author) + " (#" + msg.author.id + ")", msg.author.displayAvatarURL()], msg.content, "", "", "", Date.now(), "");
	client.channels.cache.get(channel).send({ embed: embed });
}

/**
 * Converts a list of slurs into safe slurs
 * @param {String[]} slur_array The array of slurs to convert
 * @returns {String[]} A converted array of safe slurs
 */
function make_safe_slurs(slur_array) {
    let converted_array = [];

    for (let slur of slur_array) {
        converted_array.push(slurs[slur]);
    }

    return converted_array;
}

module.exports = {
    run_slur_checker: run_slur_checker,
}