const MahjongTile = require('../dataTypes/mahjong_tile');
const Player = require('../dataTypes/player');
const PlayerHand = require('../dataTypes/player_hand');
const generateTileset = require('./tileset')
const TileTypes = require('../dataTypes/tile_types');
const { max } = require('lodash');
const MahjongSet = require('../dataTypes/mahjong_set');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

class MahjongTheGame {
  constructor(players) {
    this.players = players;
    this.drawPile = [];
    this.discardPile = [];
    this.deadWall = [];
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
    this.discardPile.push(hand.tiles.splice(tileToDiscard - 1, 1)[0])
  }

  performSteal(player) {
    const copiedHand = player.hand;
    const discardedTile = this.discardPile[this.discardPile.length - 1]
    if (!discardedTile) {
      return 'Theres nothing discarded yet!';
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

  performTsumo(player) {
    const results = this.findSets(player.hand)
    if (results.size > 0) {
      const score = this.calculateHandValue(results, player.openHand)
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
        console.log(result)

        // console.log(result[1])
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

  handMaker(comboMap, openHand) {
    const possibleHands = [];
    return possibleHands;
  }

  scoreHand(hand, seatWind, roundWind, isRiichi, isRon) {
    let score = 0;
    const maxValue = 13
    if (!isRon) {
      if(this.drawPile.length > 88) {
        return maxValue;
      }
      if(this.drawPile.length === 0) {
        score += 1;
      }
      score += 1;
    } else {
      if(this.drawPile.length === 0) {
        score += 1;
      }
    }

    if (isRiichi) {
      score += 1;
      //insert logic for winning after one turn of declaring here
    }

    let openCount = 0;
    let tripletCount = 0;
    let sequenceCount = 0;
    let dragonCount = 0;
    let windCount = 0;
    let previousStartingValue = 0;
    let previousTileType = '';
    let terminalCount = 0;
    let sameSequenceCount = 0;
    let sameDuplicateCount = 0;
    let identicalSequenceCount = 0;
    let consecutiveSequenceCount = 0;
    let howManySuits = 0;
    let poType = '';

    for (let index = 0; index < hand.length; index++) {
      const set = hand[index];
      if (set.length > 2) {
        if (set.isOpenTile) {
          openCount++;
        }
        if (set.type != previousTileType && !set.isHonorTile) {
          howManySuits++
        }
        if (set.isHonorTile) {
          if (set.value > 13) {
            score += 1
            dragonCount++;
          } else {
            if (set.value === roundWind) {
              score += 1
            }
            if (set.value === seatWind) {
              score += 1
            }
            windCount++;
          }
        }
        if (set.isSequence) {
          sequenceCount++;
          if (set.value === previousStartingValue && set.tileType === previousTileType) {
            identicalSequenceCount++;
          }
          if (set.value === previousStartingValue && set.tileType != previousTileType) {
            sameSequenceCount++;
          }
          if (set.value === previousStartingValue + 2 && set.tileType === previousTileType) {
            consecutiveSequenceCount++;
          }
        } else {
          tripletCount++;
          if (set.value === previousStartingValue) {
            sameDuplicateCount++
          }
        }
        if (set.isTerminal) {
          terminalCount++;
        }
        if (set.isDoraTile) {
          score += 1;
        }
        previousStartingValue = set.value;
        previousTileType = set.type;
      } else {
        poType = set.type;
        if (set.isTerminal) {
          terminalCount++;
        }

        if (set.isHonorTile) {
          if (set.value > 13) {
            dragonCount++;
          } else {
            windCount++;
          }
        }
      }
    }
    let isOpenHand = openCount === 0;
    let honorCount = dragonCount + windCount;
    if (honorCount === 0 && terminalCount === 0) {
      score += 1;
    }
    if (dragonCount === 3 && poType === 'DRAGON') {
      score += 2;
    }
    if ((dragonCount === 3 && poType != 'DRAGON') || windCount === 4) {
      return maxValue;
    }

    if (tripletCount === 4 || sameDuplicateCount > 1) {
      score += 2;
    }

    if (consecutiveSequenceCount === 2 || identicalSequenceCount === 2) {
      if (isOpenHand) {
        score += 2;
      } else {
        score += 1;
      }
    }
    
    if(honorCount === 5) {
      return maxValue;
    }
    if(terminalCount === 5) {
      if(tripletCount === 4) {
        return maxValue;
      }
      if(isOpenHand) {
        score += 3;
      } else {
        score += 2;
      }
    }
    if(honorCount + terminalCount === 5) {
      if(tripletCount === 4) {
        score += 2;
      }
      if(isOpenHand) {
        score += 2
      } else {
        score += 1
      }
    }
    if(howManySuits === 1) {
      if(honorCount > 0) {
        if(isOpenHand) {
          score += 3;
        } else {
          score += 2;
        }
      } else {
        if(isOpenHand) {
          score += 6;
        } else {
          score += 5;
        }
      }
    }

    if (isOpenHand) {
      if(tripletCount === 4 && !isRon) {
        return maxValue;
      }
      if(tripletCount === 3 & !isRon) {
        score += 2;
      }
      if (sameSequenceCount > 0) {
        if (sameSequenceCount > 1) {
          score += 3;
        } else {
          score += 1;
        }
      }

      if (sequenceCount === 4 && honorCount === 0) {
        score += 1;
      }
    }

    return score;
  }

  determineHighestScore(scoreList) {

  }

  calculateHandValue(comboMap, openHand) {
    const scoreList = [];
    const hands = this.handMaker(comboMap, openHand);
    for (const hand of hands) {
      scoreList.push(this.scoreHand(hand));
    }
    score = this.determineHighestScore(scoreList);
    return score;
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
    resultSets.set(TileTypes.Coin, []);
    resultSets.set(TileTypes.Character, []);
    resultSets.set(TileTypes.Wind, []);
    resultSets.set(TileTypes.Dragon, []);

    for (const tile_type of resultSets.keys()) {
      if (tile_type === TileTypes.Dragon || tile_type === TileTypes.Wind) {
        resultSets.set(tile_type, this.findSetsInSubset(subsets[tile_type], true))
      } else {
        resultSets.set(tile_type, this.findSetsInSubset(subsets[tile_type], false))
      }
    }

    for (const possibleCombos of resultSets.values()) {

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
          if (possible_subsets.length === 0) {
            results.push([validCombo, subsubset]);
          }

          for (const possibility of possible_subsets) {
            results.push([validCombo, ...possibility])
          }
        }
      }

    }
    return results
  }
}

// testMahjong.gameSetup();
// console.log(player4.hand);
// testMahjong.discardTile(player4.hand, 5);
// console.log(player1.hand);
// console.log(player2.hand);
// console.log(player3.hand);
// console.log(player4.hand.tiles);
// testMahjong.findSets(player4.hand);
// console.log(testMahjong.discardPile);
const fakeHand = [
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
    1,
    '../assets/Man1',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    2,
    '../assets/Man2',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    2,
    '../assets/Man2',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    2,
    '../assets/Man2',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    3,
    '../assets/Man3',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    3,
    '../assets/Man4',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    3,
    '../assets/Man5',
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
    'CHARACTER',
    7,
    '../assets/Man7',
    false,
    false,
    false
  ),
  new MahjongTile(
    'CHARACTER',
    7,
    '../assets/Man7',
    false,
    false,
    false
  ),
];

const fakeSets = [
  new MahjongSet('DRAGON', 14, 3, false, true, true, false, false),
  new MahjongSet('DRAGON', 15, 3, false, true, true, false, false),
  new MahjongSet('CHARACTER', 1, 3, false, true, true, false, false),
  new MahjongSet('CHARACTER', 4, 3, false, true, false, false, false),
  new MahjongSet('DRAGON', 16, 2, false, false, true, false, false),
];
let player1 = new Player(new PlayerHand([]), null, 1);
let player2 = new Player(new PlayerHand([]), null, 2);
let player3 = new Player(new PlayerHand([]), null, 3);
let player4 = new Player(new PlayerHand(fakeHand), null, 4);
const testMahjong = new MahjongTheGame([player4]);
testMahjong.discardTile(player4.hand, 3)
console.log(testMahjong.scoreHand(fakeSets, 'EAST', 'EAST', true, true));