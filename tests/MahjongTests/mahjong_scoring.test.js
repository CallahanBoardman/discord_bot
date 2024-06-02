const MahjongScoring = require('../../mahjong/mahjong_scoring.js');
const fakeHands = require('./fake_mahjong_hands');
const mahjong_scoring = new MahjongScoring(['a fake entry so that it does not trigger certain things']);
beforeEach(() => {});
afterEach(() => {});
test('Open hand with one dragon and round and seat wind boosted east returns 3', () => {
  expect(mahjong_scoring.scoreHand(fakeHands.fakeOpenSet, 12, 12, false, true)).toBe(3);
});
test('Open hand with no value returns 0', () => {
  expect(mahjong_scoring.scoreHand(fakeHands.fakeOpenWorthlessSet, 11, 11, false, true)).toBe(0);
});
test('Closed sequence hand with no valuable pairs returns 1', () => {
  expect(mahjong_scoring.scoreHand(fakeHands.fakePinfuSets, 12, 12, false, true)).toBe(1);
});
test('Closed terminal and honor hand returns 8', () => {
  expect(mahjong_scoring.scoreHand(fakeHands.fakeTerminalHonorSet, 12, 12, false, true)).toBe(8);
});