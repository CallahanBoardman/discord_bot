const { AttachmentBuilder, SlashCommandBuilder, Client, Events, GatewayIntentBits } = require('discord.js');
const { globalrepo } = require('../../global-repo');
const Canvas = require('@napi-rs/canvas');
const { GlobalFonts } = require('@napi-rs/canvas');
const { request } = require('undici');

GlobalFonts.registerFromPath('./assets/edosz.ttf', 'Yakuza Sans');
// /banishtothyelandofyi(thetermforbarbarians)
// takes in user and text
// searches for text on google maps,
// picks a random street view from around there 
// and put the users profile picture in an image of it

// puppeteer for browsing to google maps and then taking a screenshot(big brain)

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 100;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px Yakuza Sans`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 10);

	// Return the result to use in the actual canvas
	return context.font;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mahjongify')
		.setDescription('Banishes a person to the mahjong dimension.')
		.addUserOption(option => 
			option
			.setName('user')
			.setDescription('Enter the banishy')
			.setRequired(true)
			)
			.addStringOption(option =>
				option
			.setName('toptext')
			.setDescription('Enter the top text')
			.setRequired(true))
			.addStringOption(option =>
				option
			.setName('bottomtext')
			.setDescription('Text that will appear on bottom')
			.setRequired(false))
			.addStringOption(option =>
				option
			.setName('outlinecolor')
			.setDescription('Color that appears outside')
			.setRequired(false))
			.addStringOption(option =>
				option
			.setName('fillcolor')
			.setDescription('Colour that appears inside')
			.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const top = interaction.options.getString('toptext');
		const bottom = interaction.options.getString('bottomtext') ?? '';
		const outside = interaction.options.getString('outlinecolor') ?? '#000000';
		const inside = interaction.options.getString('fillcolor') ?? '#ffffff';
		const canvas = Canvas.createCanvas(600, 800);
		const context = canvas.getContext('2d');

		const background = await Canvas.loadImage('./assets/Front.png');

		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		
		// Using undici to make HTTP requests for better performance
		const { body } = await request(user.displayAvatarURL({ extension: 'png' }));
		const avatar = await Canvas.loadImage(await body.arrayBuffer());

		// If you don't care about the performance of HTTP requests, you can instead load the avatar using
		// const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));

		// Draw a shape onto the main canvas
		context.drawImage(avatar, 100, 200, 400, 400);

		context.font = applyText(canvas, top);
		context.textAlign = "center";
		// Select the style that will be used to .fill the text in
		//dark background
		// context.fillStyle = '#d22b28';
		// context.strokeStyle ='#ffffff';

		console.log(inside)
		console.log(outside)
		//light background
		context.fillStyle = inside;
		context.strokeStyle = outside;
		context.lineWidth = 1.5;
		context.fillText(top, canvas.width / 2, canvas.height / 5);
		context.strokeText(top, canvas.width / 2, canvas.height / 5);

		context.font = applyText(canvas, bottom);
		context.fillText(bottom, canvas.width / 2, canvas.height / 1.2);
		context.strokeText(bottom, canvas.width / 2, canvas.height / 1.2);
		// Use the helpful Attachment class structure to process the file for you
		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

		interaction.reply({ files: [attachment] });

		// await interaction.reply(`Banished ${user.displayName} to ${yi}`);
	},
};