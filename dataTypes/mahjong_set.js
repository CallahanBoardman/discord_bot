class MahjongSet {
  constructor(tileType, startingValue, length, isOpenTile, isSequence, isTerminal, isHonorTile, isRedDoraTile, doraCount, uradoraCount, image1, image2, image3) {
    this.tileType = tileType; //CHARACTER, BAMBOO, COIN, WIND, DRAGON
    this.startingValue = startingValue; //1-9, NEwS, GRW
    this.length = length;
    this.isOpenTile = isOpenTile;
    this.isSequence = isSequence;
    this.isTerminal = isTerminal;
    this.isHonorTile = isHonorTile;
    this.isRedDoraTile = isRedDoraTile; // exclusively for the red dora tiles
    this.doraCount = doraCount;
    this.uradoraCount = uradoraCount;
    this.image1 = image1;
    this.image2 = image2;
    this.image3 = image3;
  }
}
module.exports = MahjongSet;