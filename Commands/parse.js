const { fs } = require("../Utils/");

exports.run = async (client, msg, args) => {
		var array = fs.readFileSync("results.txt").toString().split("\n");
		var regex = /([\d]+)/g;
		var prevLine = -1;
		var prevDelay = 0;
		var totalDelay = 0;
		for (var i in array)
		{
			var match = array[i].match(regex);
			if (!match)
			{
				console.log("Done parsing; final delay of " + prevDelay);
				totalDelay += prevDelay;
				continue;
			}
			var thisLine = Math.floor(match[0] / 100); // get the "opcount"
			if (thisLine !== prevLine) // found a new op
			{
				if (prevDelay > 27)
					console.log(prevLine + "-> " + thisLine + "|" + prevDelay);
				prevLine = thisLine;
				totalDelay += prevDelay; // add this current delay to totalDelay
			}
			prevDelay = match[0] % 100; // update previous line's delay
		}
		console.log("Total delay: " + totalDelay);
		msg.channel.send("Check console.");
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "parse",
	aliases: [],
	category: "Test",
	description: "Parses Verilog result (hw)",
	usage: "parse"
};