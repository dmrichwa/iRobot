const { dateFormat, user_form, embedify, pluralize } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	msg.guild.fetchInvites().then(invites => {
		var inviteList = [];
		for (var obj of invites) {
			inviteList.push(obj[1]);
		}
		inviteList.sort((a, b) => {
			return b.uses - a.uses;
		});
		let field_count = 0;
		let title = "Invites";
		let fields = [];
		for (var invite of inviteList) {
			// MessageEmbeds have a max field count of 25 (TODO: this should really be done in embedify)
			if (field_count >= 25) {
				title = "Invites (first 25 shown)";
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
			content += (invite.temporary ? ", temporary membership" : "");
			
			fields.push([header, content, false]);
			field_count++;
		}
		var embed = embedify(title, CATEGORIES.INFO.color, fields, "", "", invites.size + " " + pluralize("invite", "invites", invites.size), "", "", "", "");
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