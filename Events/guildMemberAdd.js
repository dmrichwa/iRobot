const { user_form, embedify } = require("../Utils");
const { SERV_UB, CHAN_UB_WELCOME, GENERAL_LOG_CHANNELS, COLORS } = require("../Utils/constants.js");

module.exports = async (client, member) => {
    if (member.guild.id === SERV_UB) { // welcome message for UBreddit
        member.guild.channels.get(CHAN_UB_WELCOME).send("Howdy, <@!" + member.id + ">! Welcome to the UBreddit server!\n**To start chatting**, add and verify your phone to your Discord account or DM a staff member (see the list of staff in <#414616495176286208>). Then head over to <#412827438322810891> and type `!role list` to get tags!");
    }

    const channel = (member.guild.id in GENERAL_LOG_CHANNELS ? GENERAL_LOG_CHANNELS[member.guild.id] : "");
    if (!channel) { // do nothing if member joined on a server without the log channel
        return;
    }

    var embed = embedify("", COLORS.MEMBER_ADD,
    [
        ["Name", user_form(member), true],
        ["ID", member.id, true],
    ], ["➡ Member Joined", member.user.displayAvatarURL], member.toString(), "", "", "", Date.now(), "");
    client.channels.get(channel).send({ embed: embed });
};