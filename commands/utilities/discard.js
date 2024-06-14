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
  const user = interaction.user.id.toString();
  const tileToDiscard = interaction.options.getNumber('tiletodiscard') ?? 1;
  let result = gameMaker.performDiscard(user, tileToDiscard);
  if(result.constructor === Array) {
    const [playerID, playerTiles] = result;
		attachment = await gameMaker.createHandImage(playerTiles);
		attachment2 = await gameMaker.createBoardImage(playerID);
    const user = await interaction.client.users.fetch(playerID).catch(e => console.log(e));
    if (!user) {
      console.error('Invalid user');
    }
    await user.send({files: [attachment]}).catch((_) => {
      console.error(_);
    });
    await interaction.reply({
      files: [attachment2]
    });
  } else {
    await interaction.reply(result);
  }
};