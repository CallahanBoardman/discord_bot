const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require('discord.js');
  const {
    gameMaker
  } = require('./mahjong/game_maker.js');
  const {
    gameHandler
  } = require('./mahjong/game_handler.js');
  const {
    request
  } = require('undici');

class ButtonConstructor {
    createButtonRow() {
        const draw = new ButtonBuilder()
              .setCustomId('draw')
              .setLabel('Draw 🀄')
              .setStyle(ButtonStyle.Primary);
  
          const steal = new ButtonBuilder()
              .setCustomId('steal')
              .setLabel('Steal 💰')
              .setStyle(ButtonStyle.Danger);
  
        const win = new ButtonBuilder()
              .setCustomId('win')
              .setLabel('Win 👑')
              .setStyle(ButtonStyle.Secondary);
  
        const quad = new ButtonBuilder()
              .setCustomId('quad')
              .setLabel('Form Quadruplet 🔢')
              .setStyle(ButtonStyle.Danger);

        return new ActionRowBuilder()
              .addComponents(draw, steal, win, quad);
    }

    async assignCollector(playerID, response) {
      const collectorFilter = i => i.user.id === playerID;

      const collector = await response.createMessageComponentCollector({ filter: collectorFilter, time: 600_000 });
      collector.on('collect', async interaction => {
      if (interaction.customId === 'draw') {
            let result = gameHandler.performDraw(playerID);
            if(result.constructor === String) {
              interaction.reply({content: result})
            } else {
              interaction.update({ content: 'Tile has been drawn', components: [] });
            
              let attachment = await gameMaker.createHandImage(result);
            const message = await interaction.user.send({files: [attachment], components: [buttonConstructor.createButtonRow()]}).catch((_) => {
              console.error(_);
            })
            await this.assignCollector(playerID, message);
            }
          } else if (interaction.customId === 'steal') {
            let result = gameHandler.performSteal(playerID);
            console.log(result);
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
                  interaction.reply('Congladurations! You\'re Winner!');
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
                interaction.reply('Successful steal!');
              }
            } else {
              interaction.reply(result);
            }
          } else if (interaction.customId === 'win') {
            let result = gameMaker.performTsumo(playerID);
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
          } else if (interaction.customId === 'quad') {
            let result = gameMaker.performKan(playerID);
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
          }
        });
  }
}

let buttonConstructor = new ButtonConstructor();
const _buttonConstructor = buttonConstructor;
exports.buttonConstructor = _buttonConstructor;