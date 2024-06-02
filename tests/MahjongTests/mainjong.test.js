const MahjongTheGame = require('../../mahjong/mainjong.js');
const fakeHands = require('./fake_mahjong_hands.js');
const {
  jest
} = require('@jest/globals'); // import PlayerHand from '../../dataTypes/player_hand.js';
const PlayerHand = jest.requireMock('../../dataTypes/player_hand.js ', () => ({
  groupByType: jest.fn()
}));
const mahjong_gaming = new MahjongTheGame([], 12);
beforeEach(() => {
  PlayerHand.mockClear();
  // PlayerHand.groupByType = jest.fn(() => fakeHands.fakeHand);
});

afterEach(() => {});

// test('Open hand with one dragon and round and seat wind boosted east returns 3', () => {
//     expect(mahjong_gaming.scoreHand(fakeHands.fakeOpenSet, 12, 12, false, true)).toBe(3);
// });

// test('Open hand with no value returns 0', () => {
//   expect(mahjong_gaming.scoreHand(fakeHands.fakeOpenWorthlessSet, 11, 11, false, true)).toBe(0);
// });

// test('Closed sequence hand with no valuable pairs returns 1', () => {
//   expect(mahjong_gaming.scoreHand(fakeHands.fakePinfuSets, 12, 12, false, true)).toBe(1);
// });

test('findSets returns a list of multiple sets', () => {
  // PlayerHand.groupByType.mockReturnValueOnce(fakeHand)
  results = mahjong_gaming.findSets(fakeHands.fakeHand);
  expect(results.length).toBe(7);
});