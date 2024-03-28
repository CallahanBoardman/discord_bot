class Player {
    constructor(hand, previousDiscardedTile, id, seatPosition){
        this.hand = hand;
        this.previousDiscardedTile = previousDiscardedTile;
        this.id = id;
        this.seatPosition = seatPosition;
    }
}

module.exports = Player