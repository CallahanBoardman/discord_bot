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
    
  };