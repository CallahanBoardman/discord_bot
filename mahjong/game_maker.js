const Player = require("../dataTypes/player.js");
const PlayerHand = require("../dataTypes/player_hand.js");
const MahjongTheGame = require("./mainjong.js");
class GameMaker {
  constructor() {
    this.gamesDictionary = {};
  }
  async createGame(playerIds) {
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
      const user = await client.users.fetch(playerId[i]).catch(e => console.log(e));
      if (!user) {
        return 'Someone in there does not have a valid id';
        continue;
      }
      await user.send(reminder.ReminderMessage).catch(() => {
        return "User has DMs closed or has no mutual servers with the bot :(";
      });
    }
    const aGameOfMahjong = new MahjongTheGame(playerList);
    for (let i = 0; i < playerIds.length; i++) {
      this.gamesDictionary[playerIds[i]] = aGameOfMahjong;
    }
    aGameOfMahjong.gameSetup();
    return 'Game Created';
  }
  performDiscard(playerId, input) {
    let game = this.gamesDictionary[playerId];
    if (game) {
      const player = game.players.filter(obj => {
        return obj.id === playerId;
      });
      console.log(...player)
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
}
let gameMaker = new GameMaker();
const _gameMaker = gameMaker;
exports.gameMaker = _gameMaker;