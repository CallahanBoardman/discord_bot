const MahjongTile = require('../dataTypes/mahjong_tile');
const Player = require('../dataTypes/player');
const generateTileset = require('./tileset')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
class MahjongTheGame {
    constructor(players) {
        this.players = players;
        this.drawPile = [];
        this.discardPile = [];
    }

    gameSetup() {
        this.drawPile = generateTileset().sort((a,b) => 0.5 - Math.random());
        for (let i = 0; i < this.players.length; i++) {
            this.drawTile(this.players[i].hand, 13);
        }
    }

    drawTile(hand, amount) {
        for (let i = 0; i < amount; i++) {
            hand.push(this.drawPile.pop());
        }
    }
}

let player1 = new Player([], null, 1);
let player2 = new Player([], null, 2);
let player3 = new Player([], null, 3);
let player4 = new Player([], null, 4);
const testMahjong = new MahjongTheGame([player1]);

testMahjong.gameSetup();
console.log(player1.hand);
console.log(player1.hand);
console.log(player1.hand);
console.log(player1.hand);