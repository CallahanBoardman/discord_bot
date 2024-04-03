const MahjongTile = require('../dataTypes/mahjong_tile');
const TileTypes = require('../dataTypes/tile_types');

class PlayerHand {
    constructor(tiles){
        this.tiles = tiles; //List of tiles
        this.organizedTiles = []; //List of Lists of tiles organized by type
    }

    groupByType() {
        for (let i = 0; i < this.tiles.length; i++) {
            const type = this.tiles[i].tileType
              
             if (!this.organizedTiles.hasOwnProperty(type)) {
                this.organizedTiles[type] = []
             }
              
             this.organizedTiles[type].push(this.tiles[i])
        }
        return this.organizedTiles
    }
}

module.exports = PlayerHand