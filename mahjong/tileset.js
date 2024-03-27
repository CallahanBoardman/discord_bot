const MahjongTile = require('../dataTypes/mahjong_tile');
const TileTypes = require('../dataTypes/tile_types');
function generateTileset() {
    const tileList = []

    for (let i = 0; i < 3; i++) {
        for (let j = 1; j < 9; j++) {
            if(i === 0 && j === 5) {
                tileList.push(new MahjongTile(TileTypes.Character, 5, `../assets/Man5-Dora`, true))
                tileList.push(new MahjongTile(TileTypes.Coin, 5, `../assets/Pin5-Dora`, true))
                tileList.push(new MahjongTile(TileTypes.Bamboo, 5, `../assets/Sou5-Dora`, true))
            } else{
                tileList.push(new MahjongTile(TileTypes.Character, j, `../assets/Man${j}`))
                tileList.push(new MahjongTile(TileTypes.Coin, j, `../assets/Pin${j}`))
                tileList.push(new MahjongTile(TileTypes.Bamboo, j, `../assets/Sou${j}`))
            }
        }
        tileList.push(new MahjongTile(TileTypes.Wind, 10, `../assets/North`))
        tileList.push(new MahjongTile(TileTypes.Wind, 11, `../assets/South`))
        tileList.push(new MahjongTile(TileTypes.Wind, 12, `../assets/East`))
        tileList.push(new MahjongTile(TileTypes.Wind, 13, `../assets/West`))
        tileList.push(new MahjongTile(TileTypes.Dragon, 14, `../assets/Red`))
        tileList.push(new MahjongTile(TileTypes.Dragon, 15, `../assets/Green`))
        tileList.push(new MahjongTile(TileTypes.Dragon, 16, `../assets/White`))
    }

    return tileList;
}
module.exports = generateTileset;