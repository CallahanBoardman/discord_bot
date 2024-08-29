const {
    SlashCommandBuilder,
  } = require('discord.js');
  const {
    gameMaker
  } = require('../../mahjong/game_maker.js');
  const {
    request
  } = require('undici');
  exports.data = new SlashCommandBuilder().setName('formquadruplet').setDescription('Forms four of the same tile in your hand into a group, if possible. For Mahjong use only.');
  exports.execute = async function (interaction) {
    const user = interaction.user.id.toString();
    let result = gameMaker.performKan(user);
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