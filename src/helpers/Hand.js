export default class Hand {
  constructor( startCards ) {
    this.handCards = startCards;
    this.wonCards = [];
  }

  drawTopCard() {
    if( this.handCards.length > 0 ) {
      return this.handCards.shift();
    }
    else { 
      console.log("OUT OF CARDS!");
      return [];
    }
  }

  // return four cards. if they're all in the hand, use those.
  // if we don't have four cards, return as much as we have.
  getCardsForWar( cardsNeeded ) {
    let warCards = [];
    if( this.totalCards <= cardsNeeded ){
      warCards = this.handCards.concat( this.wonCards );
      this.handCards = [];
      this.wonCards = [];
    }
    else {
      while( warCards.length < cardsNeeded ) {
        warCards.push( this.drawTopCard() );
        if( this.handCards.length == 0 ) {
          this.reshuffle();
        }
      }
    }

    return warCards;
  }

  takeCards( cards ) {
    this.wonCards = this.wonCards.concat( cards );
  }

  reshuffle() {
    this.handCards = Phaser.Actions.Shuffle( this.wonCards );
    this.wonCards = [];
  }

  get totalCards() {
    return this.handCards.length + this.wonCards.length;
  }
}

const reshuffle = deck => {
  const shuffled = [];

  while ( deck.length > 0 ){
    const index = Math.random() * deck.length;
    const card = deck.splice( index, 1 );
    shuffled.push( card[ 0 ]);
  }

  return shuffled;
}