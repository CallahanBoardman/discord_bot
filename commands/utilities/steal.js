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
      if(result.length === 3) {
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
        const [[playerID, playerTiles], seatPosition] = result;
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
        interaction.editReply('Successful steal!');
      }
    } else {
      interaction.editReply(result);
    }
  };