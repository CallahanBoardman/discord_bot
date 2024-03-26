class MahjongTile {
    constructor(tileType, value, imagevalue){
        this.tileType = tileType //CHARACTER, BAMBOO, COIN, WIND, DRAGON
        this.value = value //1-9, NESW, GRW
        this.imagevalue = imagevalue //whatever the image is
    }

    //1-13
    //pon
    //chi
    //riichi
    //tsumo
    //ron
}

module.exports = MahjongTile