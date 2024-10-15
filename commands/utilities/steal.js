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
  await interaction.deferReply({ ephemeral: true });
  
  };