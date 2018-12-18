const { fs } = require("../Utils/");

exports.run = async (client, msg, args) => {
	function getRandomInt(min, max) { // inclusive min, inclusive max
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var outStr = "";
	for (var i = 0; i < 10000; i++)
	{
		var op;
		switch (getRandomInt(0, 4))
		{
			case 0:
				op = 0;
				break;
			case 1:
				op = 1;
				break;
			case 2:
				op = 2;
				break;
			case 3:
				op = 6;
				break;
			case 4:
				op = 7;
				break;
		}
		var a = Math.floor(Math.random() * 65536);
		var b = Math.floor(Math.random() * 65536);
		outStr += "#`TESTDELAY op = " + op + "; a = " + a + "; b = " + b + ";\n";
	}
	fs.writeFile("generated.txt", outStr, function(err)
	{
		if(err)
			return console.log(err);
		
		msg.channel.send("Generated inputs");
	}); 
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "generate",
	aliases: [],
	category: "Test",
	description: "Generates Verilog tests (hw)",
	usage: "generate"
};