const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const ReminderData = require("../../dataTypes/reminder_type.js")
const { globalrepo } = require('../../global-repo');
const { log } = require('console');

Date.prototype.addHours = function(h) {
	this.setTime(this.getTime() + (h*60*60*1000));
	return this;
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Reminds a person.')
		.addNumberOption(option => 
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
		const hours = interaction.options.getNumber('date');
		const users = interaction.options.getString('users');
		const reason = interaction.options.getString('message') ?? 'Reminder for something idk';
		const userList = Array.from(users.matchAll("<@!?([0-9]{15,20})>")).map((reg)=> reg[1]);
		let dateToRemind = new Date();
		
		const jsonData = new ReminderData(dateToRemind.addHours(hours), userList, reason)
		globalrepo.addToMap(jsonData);

		await interaction.reply(`Reminder set for ${dateToRemind}`);
	},
};