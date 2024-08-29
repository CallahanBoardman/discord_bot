const {
	SlashCommandBuilder,
	AttachmentBuilder,
  } = require('discord.js');
  const {
	gameMaker
  } = require('../../mahjong/game_maker.js');
const Player = require('../../dataTypes/player.js');
const { result } = require('lodash');
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

	const result = gameMaker.createGame(userList);
	if(result.constructor === Array) {
		let userString = "";
        let whosTurnString = "";
		for (let i = 0; i < userList.length; i++) {
			
			const listUser = await interaction.client.users.fetch(userList[i]).catch(e => console.log(e));
			userString += `${i + 1 < userList.length ? '' : 'and '}${listUser.displayName}${i + 1 < userList.length ? i + 2 < userList.length ? ', ' : ' ' : '.'}`;
			if(i === 0) {
				whosTurnString = listUser.displayName
			}
		}
		for (let i = 0; i < userList.length; i++) {
			attachment = i === 0 ? await gameMaker.createHandImage(result[i].hand) : await gameMaker.createNotTheTurnHandImage(result[i].hand.tiles);
			const listedUser = await interaction.client.users.fetch(userList[i]).catch(e => console.log(e));
			if (!listedUser) {
				console.error('Invalid user');
			}
			await listedUser.send(`You are now in a Mahjong game with ${userString} do not resist. \nIt is ${whosTurnString}'s turn.`).catch((_) => {
				console.error(_);
			});
			await listedUser.send({files: [attachment]}).catch((_) => {
				console.error(_);
			  });
		}
		
		await interaction.reply("Mahjong has been activated");
	  } else {
		await interaction.reply(result);
	  }
}