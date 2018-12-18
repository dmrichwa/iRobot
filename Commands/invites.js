const { dateFormat, user_form, embedify, pluralize } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	msg.guild.fetchInvites().then(invites => {
		var embed = embedify("Invites", CATEGORIES.INFO.color,
		[
		], "", "", invites.size + " " + pluralize("invite", "invites", invites.size), "", "", "", "");
		var inviteList = [];
		for (var obj of invites) {
			inviteList.push(obj[1]);
		}
		inviteList.sort((a, b) => {
			return b.uses - a.uses;
		});
		for (var invite of inviteList) {
			var header = "";
			var content = "";
			header += "[" + invite.code + "] ";
			header += (invite.inviter ? user_form(invite.inviter) : "Nobody") + " ";
			header += "in #" + invite.channel.name + " ";
			header += "on " + dateFormat(invite.createdAt, "SHORTTIMEDATE");
			content += invite.uses;
			content += (invite.maxUses === 0 ? "" : " / " + invite.maxUses);
			content += " uses";
			content += (invite.maxAge === 0 ? ", never expires" : ", expires after " + invite.maxAge + " seconds");

			embed.addField(header, content, false);
		}
		msg.channel.send({ embed: embed });
	}).catch(error => {
		msg.channel.send("Error: " + error.content);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "invites",
	aliases: ["invitelist"],
	category: "Info",
	description: "Lists all invites in this guild",
	usage: "invites"
};