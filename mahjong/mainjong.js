const MahjongTile = require('../dataTypes/mahjong_tile');
const Player = require('../dataTypes/player');
const PlayerHand = require('../dataTypes/player_hand');
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
        for (let i = 0; i <= amount; i++) {
            hand.tiles.push(this.drawPile.pop());
        }
    }

    sortHand(hand) {
        hand.tiles.sort((a,b) => (this.tileOrder.indexOf(a.tileType) * 10 + a.value)
         - (this.tileOrder.indexOf(b.tileType) * 10 + b.value))
    }

    discardTile(hand, tileToDiscard) {
        this.discardPile.push(hand.tiles.splice(tileToDiscard - 1, 1))
    }

    stealAttempt(player, stealType) {
        if(this.isValidSteal(player, stealType)) {
            player.hand.tiles.push(this.discardPile.pop());
            this.sortHand(player.hand.tiles)
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

    containsValidChi(comparingTile, tileList) {
        //[111222333444]
        //3
        //[2223 33444]
        //[234234234]
        const validChiNumbers = []
        for (let index = 0; tileList[index].value < comparingTile.value + 1; index++) {
            let value = tileList[index].value;
            if(value === tile.value || value === tile.value + 1 || value === tile.value-1) {
                validChiNumbers.push(tileList[index]);
            }
        }
        validChiNumbers.sort((a, b) => a === b ? movetoback : check if more or less and then move)
        const validChis = []
        
    }

    containsDuplicateTiles(comparingTile, tileList) {
        let results = [];
        for (const tile of tileList) {
            if (tile.value === comparingTile.value) {
                results.push(tile);
            }
        }
        return results;
    }
    
    handEvalution(hand, ) {
        this.sortHand(hand.tiles)
        const checkingMap = hand.groupByType();
        const validSets = {};
        validSets.set('Po', []);
        validSets.set('Pon', []);
        validSets.set('Kan', []);
        validSets.set('Chi', []);
        
        for (const [type, tileList] of checkingMap.entries()) {
            // [b1, b1, b1, b1, b2, b2, b2, c1, c2, c3, c4, c5, c6, w11, w11]
            for (const tile of tileList) {
                //for each tile in the tileList, check if it has valid pos, pons, kans, or chis
                //with each 
                duplicateTiles = this.containsDuplicateTiles(tile, tileList);
                if (duplicateTiles.length() >= 2) {
                    validSets['Po'].push([duplicateTiles[0], duplicateTiles[1]]);
                    if(duplicateTiles.length() >= 3) {
                        validSets['Pon'].push([duplicateTiles[0], duplicateTiles[1], duplicateTiles[2]]);
                        if(duplicateTiles.length() === 4) {
                            validSets['Kan'].push([duplicateTiles[0], duplicateTiles[1], duplicateTiles[2], duplicateTiles[3]]);
                        }
                    }
                    
                }
                //rework the chi function into getting valid chi's from an unordered list
                if(tile.value < 10 || tileList.length) {
                    if (this.containsDuplicateTiles(tile1, tile2, tile3)) {
                        validSets['Chi'].push([tile1, tile2, tile3]);
                    }
                }  
            }
        }
        
        //stealing/ron
        //you are stealing from an opponent, check if your steal is valid,
        //in case of ron, check if you have won
        //riichi
        //you are one tile away from victory, check if this is true
        //tsumo
        //you have just drawn your last tile, check if you have won

        //hand: [b1, b1, b1, b2, b2, b2, c1, c2, c3, c4, c5, c6, w11, w11]
        //problem hand: [c1, c9, b1, b9, p1, p9, w10, w11, w12, w13, d14, d15, d16]
        //problem hand: [b1, b1, b2, b2, b3, b3, b4, b4, b5, b5, b6, b6, w11, w11]
        //problem hand: [b1, b1, b1, b2, b2, b2, b3, b3, b3, c4, c5, c6, w11, w11]
        // pon [[b1, b1, b1], [b2, b2, b2]] chi [[c1, c2, c3], [c4, c5, c6]]
        // po [[b1, b1], [b1, b1], [b2, b2,], [b2, b2], [w11, w11]], kan[]
    }
}

let player1 = new Player(new PlayerHand([]), null, 1);
let player2 = new Player(new PlayerHand([]), null, 2);
let player3 = new Player(new PlayerHand([]), null, 3);
let player4 = new Player(new PlayerHand([]), null, 4);
const testMahjong = new MahjongTheGame([player4]);

testMahjong.gameSetup();
// console.log(player4.hand);
testMahjong.discardTile(player4.hand, 5);
// console.log(player1.hand);
// console.log(player2.hand);
// console.log(player3.hand);
console.log(player4.hand.tiles);
console.log(player4.hand.groupByType());
// console.log(testMahjong.discardPile);