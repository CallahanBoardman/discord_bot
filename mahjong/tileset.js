const MahjongTile = require('../dataTypes/mahjong_tile');

export function generateTileset() {
    const tileList = []

    for (let i = 0; i < 3; i++) {
        for (let j = 1; j < 9; j++) {
            if(i = 0 && j == 5) {
                tileList.push(MahjongTile('Character', 55, `../assets/Man5-Dora`))
                tileList.push(MahjongTile('Coin', 55, `../assets/Pin5-Dora`))
                tileList.push(MahjongTile('Bamboo', 55, `../assets/Sou5-Dora`))
            } else{
                tileList.push(MahjongTile('Character', j, `../assets/Man${j}`))
                tileList.push(MahjongTile('Coin', j, `../assets/Pin${j}`))
                tileList.push(MahjongTile('Bamboo', j, `../assets/Sou${j}`))
            }
        }
        tileList.push(MahjongTile('Wind', 10, `../assets/North`))
        tileList.push(MahjongTile('Wind', 11, `../assets/South`))
        tileList.push(MahjongTile('Wind', 12, `../assets/East`))
        tileList.push(MahjongTile('Wind', 13, `../assets/West`))
        tileList.push(MahjongTile('Dragon', 14, `../assets/Red`))
        tileList.push(MahjongTile('Dragon', 15, `../assets/Green`))
        tileList.push(MahjongTile('Dragon', 16, `../assets/White`))
    }

    return tileList;
}