const { user_form, embedify } = require("../Utils");
const { GENERAL_LOG_CHANNELS, COLORS } = require("../Utils/constants.js");

module.exports = async (client, member) => {
    const channel = (member.guild.id in GENERAL_LOG_CHANNELS ? GENERAL_LOG_CHANNELS[member.guild.id] : "");
	if (!channel) { // do nothing if member left on a server without the log channel
		return;
	}

	var embed = embedify("", COLORS.MEMBER_LEAVE,
	[
		["Name", user_form(member), true],
		["ID", member.id, true],
	], ["👋 Member Left", member.user.displayAvatarURL()], member.toString(), "", "", "", Date.now(), "");
    client.channels.cache.get(channel).send({ embed: embed });
};