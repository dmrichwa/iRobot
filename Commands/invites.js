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
		let field_count = 0;
		for (var invite of inviteList) {
			// RichEmbeds have a max field count of 25
			if (field_count >= 25) {
				embed.setTitle("Invites (first 25 shown)");
				break;
			}
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
			field_count++;
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