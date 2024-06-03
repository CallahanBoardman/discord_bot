const {
  SlashCommandBuilder,
  AttachmentBuilder,
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
  const tileToDiscard = interaction.options.getNumber('tileToDiscard') ?? 1;
  
  let result = gameMaker.performDiscard(user, tileToDiscard);
  // const user = await client.users.fetch(playerIds[i]).catch(e => console.log(e));
  //     if (!user) {
  //       return 'Someone in there does not have a valid id';
  //     }
  //     await user.send({ files: [{ attachment: this.createBoardImage(player) }] }).catch(() => {
  //       return "User has DMs closed or has no mutual servers with the bot :(";
  //     });
  if(result.constructor === Array) {
    const [playerID, playerTiles] = result;

    await interaction.reply({
      files: [await gameMaker.createBoardImage(playerTiles)]
    });
  } else {
    await interaction.reply(result);
  }
};