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

    findSets(hand) {
        const subsets = hand.groupByType();
        console.log("Subsets:" + subsets)

        const result_sets = new Map();
        result_sets.set(TileTypes.Bamboo, []);
        result_sets.set(TileTypes.Coin, []);
        result_sets.set(TileTypes.Character, []);
        

        for (const tile_type of result_sets.keys()) {
            result_sets.set(tile_type, this.findSetsInSubset(subsets[tile_type]))
        }
        console.log(result_sets);
        console.log("\nGot results: ")
        for (const tile_type of result_sets.keys()) {
            console.log(`For type ${tile_type}`)
            for (result of result_sets.get(tile_type)) {
                console.log(result)
            }
        }
    }

    findSetsInSubset(subset) {
    // The loops here go through each tile and compare it with every following
    // two tiles in the list

    const results = [];
    for (let i = 0; i < subset.length - 2; i++) {
        for (let j = i + 1; j < subset.length - 1; j++) {
            console.log("Comparing indexes " + i + " with " + j + " and " + (j+1));
            console.log(subset[i].value)
            console.log(subset[j].value)
            console.log(subset[j + 1].value)
            console.log('Are they equal ' + (subset[i].value === subset[j].value === subset[j + 1].value))
            console.log('are they ascending ' + ((subset[i].value+2) === (subset[j].value + 1) === subset[j + 1].value));
            if ((subset[i].value === subset[j].value === subset[j + 1].value) || ((subset[i].value+2) === (subset[j].value + 1) === subset[j + 1].value)) {
                const validCombo = [subset[i], subset[j], subset[j + 1]];
                console.log("Its a valid combo!");
                const subsubset = structuredClone(subset);
                subsubset.splice(j, 2);
                subsubset.splice(i, 1);

                const possible_subsets = this.findSetsInSubset(subsubset.slice(i));
                if (!possible_subsets) {
                    results.push([validCombo])
                }
                for (possibility in possible_subsets) {
                    results.push([validCombo] + possibility)
                }
            }
        }
    }
    return results
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
testMahjong.findSets(player4.hand);
// console.log(testMahjong.discardPile);
const fakeHand = [
    MahjongTile (
      'CHARACTER',
      1,
      '../assets/Man1',
      false,
      false,
      false
    ),
    MahjongTile (
      'CHARACTER',
      4,
      '../assets/Man4',
      false,
      false,
      false
    ),
    MahjongTile (
      'CHARACTER',
      4,
      '../assets/Man4',
      false,
      false,
      false
    ),
    MahjongTile (
      'CHARACTER',
      4,
      '../assets/Man4',
      false,
      false,
      false
    ),
    MahjongTile (
      'BAMBOO',
      3,
      '../assets/Sou3',
      false,
      false,
      false
    ),
    MahjongTile (
      'BAMBOO',
      5,
      '../assets/Sou5-Dora',
      false,
      false,
      true
    ),
    MahjongTile (
      'BAMBOO',
      7,
      '../assets/Sou7',
      false,
      false,
      false
    ),
    MahjongTile (
      'COIN',
      6,
      '../assets/Pin6',
      false,
      false,
      false
    ),
    MahjongTile (
      'COIN',
      7,
      '../assets/Pin7',
      false,
      false,
      false
    ),
    MahjongTile (
      'COIN',
      8,
      '../assets/Pin8',
      false,
      false,
      false
    ),
    MahjongTile (
      'WIND',
      11,
      '../assets/South',
      false,
      true,
      false
    ),
    MahjongTile (
      'DRAGON',
      15,
      '../assets/Green',
      false,
      true,
      false
    ),
    MahjongTile (
      'DRAGON',
      16,
      '../assets/White',
      false,
      true,
      false
    )
  ]
  