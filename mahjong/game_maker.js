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
const { request } = require('undici');

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

  updateGameDictionary(dictionary) {
    this.gamesDictionary = dictionary
  }

  async createEndScreenImage(winningHand, winnerImage, playerHands, score, playerImages) {
    const canvas = createCanvas(1750, 1000);
    const context = canvas.getContext('2d');
    context.fillStyle = '#d22b28';
    context.strokeStyle ='#ffffff';
    const background = await loadImage('./assets/board.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = applyText(canvas, `Your final score is: ${score}`);
    context.fillText(`Your final score is: ${score}`, 100, 100);
    context.strokeText(`Your final score is: ${score}`, 100, 100);
    const { body } = await request(winnerImage);
	  const avatar = await loadImage(await body.arrayBuffer());
    context.drawImage(avatar, 50, 200, 100, 120);
    await this.createPlayerRowTiles(winningHand, context, 160, 200, 100, 120, false, 0, 100, 0);
    
    for (let i = 0; i < playerHands.length; i++) {
      const { body1 } = await request(playerImages[i]);
	    const avatar1 = await loadImage(playerImages[i]);
      context.drawImage(avatar1, 50, 400+i*200, 100, 120);

      await this.createPlayerRowTiles(playerHands[i], context, 160, 400 + i*200, 100, 120, false, 0, 100, 0);
    }

    return new AttachmentBuilder(await canvas.encode('png'), {
      name: 'player-hand.png'
    });
  }

  async createHandImage (playerHand) {
    const canvas = createCanvas(2000, 400);
    const context = canvas.getContext('2d');
    context.fillStyle = '#d22b28';
    context.strokeStyle ='#ffffff';
    const background = await loadImage('./assets/board.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    await this.createPlayerRowTiles(playerHand, context, 110, 100, 100, 120, false, 0, 110, 0);
    await this.createPlayerRowText(playerHand, canvas, context, 110, 110, 300, 0);

    return new AttachmentBuilder(await canvas.encode('png'), {
      name: 'player-hand.png'
    });
  }

  async createPlayerRowTiles(playerHand, context, tileX, tileY, tileWidth, tileHeight, isFlippedTile, rotation, offsetX, offsetY) {
    let playerTiles = playerHand.tiles;
    let playerOpenTiles = playerHand.openHand;
    let position;
    if(isFlippedTile) {
      for (position = 0; position < playerTiles.length; position++) {
        const back = await loadImage('./assets/Back.png')
        this.drawImageRot(context, back, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
       }
    } else {
      for (position = 0; position < playerTiles.length; position++) {
        const tile = playerTiles[position];
        const back = await loadImage('./assets/Front.png')
        this.drawImageRot(context, back, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
        const face = await loadImage(tile.imageValue);
        this.drawImageRot(context, face, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
       }
    }

    if(playerOpenTiles.length > 0) {
      for (let i = 0;i < playerOpenTiles.length; i++) {
        const tileSet = playerOpenTiles[i];
        if(tileSet.length === 3) {

          const back1 = await loadImage('./assets/Front.png')
          this.drawImageRot(context, back1, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
          const face1 = await loadImage(tileSet.image1);
          this.drawImageRot(context, face1, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
          position++;
          const back2 = await loadImage('./assets/Front.png')
          this.drawImageRot(context, back2, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
          const face2 = await loadImage(tileSet.image2);
          this.drawImageRot(context, face2, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
          position++;
          const back3 = await loadImage('./assets/Front.png')
          this.drawImageRot(context, back3, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
          const face3 = await loadImage(tileSet.image3);
          this.drawImageRot(context, face3, tileX + offsetX*(position), tileY+offsetY*position, tileWidth, tileHeight, rotation);
          position++
        } else {
          for (let index = 0; index < tileSet.length; index++) {
            const back1 = await loadImage('./assets/Front.png')
            this.drawImageRot(context, back1, tileX + offsetX*(position), tileY+offsetY*position, 100, 120, rotation);
            const face1 = await loadImage(tileSet.image1);
            this.drawImageRot(context, face1, tileX + offsetX*(position), tileY+offsetY*position, 100, 120, rotation);
            position++;
          }
        }
      }
    }
  }

  async createPlayerRowText (playerHand, canvas, context, textX, textY, textWidth) {
    let playerTiles = playerHand.tiles;
    let playerOpenTiles = playerHand.openHand;
    
    let position;
    for (position = 0; position < playerTiles.length; position++) {
      context.font = applyText(canvas, `${position+1}`);
      context.fillText(`${position+1}`, position > 9 ? 20+textX*(position+1) : 30+textY*(position+1), textWidth);
      context.strokeText(`${position+1}`, position > 9 ? 20+textX*(position+1) : 30+textY*(position+1), textWidth);
    }

    if(playerOpenTiles.length > 0) {
      context.font = applyText(canvas, `Open tiles`);
      context.fillText(`Open tiles`, position > 9 ? 20+110*(position+1) : 30+textY*(position+1), textWidth);
      context.strokeText(`Open tiles`, position > 9 ? 20+110*(position+1) : 30+textY*(position+1), textWidth);
    }
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

  async createBoardImage (playerId, seatPosition) {
    let game = this.gamesDictionary[playerId];
    let discardPile = game.discardPile;
    const canvas = createCanvas(1000, 1000);
    const context = canvas.getContext('2d');
    context.fillStyle = '#d22b28';
    context.strokeStyle ='#ffffff';
    const background = await loadImage('./assets/board.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    let columnPositionCounter1 = 0;
    let rowPositionCounter1 = 0;
    let columnPositionCounter2 = 0;
    let rowPositionCounter2 = 0;
    let columnPositionCounter3 = 0;
    let rowPositionCounter3 = 0;
    let columnPositionCounter4 = 0;
    let rowPositionCounter4 = 0;
    for (let i = 0; i < discardPile.length; i++) {
      const tile = discardPile[i];
      const back = await loadImage('./assets/Front.png')
      const face = await loadImage(tile.imageValue);
      switch (tile.discardedByWhom) {
        case 0:
          this.drawImageRot(context, back, 400 + 55*(rowPositionCounter1), 675 + 65*columnPositionCounter1, 50, 60, 0);
          this.drawImageRot(context, face, 400 + 55*(rowPositionCounter1), 675 + 65*columnPositionCounter1, 50, 60, 0);
          rowPositionCounter1++
          if(rowPositionCounter1 === 6) {
            columnPositionCounter1++
            rowPositionCounter1 = 0
          }
          break;
        case 1:
          this.drawImageRot(context, back, 325 - 65*(columnPositionCounter2), 400 + 55*rowPositionCounter2, 50, 60, 90);
          this.drawImageRot(context, face, 325 - 65*(columnPositionCounter2), 400 + 55*rowPositionCounter2, 50, 60, 90);
          rowPositionCounter2++
          if(rowPositionCounter2 === 6) {
            columnPositionCounter2++
            rowPositionCounter2 = 0
          }
          break;
        case 2:
          this.drawImageRot(context, back, 600 - 55*(rowPositionCounter3), 325 - 65*columnPositionCounter3, 50, 60, 180);
          this.drawImageRot(context, face, 600 - 55*(rowPositionCounter3), 325 - 65*columnPositionCounter3, 50, 60, 180);
          rowPositionCounter3++
          if(rowPositionCounter3 === 6) {
            columnPositionCounter3++
            rowPositionCounter3 = 0
          }
          break;
        case 3:
          this.drawImageRot(context, back, 600 + 65*(columnPositionCounter4), 675 - 55*rowPositionCounter4, 50, 60, 270);
          this.drawImageRot(context, face, 600 + 65*(columnPositionCounter4), 675 - 55*rowPositionCounter4, 50, 60, 270);
          rowPositionCounter4++
          if(rowPositionCounter4 === 6) {
            columnPositionCounter4++
            rowPositionCounter4 = 0
          }
          break;
        default:
          break;
      }
    }

    await this.createPlayerRowTiles(game.players[0].hand, context, 63, 900, 50, 60, seatPosition != 10, 0, 55, 0);

    if(game.players.length >= 2)
      await this.createPlayerRowTiles(game.players[1].hand, context, 63, 63, 50, 60, seatPosition != 11, 90, 0, 55);


    if(game.players.length >= 3)
      await this.createPlayerRowTiles(game.players[2].hand, context, 900, 63, 50, 60, seatPosition != 12, 180, -55, 0);

    if(game.players.length >= 4)
      await this.createPlayerRowTiles(game.players[3].hand, context, 900, 900, 50, 60, seatPosition != 13, 270, 0, -55);

    
    
    return new AttachmentBuilder(await canvas.encode('png'), {
      name: 'mahjong-board-image.png'
    });
  }

  async drawImageRot(ctx,img,x,y,width,height,deg){
    // Store the current context state (i.e. rotation, translation etc..)
    ctx.save();

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    // Restore canvas state as saved from above
    ctx.restore();
}
}
let gameMaker = new GameMaker();
const _gameMaker = gameMaker;
exports.gameMaker = _gameMaker;