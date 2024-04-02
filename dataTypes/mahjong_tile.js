class MahjongTile {
    constructor(tileType, value, imageValue, honorTile, isDoraTile){
        this.tileType = tileType; //CHARACTER, BAMBOO, COIN, WIND, DRAGON
        this.value = value; //1-9, NEwS, GRW
        this.imageValue = imageValue; //whatever the image is
        this.isOpenTile = false;
        this.isHonorTile = honorTile ?? false;
        this.isDoraTile = isDoraTile ?? false; // exclusively for the red dora tiles
    }

    //1-13
    //pon
    //chi
    //riichi
    //tsumo
    //ron
}

module.exports = MahjongTile