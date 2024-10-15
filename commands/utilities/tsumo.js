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
    
  };