const MahjongTile = require('../dataTypes/mahjong_tile');
const Player = require('../dataTypes/player');
const generateTileset = require('./tileset')
const TileTypes = require('../dataTypes/tile_types');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

class MahjongTheGame {
    constructor(players) {
        this.players = players;
        this.drawPile = [];
        this.discardPile = [];
        this.tileOrder = Object.values(TileTypes);
        this.whosTurn = 0;
    }

    gameSetup() {
        this.drawPile = generateTileset().sort((a,b) => 0.5 - Math.random());
        for (let i = 0; i < this.players.length; i++) {
            this.drawTile(this.players[i].hand, 13);
            this.sortHand(this.players[i].hand)
        }
    }

    drawTile(hand, amount) {
        for (let i = 0; i < amount; i++) {
            hand.push(this.drawPile.pop());
        }
    }

    sortHand(hand) {
        hand.sort((a,b) => (this.tileOrder.indexOf(a.tileType) * 10 + a.value)
         - (this.tileOrder.indexOf(b.tileType) * 10 + b.value))
    }

    discardTile(hand, tileToDiscard) {
        this.discardPile.push(hand.splice(tileToDiscard - 1, 1))
    }

    stealAttempt(player, stealType) {
        if(this.isValidSteal(player, stealType)) {
            player.hand.push(this.discardPile.pop());
            this.sortHand(hand)
            return(stealType)
        } else {
            return(`Thats not a valid ${stealType}`);
        }
    }
    
    isValidSteal(player, stealType) {
        if(stealType == 'Chi') {
            
        } else if(stealType == 'Pon') {
            
        } else if(stealType == 'Ron') {

        } else if(stealType == 'Kan') {
            
        }
        return false;
    }

    isValidChi(tile1, tile2, tile3) {
        if(!tile1.isHonorTile || !tile2.isHonorTile || !tile3.isHonorTile) {
            if(tile1.tileType === tile2.tileType 
                && tile2.tileType === tile3.tileType) {
                    let diff = tile2.value - tile1.value;
                    if(Math.abs(diff) === 1 && tile2.value + diff === tile3.value) {
                        return true;
                    }
            }
        }
        return false
    }

    isValidPon(tile1, tile2, tile3) {
        if(tile1.tileType === tile2.tileType 
            && tile2.tileType === tile3.tileType) {
                if(tile1.value === tile2.value && tile2.value === tile3.value) {
                    return true;
                }
            }
        return false
    }
    
    handEvalution() {

    }
}

let player1 = new Player([], null, 1);
let player2 = new Player([], null, 2);
let player3 = new Player([], null, 3);
let player4 = new Player([], null, 4);
const testMahjong = new MahjongTheGame([player4]);

testMahjong.gameSetup();
console.log(player4.hand);
testMahjong.discardTile(player4.hand, 5);
// console.log(player1.hand);
// console.log(player2.hand);
// console.log(player3.hand);
console.log(player4.hand);
console.log(testMahjong.discardPile);