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

  performSteal(playerId) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      return game.performSteal(...player);
    }
    return 'You\'re not in a game';
  }

  performKan(playerId) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      return game.performKan(...player.hand);
    }
    return 'You\'re not in a game';
  }

  performRiichi(playerId) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      return game.performSteal(...player);
    }
    return 'You\'re not in a game';
  }

  performTsumo(playerId) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      return game.performTsumo(...player);
    }
    return 'You\'re not in a game';
  }

  async createHandImage (playerHand) {
    let playerTiles = playerHand.tiles;
    let playerOpenTiles = playerHand.openHand;

    const canvas = createCanvas(1750, 400);
    const context = canvas.getContext('2d');
    context.fillStyle = '#d22b28';
    context.strokeStyle ='#ffffff';
    const background = await loadImage('./assets/board.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    let position;
    for (position = 0; position < playerTiles.length; position++) {
      const tile = playerTiles[position];
      const back = await loadImage('./assets/Front.png')
      context.drawImage(back, 110*(position+1), 100, 100, 120);
      const face = await loadImage(tile.imageValue);
      context.drawImage(face, 110*(position+1), 100, 100, 120);
      context.font = applyText(canvas, `${position+1}`);
      context.fillText(`${position+1}`, position > 9 ? 20+110*(position+1) : 30+110*(position+1), 300);
      context.strokeText(`${position+1}`, position > 9 ? 20+110*(position+1) : 30+110*(position+1), 300);
    }

    if(playerOpenTiles.length > 0) {
      context.font = applyText(canvas, `Open tiles`);
      context.fillText(`Open tiles`, position > 9 ? 20+110*(position+1) : 30+110*(position+1), 300);
      context.strokeText(`Open tiles`, position > 9 ? 20+110*(position+1) : 30+110*(position+1), 300);
      for (let i = 0;i < playerOpenTiles.length; i) {
        const tileSet = playerOpenTiles[i];
        if(tileSet.length === 3) {
          const back1 = await loadImage('./assets/Front.png')
          context.drawImage(back1, 110*(position+1), 100, 100, 120);
          const face1 = await loadImage(tile.image1);
          context.drawImage(face1, 110*(position+1), 100, 100, 120);
          position++;
          const back2 = await loadImage('./assets/Front.png')
          context.drawImage(back2, 110*(position+1), 100, 100, 120);
          const face2 = await loadImage(tile.imag2);
          context.drawImage(face2, 110*(position+1), 100, 100, 120);
          position++;
          const back3 = await loadImage('./assets/Front.png')
          context.drawImage(back3, 110*(position+1), 100, 100, 120);
          const face3 = await loadImage(tile.image3);
          context.drawImage(face3, 110*(position+1), 100, 100, 120);
          position++
        } else {
          for (let index = 0; index < tileSet.length; index++) {
            const back1 = await loadImage('./assets/Front.png')
            context.drawImage(back1, 110*(position+1), 100, 100, 120);
            const face1 = await loadImage(tile.image1);
            context.drawImage(face1, 110*(position+1), 100, 100, 120);
            position++;
          }
        }
      }
    }
    return new AttachmentBuilder(await canvas.encode('png'), {
      name: 'player-hand.png'
    });
  }

  async createNotTheTurnHandImage (playerTiles) {
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
    }
    context.font = applyText(canvas, `It is not your turn, this is just what your hand is ok bye`);
      context.fillText(`It is not your turn, this is just what your hand is ok bye`, 20+110, 300);
      context.strokeText(`It is not your turn, this is just what your hand is ok bye`, 20+110, 300);
    return new AttachmentBuilder(await canvas.encode('png'), {
      name: 'player-display-hand.png'
    });
  }

  async createBoardImage (playerId) {
    let game = this.gamesDictionary[playerId];
    let discardPile = game.discardPile;
    const canvas = createCanvas(1000, 1000);
    const context = canvas.getContext('2d');
    context.fillStyle = '#d22b28';
    context.strokeStyle ='#ffffff';
    const background = await loadImage('./assets/board.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    let seatPositionCounter = 1;
    let rowPositionCounter = 1;
    for (let i = 0; i < discardPile.length; i++) {
      const tile = discardPile[i];
      const back = await loadImage('./assets/Front.png')
      const face = await loadImage(tile.imageValue);
      switch (seatPositionCounter) {
        case 1:
          context.drawImage(back, 110*(rowPositionCounter), 900, 100, 120);
          context.drawImage(face, 110*(rowPositionCounter), 900, 100, 120);
          break;
        case 2:
          context.rotate(90);
          context.drawImage(back, 100, 110*(rowPositionCounter), 100, 120);
          context.drawImage(face, 100, 110*(rowPositionCounter), 100, 120);
        case 3:
          context.rotate(180);
          context.drawImage(back, 110*(rowPositionCounter), 100, 100, 120);
          context.drawImage(face, 110*(rowPositionCounter), 100, 100, 120);
        case 4:
          context.rotate(270);
          context.drawImage(back, 900, 110*(rowPositionCounter), 100, 120);
          context.drawImage(face, 900, 110*(rowPositionCounter), 100, 120);
        default:
          break;
      }
      if(seatPositionCounter === 4) {
        seatPositionCounter = 1;
        if(rowPositionCounter === 7) {
          rowPositionCounter = 1
        } else {
          rowPositionCounter +=1
        }
      } else {
        seatPositionCounter +=1
      }
    }
    return new AttachmentBuilder(await canvas.encode('png'), {
      name: 'mahjong-board-image.png'
    });
  }
}
let gameMaker = new GameMaker();
const _gameMaker = gameMaker;
exports.gameMaker = _gameMaker;