const {
  SlashCommandBuilder,
  AttachmentBuilder,
} = require('discord.js');
const {
  gameMaker
} = require('../../mahjong/game_maker.js');
const {
  createCanvas,
  loadImage
} = require('@napi-rs/canvas');
const {
  GlobalFonts
} = require('@napi-rs/canvas');
const {
  request
} = require('undici');
exports.data = new SlashCommandBuilder().setName('discard').setDescription('For Mahjong use only.').addNumberOption(option => option.setName('tiletodiscard').setDescription('Enter a number from 1-13, that tile will be discarded').setRequired(true));
exports.execute = async function (interaction) {
  const user = interaction.user.id.toString();
  const tileToDiscard = interaction.options.getNumber('tileToDiscard') ?? 1;
  
  let result = gameMaker.performDiscard(user, tileToDiscard);
  if(result.constructor === Array) {
    const canvas = createCanvas(1000, 1000);
    const context = canvas.getContext('2d');
    const background = await loadImage('./assets/board.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    for (let i = 0; i < result.length; i++) {
      const tile = result[i];
      const back = await loadImage('./assets/Front.png')
      context.drawImage(back, 100+55*(i+1), 900, 50, 65);
      console.log(tile.imageValue)
      const face = await loadImage(tile.imageValue);
      context.drawImage(face, 100+55*(i+1), 900, 40, i+1*55);
    }
    const attachment = new AttachmentBuilder(await canvas.encode('png'), {
      name: 'mahjong-board-image.png'
    });
    interaction.reply({
      files: [attachment]
    });
  } else {
    await interaction.reply(result);
  }
};