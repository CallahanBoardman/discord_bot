class Player {
  constructor(hand, previousDiscardedTile, id, seatPosition, image) {
    this.hand = hand;
    this.previousDiscardedTile = previousDiscardedTile;
    this.id = id;
    this.seatPosition = seatPosition;
    this.RiichiDeclared = false;
    this.RiichiCalledAt = 999;
    this.image = image;
  }
}
module.exports = Player;