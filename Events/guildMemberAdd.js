const { SERV_UB, ROLE_UB_UNASS, CHAN_UB_WELCOME, COLORS } = require("../utils/constants.js");

module.exports = async (client, member) => {
    if (member.guild.id === SERV_UB) { // welcome message for UBreddit
        member.guild.channels.get(CHAN_UB_WELCOME).send("Howdy, <@!" + member.id + ">! Welcome to the UBreddit server! Type +chat for chat privileges, then head over to <#412827438322810891> and type `!role list` to get tags!");
        member.addRole(ROLE_UB_UNASS); // give them the unassigned role
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