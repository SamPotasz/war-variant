import 'phaser';
import config from '../config/config';
import Hand from './Hand';

// referee models & manages gamestate for one game
// here, it's acting as a pseudo-server
export default class Referee {

  constructor(player) {
    // send events back and forth to client (instead of websockets)
    this.events = new Phaser.Events.EventEmitter();

    
  }

  onPlayerConnect( player ) {
    player.events.on( config.EVENTS.PLAYER_DRAW_START, this.onPlayerDraw, this );

  }
  
  // create initial starting hands.
  shuffle() {
    let [playerStart, botStart] = initialShuffle();
    // all cards start "inHand". no cards won / to-be-shuffled yet
    this.playerHand = new Hand( playerStart );
    this.botHand = new Hand( botStart );

    this.events.emit( config.EVENTS.INITIAL_DEAL, this.playerHand.handCards.length );
  }

  onPlayerDraw() {
    const playerDraw = this.playerHand.drawTopCard();
    const botDraw = this.botHand.drawTopCard();

    console.log({playerDraw, botDraw});

    const handResult = compareCards( playerDraw, botDraw );

    this.events.emit( config.EVENTS.PLAYER_DRAW_END, handResult );
  }
}

// returns two hands of 26 cards each
const initialShuffle = () => {
  const handOne = [];
  const handTwo = [];
  
  // create the full deck
  const deck = [];
  for( var i = 0; i < 52; i++ ) {
    deck.push( i );
  }
  console.log({deck})

  var dealingLeft = true;
  while( deck.length > 0 ) {
    // pick random card
    const index = Math.random() * deck.length;
    const card = deck.splice( index, 1 );

    const dealingTo = dealingLeft ? handOne : handTwo;
    dealingTo.push( card[ 0 ]);
    dealingLeft = !dealingLeft;
  }

  return [ handOne, handTwo ];
}

// returns -1 for loss, +1 for win, 0 for tie / war
const compareCards = ( playerCard, botCard ) => {
  const playerRank = Math.floor( playerCard / 4 );
  const botRank = Math.floor( botCard / 4 );

  if( playerRank > botRank )
    return 1;
  else if( botRank > playerRank )
    return -1;
  else
    return 0;
}