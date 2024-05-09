import MahjongScoring from '../../mahjong/mahjong_scoring.js';
import { fakeOpenSet, fakeOpenWorthlessSet, fakePinfuSets, fakeTerminalHonorSet } from './fake_mahjong_hands';
const mahjong_scoring = new MahjongScoring(['a fake entry so that it does not trigger certain things']);
beforeEach(() => {

  });
  
  afterEach(() => {

  });

test('Open hand with one dragon and round and seat wind boosted east returns 3', () => {
    expect(mahjong_scoring.scoreHand(fakeOpenSet, 12, 12, false, true)).toBe(3);
});

test('Open hand with no value returns 0', () => {
  expect(mahjong_scoring.scoreHand(fakeOpenWorthlessSet, 11, 11, false, true)).toBe(0);
});

test('Closed sequence hand with no valuable pairs returns 1', () => {
  expect(mahjong_scoring.scoreHand(fakePinfuSets, 12, 12, false, true)).toBe(1);
});

test('Closed terminal and honor hand returns 8', () => {
  expect(mahjong_scoring.scoreHand(fakeTerminalHonorSet, 12, 12, false, true)).toBe(8);
});