import MahjongTile from '../dataTypes/mahjong_tile.js';
import Player from '../dataTypes/player.js';
import PlayerHand from '../dataTypes/player_hand.js';
import generateTileset from './tileset.js';
import TileTypes from '../dataTypes/tile_types.js';
import MahjongSet from '../dataTypes/mahjong_set.js';
import MahjongScoring from './mahjong_scoring.js';
import fakeHands from '../tests/MahjongTests/fake_mahjong_hands.js';

class MahjongTheGame {
  constructor(players) {
    this.roundWind = 1;
    this.players = players;
    this.drawPile = [];
    this.discardPile = [];
    this.doraTiles = [];
    this.uraDoraTiles =[];
    this.kanTiles = [];
    this.kanAmount = 0;
    this.tileOrder = Object.values(TileTypes);
    this.whosTurn = 0;
    this.mahjongScoring = new MahjongScoring(this.drawPile, this.roundWind);
  }

  gameSetup() {
    this.drawPile = generateTileset().sort((a, b) => 0.5 - Math.random());
    this.createDeadWall();
    for (let i = 0; i < this.players.length; i++) {
      this.drawTile(this.players[i].hand, 13);
      this.sortHand(this.players[i].hand)
    }
  }

  createDeadWall() {
    this.kanAmount = 0;
    this.doraTiles = this.drawPile.slice(0, 5);
    this.uraDoraTiles = this.drawPile.slice(0, 5);
    this.kanTiles = this.drawPile.slice(0, 4);

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

  discardTile(player, tileToDiscard) {
    if(player.seatPosition !== this.whosTurn + 10) {
      return 'Its not your turn bub';
    }
    if(tileToDiscard > 13 || tileToDiscard < 1) {
      return 'Thats not a valid tile silly!'
    }
    this.discardPile.push(player.hand.tiles.splice(tileToDiscard - 1, 1)[0])
    this.whosTurn < this.players.length ? this.whosTurn+= 1 : this.whosTurn = 0;
    return player.hand.tiles.toString();
  }

  performSteal(player) {
    const copiedHand = player.hand;
    const discardedTile = this.discardPile[this.discardPile.length - 1]
    if (!discardedTile) {
      return 'Theres nothing to steal!';
    }
    copiedHand.tiles.push(discardedTile)
    this.sortHand(copiedHand);
    const results = this.findSets(copiedHand);
    //TODO: UNBREAK HAND STEALING
    // const handValue = this.calculateHandValue(results, copiedHand.openHand)

    // if(handValue != 0) {
    //   return 'This wins you the game, use Ron instead.'
    // }

    // if(this.isValidHand(results)) {
    const setList = results.get(discardedTile.tileType);
    for (let i = 0; i < setList.length - 1; i++) {
      if (setList[i].includes(discardedTile)) {
        this.discardPile.pop();
        this.addToOpenHand(player.hand, setList[i])
        this.whosTurn = player.seatPosition - 10
        return 'Valid steal.';
      }
    }

    // }
    return 'You cannot steal that.'
  }

  addToOpenHand(hand, openSet) {
    hand.tiles = hand.tiles.filter((tile) => !openSet.includes(tile));
    hand.openHand.push(openSet);
  }

  performKan(player) {
    add
  }

  performRon() {

  }

  checkForFancyHands(hand) {
    const greenTiles = [2, 3, 4, 6, 8, 15];
    let isGreenHand = true;
    let is13Orphans = true;

    for(tile of hand.tiles) {

    }
  }

  performTsumo(player) {
    const results = this.findSets(player.hand)
    if (results.size > 0) {
      const score = this.mahjongScoring.calculateHandValue(results, player.openHand)
      if (score === 0) {
        return 'Your hand is complete, however it has zero value. Refer to the mahjong handbook with !scoring to see where you messed up';
      }
      return `Victory! your hand is worth: ${score} points!`;
    }

    return 'Your hand is bogus';
  }

  isValidHand(comboMap) {
    let invalidCount = 0;
    let poCount = 0;

    for (const tile_type of comboMap.keys()) {
      const result = comboMap.get(tile_type);
      if (result.length != 0 && result[1].length != 0) {
        let last = result.length - 1;
        if (result[last].length == 2) {
          if (result[last][0].value === result[last][1].value) {
            poCount += 1;
          } else {
            invalidCount += 1;
          }
        } else {
          invalidCount += 1;
        }
      }
    }

    if (invalidCount === 0 && poCount > 0) {
      //do the hand creation function here
    }
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

    const resultSets = new Map();
    resultSets.set(TileTypes.Bamboo, []);
    resultSets.set(TileTypes.Character, []);
    resultSets.set(TileTypes.Coin, []);
    resultSets.set(TileTypes.Wind, []);
    resultSets.set(TileTypes.Dragon, []);

    for (const tile_type of resultSets.keys()) {
      if (tile_type === TileTypes.Dragon || tile_type ===TileTypes.Wind) {
        const results = this.findSetsInSubset(subsets[tile_type]);
        resultSets.set(tile_type, results.length === 0 ? [[]]: results, true);
      } else {
        const results = this.findSetsInSubset(subsets[tile_type]);
        resultSets.set(tile_type, results.length === 0 ? [[]] : results, false)
      }
    }

    return resultSets;
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

          subsubset.splice(j, 2);
          subsubset.splice(i, 1);
          const possible_subsets = this.findSetsInSubset(subsubset);
          let isSequence = this.isValidSequence(subset[i], subset[j], subset[j + 1]);
          let isTerminal = validCombo[0].value === 1 || validCombo[2].value === 9;
          //TODO: CHECK FOR OTHER DORA TILES HERE
          const isDoraTile = validCombo[0].isDoraTile || validCombo[1].isDoraTile || validCombo[2].isDoraTile;
          const setInformation = new MahjongSet(validCombo[0].tileType, validCombo[0].value, validCombo.length, validCombo[0].isOpenTile, isSequence, isTerminal, validCombo[0].isHonorTile, isDoraTile);

          if (possible_subsets.length === 0) {
            results.push([setInformation, subsubset]);
          }

          for (const possibility of possible_subsets) {
            if(possibility.length === 2) {
              const possibleDouble = possibility[1]
              if (possibleDouble.length === 2) {
                if(possibleDouble[0].value === possibleDouble[1].value) {
                  possibility[1] = new MahjongSet(possibleDouble[0].tileType, possibleDouble[0].value, possibleDouble.length, false, false, possibleDouble[0].value === 1 || possibleDouble[1].value === 9, possibleDouble[0].isHonorTile, false);
                }
              }
            }
            results.push([setInformation, ...possibility])
          }
        // } else if() {
          //TODO: LET PO GO THROUGH HERE
        }

      }

    }
    return results
  }
}

export default MahjongTheGame;
// testMahjong.gameSetup();
// console.log(player4.hand);
// testMahjong.discardTile(player4.hand, 5);
// console.log(player1.hand);
// console.log(player2.hand);
// console.log(player3.hand);
// console.log(player4.hand.tiles);
// testMahjong.findSets(player4.hand);
// console.log(testMahjong.discardPile);


// let player1 = new Player(new PlayerHand([]), null, 1);
// let player2 = new Player(new PlayerHand([]), null, 2);
// let player3 = new Player(new PlayerHand([]), null, 3);
let player4 = new Player(new PlayerHand(fakeHands.fakeHand), null, 4);
const testMahjong = new MahjongTheGame([player4], 12);
testMahjong.performTsumo(player4, []);