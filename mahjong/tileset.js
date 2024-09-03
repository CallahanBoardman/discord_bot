const MahjongTile = require('../dataTypes/mahjong_tile.js');
const TileTypes = require('../dataTypes/tile_types.js');
function generateTileset() {
  const tileList = [];
  //for test purposes only
  // for (let i = 0; i < 100; i++) {
  //   tileList.push(new MahjongTile(TileTypes.Dragon, 14, `./assets/Red.png`, true));
  // }
  // return tileList;

  for (let i = 0; i < 3; i++) {
    for (let value = 1; value < 9; value++) {
      if (i === 0 && value === 5) {
        tileList.push(new MahjongTile(TileTypes.Character, 5, `./assets/Man5-Dora.png`, false, true));
        tileList.push(new MahjongTile(TileTypes.Coin, 5, `./assets/Pin5-Dora.png`, false, true));
        tileList.push(new MahjongTile(TileTypes.Bamboo, 5, `./assets/Sou5-Dora.png`, false, true));
      } else {
        tileList.push(new MahjongTile(TileTypes.Character, value, `./assets/Man${value}.png`));
        tileList.push(new MahjongTile(TileTypes.Coin, value, `./assets/Pin${value}.png`));
        tileList.push(new MahjongTile(TileTypes.Bamboo, value, `./assets/Sou${value}.png`, false, false, value === 2 || value === 3 || value === 4 || value === 6 || value === 8));
      }
    }
    tileList.push(new MahjongTile(TileTypes.Wind, 10, `./assets/North.png`, true));
    tileList.push(new MahjongTile(TileTypes.Wind, 11, `./assets/South.png`, true));
    tileList.push(new MahjongTile(TileTypes.Wind, 12, `./assets/East.png`, true));
    tileList.push(new MahjongTile(TileTypes.Wind, 13, `./assets/West.png`, true));
    tileList.push(new MahjongTile(TileTypes.Dragon, 14, `./assets/Red.png`, true));
    tileList.push(new MahjongTile(TileTypes.Dragon, 15, `./assets/Green.png`, true, false, true));
    tileList.push(new MahjongTile(TileTypes.Dragon, 16, `./assets/White.png`, true));
  }
  return tileList;
}
module.exports = generateTileset;