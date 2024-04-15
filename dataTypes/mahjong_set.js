class MahjongSet {
    constructor(tileType, startingValue, length, isOpenTile, isSequence, isTerminal, isHonorTile, isDoraTile){
        this.tileType = tileType; //CHARACTER, BAMBOO, COIN, WIND, DRAGON
        this.startingValue = startingValue; //1-9, NEwS, GRW
        this.length = length;
        this.isOpenTile = isOpenTile;
        this.isSequence = isSequence;
        this.isTerminal = isTerminal;
        this.isHonorTile = isHonorTile;
        this.isDoraTile = isDoraTile; // exclusively for the red dora tiles
    }
}

module.exports = MahjongSet