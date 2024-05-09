import MahjongTile from '../../dataTypes/mahjong_tile.js';
import MahjongSet from '../../dataTypes/mahjong_set.js';

  const fakePinfuSets = [
    new MahjongSet(
      'CHARACTER',
      1,
      3,
      false,
      true,
      true,
      false,
      false,
    ),
    new MahjongSet(
      'COIN',
      3,
      3,
      false,
      true,
      false,
      false,
      false,
    ),
    new MahjongSet(
      'BAMBOO',
      7,
      3,
      false,
      true,
      true,
      false,
      false,
    ),
    new MahjongSet(
      'BAMBOO',
      2,
      3,
      false,
      true,
      false,
      false,
      false,
    ),
    new MahjongSet(
      'BAMBOO',
      7,
      2,
      false,
      false,
      false,
      false,
      false,
    ),
  ];

  const fakeTerminalHonorSet = [
    new MahjongSet(
      'COIN',
      1,
      3,
      false,
      true,
      true,
      false,
      false,
    ),
    new MahjongSet(
      'COIN',
      7,
      3,
      false,
      true,
      true,
      false,
      false,
    ),
    new MahjongSet(
      'WIND',
      12,
      3,
      false,
      false,
      false,
      true,
      false,
    ),
    new MahjongSet(
      'DRAGON',
      15,
      3,
      false,
      false,
      false,
      true,
      false,
    ),
    new MahjongSet(
      'DRAGON',
      16,
      2,
      false,
      false,
      false,
      true,
      false,
    ),
  ];

  const fakeOpenSet = [
    new MahjongSet(
      'BAMBOO',
      2,
      3,
      true,
      true,
      false,
      false,
      false,
    ),
    new MahjongSet(
      'COIN',
      7,
      3,
      true,
      true,
      true,
      false,
      false,
    ),
    new MahjongSet(
      'WIND',
      12,
      3,
      true,
      false,
      false,
      true,
      false,
    ),
    new MahjongSet(
      'DRAGON',
      15,
      3,
      true,
      false,
      false,
      true,
      false,
    ),
    new MahjongSet(
      'DRAGON',
      16,
      2,
      false,
      false,
      false,
      true,
      false,
    ),
  ];

  const fakeOpenWorthlessSet = [
    new MahjongSet(
      'BAMBOO',
      7,
      3,
      true,
      false,
      false,
      false,
      false,
    ),
    new MahjongSet(
      'COIN',
      1,
      3,
      true,
      true,
      true,
      false,
      false,
    ),
    new MahjongSet(
      'COIN',
      7,
      3,
      true,
      true,
      true,
      false,
      false,
    ),
    new MahjongSet(
      'WIND',
      12,
      3,
      true,
      false,
      false,
      true,
      false,
    ),
    new MahjongSet(
      'DRAGON',
      16,
      2,
      false,
      false,
      false,
      true,
      false,
    ),
  ];

  const fakeHand = [
    new MahjongTile(
      'CHARACTER',
      1,
      '../assets/Man1',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      1,
      '../assets/Man1',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      1,
      '../assets/Man1',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      2,
      '../assets/Man2',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      2,
      '../assets/Man2',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      2,
      '../assets/Man2',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      3,
      '../assets/Man3',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      3,
      '../assets/Man4',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      3,
      '../assets/Man5',
      false,
      false,
      false
    ),
    new MahjongTile(
      'BAMBOO',
      4,
      '../assets/Man4',
      false,
      false,
      false
    ),
    new MahjongTile(
      'BAMBOO',
      4,
      '../assets/Man4',
      false,
      false,
      false
    ),
    new MahjongTile(
      'BAMBOO',
      4,
      '../assets/Man4',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      7,
      '../assets/Man7',
      false,
      false,
      false
    ),
    new MahjongTile(
      'CHARACTER',
      7,
      '../assets/Man7',
      false,
      false,
      false
    ),
  ];
  
export default {
  fakeHand,
  fakeOpenSet,
  fakeOpenWorthlessSet,
  fakePinfuSets,
  fakeTerminalHonorSet,
}