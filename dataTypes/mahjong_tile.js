class MahjongTile {
  constructor(tileType, value, imageValue, honorTile, isRedDoraTile, isGreenTile) {
    this.tileType = tileType; //CHARACTER, BAMBOO, COIN, WIND, DRAGON
    this.value = value; //1-9, NEwS, GRW
    this.imageValue = imageValue; //whatever the image is
    this.isOpenTile = false;
    this.isHonorTile = honorTile ?? false;
    this.isRedDoraTile = isRedDoraTile ?? false; // exclusively for the red dora tiles
    this.isGreenTile = isGreenTile ?? false; // exclusively for one hand involving tiles that are entirely green
    this.discardedByWhom = 50;
    this.drawnWhen = 0;
  }

  hasBeenDiscarded(whom){
    this.discardedByWhom = whom;
  }
  
  hasBeenDrawn(when){
    this.drawnWhen = when;
  }
}
module.exports = MahjongTile;