const { COLORS } = require("../utils/constants.js");

module.exports = async (client, member) => {
    const channel = (member.guild.id in GENERAL_LOG_CHANNELS ? GENERAL_LOG_CHANNELS[member.guild.id] : "");
	if (!channel) { // do nothing if member left on a server without the log channel
		return;
	}

	var embed = embedify("", COLORS.MEMBER_LEAVE,
	[
		["Name", user_form(member), true],
		["ID", member.id, true],
	], ["👋 Member Left", member.user.displayAvatarURL], member.toString(), "", "", "", Date.now(), "");
    bot.channels.get(channel).send({ embed: embed });
};