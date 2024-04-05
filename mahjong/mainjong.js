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
    this.drawPile = generateTileset().sort((a, b) => 0.5 - Math.random());
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
    hand.tiles.sort((a, b) => (this.tileOrder.indexOf(a.tileType) * 10 + a.value)
      - (this.tileOrder.indexOf(b.tileType) * 10 + b.value))
  }

  discardTile(hand, tileToDiscard) {
    this.discardPile.push(hand.tiles.splice(tileToDiscard - 1, 1))
  }

  stealAttempt(player, stealType) {
    if (this.isValidSteal(player, stealType)) {
      player.hand.tiles.push(this.discardPile.pop());
      this.sortHand(player.hand.tiles)
      return (stealType)
    } else {
      return (`Thats not a valid ${stealType}`);
    }
  }

  performChi() {

  }

  performPon() {

  }

  performKan() {

  }

  performRon() {

  }

  performTsumo(player) {
    const results = this.findSets(player.hand)
    if(results.size > 0) {
      const score = this.calculateHandValue
      if(score === 0) {
        return 'Your hand is complete, however it has zero value. Refer to the mahjong handbook with !scoring to see where you messed up';
      }
      return `Victory! your hand is worth: ${score} points!`;
    }

    return 'Your hand is bogus';
  }

  calculateHandValue(comboMap) {

  }

  isValidSequence(tile1, tile2, tile3) {
    if (tile1.value + 1 === tile2.value) {
      if (tile2.value + 1 === tile3.value) {
        return true;
      }
    }
    return false;
  }

  isValidDouble(tile1, tile2) {
    if (tile1.value === tile2.value) {
      return true
    }
    return false
  }

  isValidTriplet(tile1, tile2, tile3) {
    if (tile1.value === tile2.value) {
      if (tile2.value === tile3.value) {
        return true
      }
    }
    return false
  }

  isValidQuadruplet(tile1, tile2, tile3, tile4) {
    if (tile1.value === tile2.value) {
      if (tile2.value === tile3.value) {
        if (tile3.value === tile4.value) {
          return true
        }
      }
    }
    return false
  }

  findSets(hand) {
    const subsets = hand.groupByType();

    const result_sets = new Map();
    result_sets.set(TileTypes.Bamboo, []);
    result_sets.set(TileTypes.Coin, []);
    result_sets.set(TileTypes.Character, []);
    result_sets.set(TileTypes.Wind, []);
    result_sets.set(TileTypes.Dragon, []);

    for (const tile_type of result_sets.keys()) {
      if (tile_type === TileTypes.Dragon || tile_type === TileTypes.Wind) {
        result_sets.set(tile_type, this.findSetsInSubset(subsets[tile_type], true))
      } else {
        result_sets.set(tile_type, this.findSetsInSubset(subsets[tile_type], false))
      }
    }

    let invalidCount = 0;
    let poCount = 0;
    for (const tile_type of result_sets.keys()) {
      console.log(`For type ${tile_type}`)
      const result = result_sets[result_sets[tile_type].length - 1].get(tile_type)
      if (result.length == 2) {
        if (result[0].value === result[1].value) {
          poCount += 1;
        } else {
          invalidCount += 1;
        }
      } else {
        invalidCount += 1;
      }
    }
    if (invalidCount === 0 || poCount === 1) {
      return result_sets;
    }
    return {};
  }

  findSetsInSubset(subset, isHonor) {
    // The loops here go through each tile and compare it with every following
    // two tiles in the list

    const results = [];
    let last = null;
    for (let i = 0; i < subset.length - 2; i++) {
      if (subset[i].value === last) {
        continue
      }
      last = subset[i].value
      for (let j = i + 1; j < subset.length - 1; j++) {
        const isSequence = this.isValidSequence(subset[i], subset[j], subset[j + 1]) && !isHonor
        const isTriplet = this.isValidTriplet(subset[i], subset[j], subset[j + 1])
        if (isTriplet || isSequence) {
          const validCombo = [subset[i], subset[j], subset[j + 1]];
          const subsubset = structuredClone(subset);
          // console.log(subsubset);

          subsubset.splice(j, 2);
          subsubset.splice(i, 1);
          // console.log(subsubset);
          const possible_subsets = this.findSetsInSubset(subsubset);
          if (possible_subsets.length === 0) {
            results.push([validCombo, subsubset]);
          }

          for (const possibility of possible_subsets) {
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

// testMahjong.gameSetup();
// console.log(player4.hand);
// testMahjong.discardTile(player4.hand, 5);
// console.log(player1.hand);
// console.log(player2.hand);
// console.log(player3.hand);
// console.log(player4.hand.tiles);
// testMahjong.findSets(player4.hand);
// console.log(testMahjong.discardPile);
const fakeHand = new PlayerHand([
  new MahjongTile(
    'CHARACTER',
    1,
    '../assets/Man1',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    1,
    '../assets/Man1',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    4,
    '../assets/Man4',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    4,
    '../assets/Man4',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    4,
    '../assets/Man4',
    false,
    false,
    false
  ),
  new MahjongTile(
    'BAMBOO',
    4,
    '../assets/Sou4',
    false,
    false,
    false
  ),
  new MahjongTile(
    'BAMBOO',
    5,
    '../assets/Sou5-Dora',
    false,
    false,
    true
  ),
  new MahjongTile(
    'BAMBOO',
    6,
    '../assets/Sou6',
    false,
    false,
    false
  ),
  new MahjongTile(
    'COIN',
    5,
    '../assets/Pin5',
    false,
    false,
    false
  ),
  new MahjongTile(
    'COIN',
    6,
    '../assets/Pin6',
    false,
    false,
    false
  ),
  new MahjongTile(
    'COIN',
    7,
    '../assets/Pin7',
    false,
    false,
    false
  ),
  new MahjongTile(
    'DRAGON',
    15,
    '../assets/Green',
    false,
    true,
    false
  ),
  new MahjongTile(
    'DRAGON',
    15,
    '../assets/Green',
    false,
    true,
    false
  ),
  new MahjongTile(
    'DRAGON',
    15,
    '../assets/Green',
    false,
    true,
    false
  )
]);

testMahjong.findSets(fakeHand);