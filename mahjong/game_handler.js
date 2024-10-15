const Player = require("../dataTypes/player.js");
const PlayerHand = require("../dataTypes/player_hand.js");
const MahjongTheGame = require("./mainjong.js");
const { gameMaker } = require('./game_maker.js');
class GameHandler {
  constructor() {
    this.gamesDictionary = {};
  }
  createGame(playerIds, imageList) {
    let playerList = [];
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
      playerList.push(new Player(new PlayerHand([]), null, playerIds[i], i + 10, imageList[i]));
      gameMaker.updateGameDictionary(this.gamesDictionary);
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

  performDraw(playerId) {
    let game = this.gamesDictionary[playerId];
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      return game.drawTile(...player, 1);
  }

  performSteal(playerId) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      let result = game.performSteal(...player);
      if(Number.isInteger(result)) {
        this.gamesDictionary.forEach((values, keys) => {
          if(keys === game) this.gamesDictionary.delete(game);
        });
        return [...player.hand, game.players, result];
      } else if(typeof result === 'string') {
        return result;
      }
      return [result, ...player.seatPosition];
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
      
      return result;
    }
    return 'You\'re not in a game';
  }

  performTsumo(playerId) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      let result = game.performTsumo(...player);
      if(Number.isInteger(result)) {
        for (let i = 0; i < game.players.length; i++) {
          delete this.gamesDictionary[game.players[i].id]
        }
        return [player[0].hand, game.players, result, game.players];
      }
      return result;
    }
    return 'You\'re not in a game';
  }
}
let gameHandler = new GameHandler();
const _gameHandler = gameHandler;
exports.gameHandler = _gameHandler;