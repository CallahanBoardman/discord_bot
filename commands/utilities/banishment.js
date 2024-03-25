const { AttachmentBuilder, SlashCommandBuilder, Client, Events, GatewayIntentBits } = require('discord.js');
const fs = require("fs");
const ReminderData = require("../../dataTypes/reminder_type.js")
const { globalrepo } = require('../../global-repo');
const { log } = require('console');
const Canvas = require('@napi-rs/canvas');
const { GlobalFonts } = require('@napi-rs/canvas');
const { request } = require('undici');

// /banishtothyelandofyi(thetermforbarbarians)
// takes in user and text
// searches for text on google maps,
// picks a random street view from around there 
// and put the users profile picture in an image of it

// puppeteer for browsing to google maps and then taking a screenshot(big brain)
module.exports = {
	data: new SlashCommandBuilder()
		.setName('banishtothelandofyi')
		.setDescription('Banishes a person.')
		.addUserOption(option => 
			option
			.setName('user')
			.setDescription('Enter the banishy')
			.setRequired(true)
			)
			.addStringOption(option =>
				option
			.setName('yi')
			.setDescription('Enter the place to banish to')
			.setRequired(true))
			.addStringOption(option =>
				option
			.setName('message')
			.setDescription('Text that will appear on the screen ')
			.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const yi = interaction.options.getString('yi');
		const reason = interaction.options.getString('message') ?? '';
		
		const canvas = Canvas.createCanvas(600, 800);
		const context = canvas.getContext('2d');

		const background = await Canvas.loadImage('./assets/Front.png');

		context.clearRect(0, 0, canvas.width, canvas.height)
		
		// Select the font size and type from one of the natively available fonts
		context.font = '100px Yakuza Sans';

		
		// Select the style that will be used to fill the text in
		context.fillStyle = '#ffffff';

		// This uses the canvas dimensions to stretch the image onto the entire canvas
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		// Using undici to make HTTP requests for better performance
		const { body } = await request(user.displayAvatarURL({ extension: 'png' }));
		const avatar = await Canvas.loadImage(await body.arrayBuffer());

		// If you don't care about the performance of HTTP requests, you can instead load the avatar using
		// const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));

		// Draw a shape onto the main canvas
		context.drawImage(avatar, 100, 200, 400, 400);

		context.fillText(interaction.yi, 100, 100);

		// Use the helpful Attachment class structure to process the file for you
		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

		interaction.reply({ files: [attachment] });

		// await interaction.reply(`Banished ${user.displayName} to ${yi}`);
	},
};