const MahjongSet = require('../dataTypes/mahjong_set');
const { max } = require('lodash');
class MahjongScoring {
  constructor(drawPile, roundWind) {
    this.drawPile = drawPile;
    this.roundWind = roundWind
  }

  handMaker(comboMap) {
    const possibleHands = [];
    for (const Bamboo of comboMap.get('BAMBOO')) {
      for (const Character of comboMap.get('CHARACTER')) {
        for (const Coin of comboMap.get('COIN')) {
          for (const Wind of comboMap.get('WIND')) {
            for (const Dragon of comboMap.get('DRAGON')) {
              possibleHands.push([...Bamboo, ...Character, ...Coin, ...Wind, ...Dragon])
            }
          }
        }
      }
    }
    return possibleHands;
  }

  scoreHand(hand, seatWind, roundWind, isRiichi, isRon) {
    let score = 0;
    const maxValue = 13
    if (!isRon) {
      if (this.drawPile.length > 88) {
        return maxValue;
      }
      if (this.drawPile.length === 0) {
        score += 1;
      }
      score += 1;
    } else {
      if (this.drawPile.length === 0) {
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

        if (set.tileType !== previousTileType && !set.isHonorTile ) {
          howManySuits++
        }
        if (set.isHonorTile) {
          if (set.startingValue > 13) {
            score += 1
            dragonCount++;
          } else {
            if (set.startingValue === roundWind) {
              score += 1
            }
            if (set.startingValue === seatWind) {
              score += 1
            }
            windCount++;
          }
        }
        if (set.isSequence) {
          sequenceCount++;
          if (set.startingValue === previousStartingValue && set.tileType === previousTileType) {
            identicalSequenceCount++;
          }
          if (set.startingValue === previousStartingValue && set.tileType != previousTileType) {
            sameSequenceCount++;
          }
          if (set.startingValue === previousStartingValue + 2 && set.tileType === previousTileType) {
            consecutiveSequenceCount++;
          }
        } else {
          tripletCount++;
          if (set.startingValue === previousStartingValue) {
            sameDuplicateCount++
          }
        }
        if (set.isTerminal) {
          terminalCount++;
        }
        if (set.isDoraTile) {
          score += 1;
        }
        previousStartingValue = set.startingValue;
        previousTileType = set.tileType;
      } else {
        poType = set.tileType;
        if (set.isTerminal) {
          terminalCount++;
        }

        if (set.isHonorTile) {
          if (set.startingValue > 13) {
            dragonCount++;
          } else {
            windCount++;
          }
        }
      }
    }


    let isNotOpenHand = openCount === 0;
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
      if (isNotOpenHand) {
        score += 2;
      } else {
        score += 1;
      }
    }

    if (honorCount === 5) {
      return maxValue;
    }

    if (terminalCount === 5) {
      if (tripletCount === 4) {
        return maxValue;
      }
      if (isNotOpenHand) {
        score += 3;
      } else {
        score += 2;
      }
    }
    
    if (honorCount + terminalCount === 5) {
      if (tripletCount === 4) {
        score += 2;
      }
      if (isNotOpenHand) {
        score += 2
      } else {
        score += 1
      }
    }

    if (howManySuits === 1) {
      if (honorCount > 0) {
        if (isNotOpenHand) {
          score += 3;
        } else {
          score += 2;
        }
      } else {
        if (isNotOpenHand) {
          score += 6;
        } else {
          score += 5;
        }
      }
    }

    if (isNotOpenHand) {
      if (tripletCount === 4 && !isRon) {
        return maxValue;
      }
      if (tripletCount === 3 & !isRon) {
        score += 2;
      }
      if (sameSequenceCount > 0) {
        if (sameSequenceCount > 1) {
          score += 3;
          score += sameSequenceCount;
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
    return max(scoreList);
  }

  calculateHandValue(comboMap, seatWind, isRiichi, isRon) {
    const scoreList = [];

    const hands = this.handMaker(comboMap);

    for (const hand of hands) {
      scoreList.push(this.scoreHand(hand, seatWind, isRiichi, isRon));
    }
    let score = this.determineHighestScore(scoreList);
    return score;
  }
}
module.exports = MahjongScoring