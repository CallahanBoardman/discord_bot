class Player {
  constructor(hand, previousDiscardedTile, id, seatPosition) {
    this.hand = hand;
    this.previousDiscardedTile = previousDiscardedTile;
    this.id = id;
    this.seatPosition = seatPosition;
    this.RiichiDeclared = false;
    this.RiichiCalledAt = 999;
  }
}
module.exports = Player;