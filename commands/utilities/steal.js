const {
    SlashCommandBuilder,
  } = require('discord.js');
  const {
    gameMaker
  } = require('../../mahjong/game_maker.js');
  const {
    request
  } = require('undici');
  exports.data = new SlashCommandBuilder().setName('steal').setDescription('Steals the most recently discarded tile, if you can. For Mahjong use only.');
  exports.execute = async function (interaction) {
    const user = interaction.user.id.toString();
    let result = gameMaker.performSteal(user);
  await interaction.deferReply({ ephemeral: true });
    if(result.constructor === Array) {
      const [playerID, playerTiles] = result;
          attachment = await gameMaker.createHandImage(playerTiles);
          attachment2 = await gameMaker.createBoardImage(playerID);
          for (let i = 0; i < game.players.length; i++) {
            const user = await interaction.client.users.fetch(game.players[i].id).catch(e => console.log(e));
            if (!user) {
              console.error('Invalid user');
            }
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
      interaction.editReply(`placeholder message`);
    }
  };