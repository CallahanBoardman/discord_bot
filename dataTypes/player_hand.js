import MahjongTile from '../dataTypes/mahjong_tile.js';
import TileTypes from '../dataTypes/tile_types.js';

class PlayerHand {
    constructor(tiles){
        this.tiles = tiles; //List of tiles
        this.openHand = [];
    }

    groupByType() {
        const organizedTiles = {};
        for (const tileType of Object.values(TileTypes)) {
            organizedTiles[tileType] = []
        }
        for (let i = 0; i < this.tiles.length; i++) {
            const type = this.tiles[i].tileType
            //   console.log(this.tiles[i])
            //   console.log(organizedTiles[type])
             organizedTiles[type].push(this.tiles[i]);
        }
        return organizedTiles
    }
}

export default PlayerHand