const {
	SlashCommandBuilder,
	AttachmentBuilder,
  } = require('discord.js');
  const {
	gameMaker
  } = require('../../mahjong/game_maker.js');
const Player = require('../../dataTypes/player.js');
exports.data = new SlashCommandBuilder()
	.setName('mahjong')
	.setDescription('play mahjong with the boys.')
	.addStringOption(option => option
		.setName('users')
		.setDescription('Enter the @s of all the users to play with')
		.setRequired(true))
	.addNumberOption(option => option
		.setName('rounds')
		.setDescription('How many rounds in the game ')
		.setRequired(false));
exports.execute = async function (interaction) {
	const users = interaction.options.getString('users');
	const rounds = interaction.options.getNumber('rounds') ?? 1;
	const userList = Array.from(users.matchAll("<@!?([0-9]{15,20})>")).map((reg) => reg[1]);

	result = gameMaker.createGame(userList);
	if(result.constructor === Player) {
		attachment = await gameMaker.createBoardImage(result.hand.tiles);
		await interaction.reply({
		  files: [attachment]
		});
	  } else {
		await interaction.reply(result);
	  }
}