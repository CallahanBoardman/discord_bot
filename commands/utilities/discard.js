const {
  SlashCommandBuilder,
} = require('discord.js');
const {
  gameMaker
} = require('../../mahjong/game_maker.js');
const {
  request
} = require('undici');
exports.data = new SlashCommandBuilder().setName('discard').setDescription('For Mahjong use only.').addNumberOption(option => option.setName('tiletodiscard').setDescription('Enter a number from 1-13, that tile will be discarded').setRequired(true));
exports.execute = async function (interaction) {
  const inputUser = interaction.user.id.toString();
  const tileToDiscard = interaction.options.getNumber('tiletodiscard') ?? 1;
  let result = gameMaker.performDiscard(inputUser, tileToDiscard);
  await interaction.deferReply({ ephemeral: true });
  if(result.constructor === Array) {
    const [playerID, playerTiles, seatPosition] = result;
    console.log(seatPosition)
		let attachment = await gameMaker.createHandImage(playerTiles);
    let game = gameMaker.gamesDictionary[playerID];
    for (let i = 0; i < game.players.length; i++) {
      const user = await interaction.client.users.fetch(game.players[i].id).catch(e => console.log(e));
      if (!user) {
        console.error('Invalid user');
      }
		  let attachment2 = await gameMaker.createBoardImage(game.players[i].id, game.players[i].seatPosition);
      await user.send({files: [attachment2]}).catch((_) => {
        console.error(_);
      });
    }
    const user = await interaction.client.users.fetch(playerID).catch(e => console.log(e));
    if (!user) {
      console.error('Invalid user');
    }
    await user.send({files: [attachment]}).catch((_) => {
      console.error(_);
    });
    interaction.editReply(`Discarded tile ${tileToDiscard}`);
  } else {
    interaction.editReply(result);
  }
};