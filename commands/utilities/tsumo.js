const {
    SlashCommandBuilder,
  } = require('discord.js');
  const {
    gameMaker
  } = require('../../mahjong/game_maker.js');
  const {
    request
  } = require('undici');
  exports.data = new SlashCommandBuilder().setName('win').setDescription('Checks if you have a winning hand and if it is, wins the game. For Mahjong use only.');
  exports.execute = async function (interaction) {
    const userId = interaction.user.id.toString();
    let result = gameMaker.performTsumo(userId);
  await interaction.deferReply({ ephemeral: true });
    if(result.constructor === Array) {
        const [playerTiles, playerList, score] = result;
        let playerHands = [];
        let playerImages = [];
        let winnerImage;

          for (let i = 0; i < playerList.length; i++) {
            if(playerList[i].id != userId) {
              playerHands.push(playerList[i].hand);
              playerImages.push(playerList[i].image);
            } else {
              winnerImage = playerList[i].image;
            }
          }

          let attachment = await gameMaker.createEndScreenImage(playerTiles, winnerImage, playerHands, score, playerImages);

          for (let i = 0; i < playerList.length; i++) {
            const user = await interaction.client.users.fetch(playerList[i].id).catch(e => console.log(e));
            if (!user) {
              console.error('Invalid user');
            }
            await user.send({files: [attachment]}).catch((_) => {
              console.error(_);
            });
          }
          interaction.editReply('Congladurations! You\'re Winner!');
    } else {
      interaction.editReply(result);
    }
  };