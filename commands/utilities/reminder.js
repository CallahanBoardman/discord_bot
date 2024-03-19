const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const {ReminderData} = require("../../dataTypes/reminder_type.js")

Date.prototype.addHours = function(h) {
	this.setTime(this.getTime() + (h*60*60*1000));
	return this;
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Reminds a person .')
		.addIntegerOption(option => 
			option
			.setName('date')
			.setDescription('How many hours into the future?')
			.setRequired(true)
			)
			.addStringOption(option =>
				option
			.setName('users')
			.setDescription('Enter the @s of all the users to be mentioned')
			.setRequired(true))
			.addStringOption(option =>
				option
			.setName('message')
			.setDescription('What message to send ')
			.setRequired(false)),
	async execute(interaction) {
		const hours = interaction.options.getInteger('date');
		const users = interaction.options.getString('users');
		const reason = interaction.options.getString('message') ?? 'Reminder for something idk';
		const userList = users.split('@');
		let dateToRemind = new Date();
		
		const jsonData = new ReminderData(dateToRemind.addHours(hours), userList, reason)
		jsonStr = fs.readFileSync('./reminders.json', 'utf8');
		var obj = JSON.parse(jsonStr);
		obj['reminders'].push(jsonData.toJSON());
		fs.writeFile('reminders.json', JSON.stringify(obj), (error) => {
			if (error) throw error;
		  });
		await interaction.reply(`Reminder set for ${dateToRemind}`);
	},
};