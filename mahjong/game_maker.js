import Player from "../dataTypes/player.js";
import PlayerHand from "../dataTypes/player_hand.js";
import MahjongTheGame from "./mainjong.js";

class GameMaker {
    constructor() {
        this.gamesDictionary = {};
    }

    createGame(playerIds) {
        let playerList = []
        for(let i = 0; i < playerIds.length; i++) {
            playerList.push(new Player(new PlayerHand([]), null, playerIds[i], i + 10));
        }
        const aGameOfMahjong = new MahjongTheGame(playerList);
        for(let i = 0; i < playerIds.length; i++) {
            this.gamesDictionary[playerIds[i]] = aGameOfMahjong;
        }
        console.log(this.gamesDictionary)
        aGameOfMahjong.gameSetup();
        console.log(aGameOfMahjong.players[0].hand.tiles);
    }

    performDiscard(playerId, input) {
        let game = this.gamesDictionary[playerId];
        if(!game) {
                const player = game.players.filter(obj => {
                    return obj.id === playerId;
                })
                return game.discardTile(player, input);
            }
            return 'You\'re not in a game'
    }

    performSteal(playerId, commandType, input) {
        let game = this.gamesDictionary[playerId];
        if(!game) {
            const player = game.players.filter(obj => {
                return obj.id === playerId;
              })
            return game.performSteal(player);
        }
        return 'You\'re not in a game'
    }
}

let gameMaker = new GameMaker();

const _gameMaker = gameMaker;
export { _gameMaker as gameMaker };