const MahjongTile = require('../dataTypes/mahjong_tile.js');
const Player = require('../dataTypes/player.js');
const PlayerHand = require('../dataTypes/player_hand.js');
const generateTileset = require('./tileset.js');
const TileTypes = require('../dataTypes/tile_types.js');
const MahjongSet = require('../dataTypes/mahjong_set.js');
const MahjongScoring = require('./mahjong_scoring.js');
const fakeHands = require('../tests/MahjongTests/fake_mahjong_hands.js');

class MahjongTheGame {
  constructor(players) {
    this.roundWind = 1;
    this.players = players;
    this.drawPile = [];
    this.discardPile = [];
    this.doraTiles = [];
    this.uraDoraTiles = [];
    this.kanTiles = [];
    this.kanAmount = 0;
    this.tileOrder = Object.values(TileTypes);
    this.whosTurn = 0;
    this.drawNumber= 0;
    this.discardNumber = 0;
    this.mahjongScoring = new MahjongScoring(this.drawPile, this.roundWind);
  }
  gameSetup() {
    this.drawPile = generateTileset().sort((a, b) => 0.5 - Math.random());
    this.createDeadWall();
    for (let i = 0; i < this.players.length; i++) {
      this.drawTile(this.players[i], 13);
      this.sortHand(this.players[i].hand);
    }
    this.sortHand(this.players[0].hand);
    return this.players;
  }

  createDeadWall() {
    this.kanAmount = 0;
    this.doraTiles = this.drawPile.slice(0, 5);
    this.uraDoraTiles = this.drawPile.slice(0, 5);
    this.kanTiles = this.drawPile.slice(0, 4);
  }

  drawTile(player, amount) {
    if(player.seatPosition !== this.whosTurn + 10) {
      return "You can't draw on someone else's turn";
    }
    if(player.hand.tiles.length > 13) {
      return "nuh uh, your hand is too big";
    }
    for (let i = 0; i < amount; i++) {
      this.drawNumber++
      this.drawPile[this.drawPile.length - 1].hasBeenDrawn(this.drawNumber);
      player.hand.tiles.push(this.drawPile.pop());
    }
    return player.hand;
  }

  checkDoraTiles(tile) {
    this.doraTiles.forEach(doraTile => {
      if (tile.value === doraTile.value && tile.tileType === doraTile.tileType) {
        return true;
      }
    });
  }

  checkUraDoraTiles(tile) {
    this.uraDoraTiles.forEach(uraDoraTile => {
      if (tile.value === uraDoraTile.value && tile.tileType === uraDoraTile.tileType) {
        return true;
      }
    });
  }

  sortHand(hand) {
    hand.tiles.sort((a, b) => this.tileOrder.indexOf(a.tileType) * 10 + a.value - (this.tileOrder.indexOf(b.tileType) * 10 + b.value));
  }
  
  discardTile(player, tileToDiscard) {
    if (player.seatPosition !== this.whosTurn + 10) {
      return 'Its not your turn bub';
    }
    if(this.discardNumber === this.drawNumber) {
      return 'Draw another tile first dum dum.'
    }
    if (tileToDiscard > player.hand.tiles.length || tileToDiscard < 1) {
      return 'Thats not a valid tile silly!';
    }
    player.hand.tiles[tileToDiscard - 1].hasBeenDiscarded(this.whosTurn);
    this.discardPile.push(...player.hand.tiles.splice(tileToDiscard - 1, 1));
    this.whosTurn + 1 < this.players.length ? this.whosTurn += 1 : this.whosTurn = 0;
    let nextPlayer = this.players[this.whosTurn]
    this.sortHand(nextPlayer.hand);
    this.discardNumber = this.drawNumber;
    return [nextPlayer.id, nextPlayer.hand, player.seatPosition];
  }

  performSteal(player) {
    const copiedHand = player.hand;
    const discardedTile = this.discardPile[this.discardPile.length - 1];
    if (!discardedTile) {
      return 'Theres nothing to steal!';
    }

    if(this.discardNumber != this.drawNumber) {
      return 'Too slow! someone has drawn a tile already.'
    }
    copiedHand.tiles.push(discardedTile);
    this.sortHand(copiedHand);
    let kanResult = this.performKan(copiedHand, true);
    if(kanResult) {
      hand.tiles.push(this.kanTiles.pop());
      this.addToOpenHand(player.hand, kanResult);
      this.whosTurn = player.seatPosition - 10;
      return 'Valid Quadruplet Steal'
    }
    //make this check if its won, then we make Ron, ez
    const results = this.findSets(copiedHand);
    
    let isRon = this.performRon(results, player);
    const setList = results.get(discardedTile.tileType);

      for (let i = 0; i < setList.length; i++) {
        const hand = setList[i];
        for (let i = 0; i < hand.length - 1; i++) {
          if(hand[i].tileType === discardedTile.tileType && !hand[i].isOpenTile)
          
            if (hand[i].startingValue === discardedTile.value || hand[i].startingValue + 1 === discardedTile.value || hand[i].startingValue + 2 === discardedTile.value) {
              this.discardPile.pop();
              this.addToOpenHand(player.hand, hand[i]);
              if(Number.isInteger(isRon)) {
                return isRon;
              }
              this.whosTurn = player.seatPosition - 10;
              let nextPlayer = player;
              this.discardNumber = 0;
              return [nextPlayer.id, nextPlayer.hand];
            }
        }
    };

    return 'You cannot steal that.';
  }

  addToOpenHand(hand, openSet) {
    const tilesToRemove = [];
    if(openSet.isSequence) {
      for (let i = 0; i < 3; i++) {
        tilesToRemove.push([openSet.startingValue + i, openSet.tileType])
      }
    } else {
      for (let i = 0; i < openSet.length; i++) {
        tilesToRemove.push([openSet.startingValue, openSet.tileType])
      }
    }

    hand.tiles = hand.tiles.filter(function(tile) { 
      for (let i = 0; i < tilesToRemove.length; i++) {
        const tileDataPair = tilesToRemove[i];
        if(tile.value == tileDataPair[0] && tile.tileType == tileDataPair[1]) {
          tilesToRemove.slice(i, 1);
          return false;
        }
      }
      return true;
    });
    
    hand.openHand.push(openSet);
  }

  performKan(hand, isForStealing) {
    this.sortHand(hand);
    let winningTile;
    for (let i = 0; i < hand.length - 3; i++) {
      if(this.isValidQuadruplet(hand[i], hand[i + 1], hand[i + 2], hand[i + 3])) {
        winningTile = hand[i];
        break;
      }
    }
    if(winningTile) {
      const kanSet = new MahjongSet(winningTile.tileType, winningTile.value, 4, isForStealing, true, winningTile.value === 1 || winningTile.value === 9, winningTile.isHonorTile, winningTile === 5, 0, 0, winningTile.imageValue, winningTile.imageValue, winningTile.imageValue)
      if(isForStealing) {
        return kanSet;
      }
      addToOpenHand(hand, kanSet)
      hand.tiles.push(this.kanTiles.pop());
      return "Valid Kan"
    }
    return false;
  }

  performRon(results, player) { 
    if (results.size > 0) {
      const score = this.mahjongScoring.calculateHandValue(results, player.openHand, true, false, player.RiichiCalledAt - this.drawPile.length === 4);
      if (score === 0) {
        return 'Your hand is complete, however it has zero value. Refer to the mahjong handbook with !scoring to see where you messed up';
      }
      //TODO if we ever attempt to implement multiple rounds, not part of current scope
      // player.RiichiDeclared = false
      // player.RiichiCalledAt = 999
      return score;
    }
    return 'Your hand is bogus';
  }

  checkForFancyHands(hand) {
    const greenTiles = [2, 3, 4, 6, 8, 15];
    let isGreenHand = true;
    let is13Orphans = true;
    for (tile of hand.tiles) { }
  }

  performRiichi(player) {

  }

  performTsumo(player) {
    const results = this.findSets(player.hand);
    if (results.size > 0) {
      const score = this.mahjongScoring.calculateHandValue(results, player.openHand, true, false, player.RiichiCalledAt - this.drawPile.length === 4);
      if (score === 0) {
        return 'Your hand is complete, however it has zero value. Refer to the mahjong handbook with !scoring to see where you messed up';
      }
      //TODO if we ever attempt to implement multiple rounds, not part of current scope
      // player.RiichiDeclared = false
      // player.RiichiCalledAt = 999
      return score;
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
      return true;
    }
    return false;
  }

  isValidTriplet(tile1, tile2, tile3) {
    if (tile1.value === tile2.value) {
      if (tile2.value === tile3.value) {
        return true;
      }
    }
    return false;
  }
  
  isValidQuadruplet(tile1, tile2, tile3, tile4) {
    if (tile1.value === tile2.value && tile1.tileType == tile2.tileType) {
      if (tile2.value === tile3.value && tile2.tileType == tile3.tileType) {
        if (tile3.value === tile4.value && tile3.tileType == tile4.tileType) {
          return true;
        }
      }
    }
    return false;
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
      hand.openHand.forEach(openSet => {
        if(openSet.tileType === tile_type) 
          resultSets.set(tile_type, openSet);
      });
      if (tile_type === TileTypes.Dragon || tile_type === TileTypes.Wind) {
        const results = this.findSetsInSubset(subsets[tile_type]);
        resultSets.set(tile_type, results.length === 0 ? [[]] : results, true);
      } else {
        const results = this.findSetsInSubset(subsets[tile_type]);
        resultSets.set(tile_type, results.length === 0 ? [[]] : results, false);
      }
    }
    resultSets
    return resultSets;
  }

  findSetsInSubset(subset, isHonor) {
    // The loops here go through each tile and compare it with every following
    // two tiles in the list

    const results = [];
    let last = null;
    for (let i = 0; i < subset.length - 2; i++) {
      if (subset[i].value === last) {
        continue;
      }
      last = subset[i].value;
      for (let j = i + 1; j < subset.length - 1; j++) {
        const isSequence = this.isValidSequence(subset[i], subset[j], subset[j + 1]) && !isHonor;
        const isTriplet = this.isValidTriplet(subset[i], subset[j], subset[j + 1]);
        if (isTriplet || isSequence) {
          const validCombo = [subset[i], subset[j], subset[j + 1]];
          const subsubset = structuredClone(subset);
          subsubset.splice(j, 2);
          subsubset.splice(i, 1);
          const possible_subsets = this.findSetsInSubset(subsubset);
          let isSequence = this.isValidSequence(subset[i], subset[j], subset[j + 1]);
          let isTerminal = validCombo[0].value === 1 || validCombo[2].value === 9;
          let doraCount = this.checkDoraTiles(validCombo[0]) + this.checkDoraTiles(validCombo[1]) + this.checkDoraTiles(validCombo[2])
          let uradoraCount = this.checkUraDoraTiles(validCombo[0]) + this.checkUraDoraTiles(validCombo[1]) + this.checkUraDoraTiles(validCombo[2])
          const isRedDoraTile = validCombo[0].isDoraTile || validCombo[1].isDoraTile || validCombo[2].isDoraTile;
          const setInformation = new MahjongSet(validCombo[0].tileType, validCombo[0].value, validCombo.length, validCombo[0].isOpenTile, isSequence, isTerminal, validCombo[0].isHonorTile, isRedDoraTile, doraCount, uradoraCount, validCombo[0].imageValue, validCombo[1].imageValue, validCombo[2].imageValue);
          if (possible_subsets.length === 0) {
            results.push([setInformation, subsubset]);
          }
          for (const possibility of possible_subsets) {
            if (possibility.length === 2) {
              const possibleDouble = possibility[1];
              if (possibleDouble.length === 2) {
                if (possibleDouble[0].value === possibleDouble[1].value) {
                  possibility[1] = new MahjongSet(possibleDouble[0].tileType, possibleDouble[0].value, possibleDouble.length, false, false, possibleDouble[0].value === 1 || possibleDouble[1].value === 9, possibleDouble[0].isHonorTile, false, 0, 0, possibleDouble[0].imageValue, possibleDouble[1].imageValue);
                }
              }
            }
            results.push([setInformation, ...possibility]);
          }
          // } else if() {
          //TODO: LET PO GO THROUGH HERE
        }
      }
    }

    return results;
  }
}
module.exports = MahjongTheGame;