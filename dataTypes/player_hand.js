const MahjongTile = require('../dataTypes/mahjong_tile.js');
const TileTypes = require('../dataTypes/tile_types.js');
class PlayerHand {
  constructor(tiles) {
    this.tiles = tiles; //List of tiles
    this.openHand = [];
  }
  groupByType() {
    const organizedTiles = {};
    for (const tileType of Object.values(TileTypes)) {
      organizedTiles[tileType] = [];
    }
    for (let i = 0; i < this.tiles.length; i++) {
      const type = this.tiles[i].tileType;
      organizedTiles[type].push(this.tiles[i]);
    }
    return organizedTiles;
  }
}
module.exports = PlayerHand;