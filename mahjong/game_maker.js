const Player = require("../dataTypes/player.js");
const PlayerHand = require("../dataTypes/player_hand.js");
const MahjongTheGame = require("./mainjong.js");
const {
  createCanvas,
  loadImage
} = require('@napi-rs/canvas');
const {
  GlobalFonts
} = require('@napi-rs/canvas');
const {
  AttachmentBuilder,
} = require('discord.js');

GlobalFonts.registerFromPath('./assets/edosz.ttf', 'Yakuza Sans');

const applyText = (canvas, text) => {
  const context = canvas.getContext('2d');

  // Declare a base size of the font
  let fontSize = 100;
  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `${fontSize -= 10}px Yakuza Sans`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 10);

  // Return the result to use in the actual canvas
  return context.font;
};

class GameMaker {
  constructor() {
    this.gamesDictionary = {};
  }
  createGame(playerIds) {
    let playerList = [];
    console.log(playerIds)
    for (let i = 0; i < playerIds.length; i++) {
      if(playerIds[i] === '1219295834106233024') {
        return 'You fool, you absolute buffoon, you think you can beat me at Mahjong? begone from my sight.'
      }
      if(this.gamesDictionary[playerIds[i]]){
        return 'Someone there is already in a game';
      }
      const player = playerList.filter(obj => {
        return obj.id === playerIds[i];
      });

      if(player.length !== 0) {
        return 'You can\'t have the same person twice silly goober'
      }
      playerList.push(new Player(new PlayerHand([]), null, playerIds[i], i + 10));
    }
    const aGameOfMahjong = new MahjongTheGame(playerList);
    for (let i = 0; i < playerIds.length; i++) {
      this.gamesDictionary[playerIds[i]] = aGameOfMahjong;
    }
    
    return aGameOfMahjong.gameSetup();
  }
  performDiscard(playerId, input) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      return game.discardTile(...player, input);
    }
    return 'You\'re not in a game';
  }
  performSteal(playerId, commandType, input) {
    let game = this.gamesDictionary[playerId];
    if (!game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      return game.performSteal(player);
    }
    return 'You\'re not in a game';
  }

  async createHandImage (playerTiles) {
    const canvas = createCanvas(1750, 400);
    const context = canvas.getContext('2d');
    context.fillStyle = '#d22b28';
    context.strokeStyle ='#ffffff';
    const background = await loadImage('./assets/board.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    for (let i = 0; i < playerTiles.length; i++) {
      const tile = playerTiles[i];
      const back = await loadImage('./assets/Front.png')
      context.drawImage(back, 110*(i+1), 100, 100, 120);
      const face = await loadImage(tile.imageValue);
      context.drawImage(face, 110*(i+1), 100, 100, 120);
      context.font = applyText(canvas, `${i+1}`);
      context.fillText(`${i+1}`, i > 9 ? 20+110*(i+1) : 30+110*(i+1), 300);
      context.strokeText(`${i+1}`, i > 9 ? 20+110*(i+1) : 30+110*(i+1), 300);
    }
    return new AttachmentBuilder(await canvas.encode('png'), {
      name: 'mahjong-board-image.png'
    });
  }
}
let gameMaker = new GameMaker();
const _gameMaker = gameMaker;
exports.gameMaker = _gameMaker;