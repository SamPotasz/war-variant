export default class Hand {
  constructor( startCards ) {
    this.handCards = startCards;
    this.wonCards = [];
  }

  drawTopCard() {
    if( this.handCards.length > 0 ) {
      return this.handCards.shift();
    }
    else if( this.wonCards.length > 0 ){
      this.handCards = reshuffle( this.wonCards );
      this.drawTopCard();
    }
    else { 
      console.log("OUT OF CARDS!");
      return [];
    }
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