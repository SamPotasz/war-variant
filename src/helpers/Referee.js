import 'phaser';
import config from '../config/config';
import { BUTTONS } from './WarDisplay';
import Hand from './Hand';

// referee models & manages gamestate for one game
// here, it's acting as a pseudo-server
export default class Referee {

  constructor( clientScene ) {
    // send events back and forth to client (instead of websockets)
    this.events = new Phaser.Events.EventEmitter();
    this.client = clientScene;
  }

  onClientConnect( client ) {
    // console.log('client connected', client);
    client.events.on( config.EVENTS.PLAYER_DRAW_START, this.onPlayerDraw , this );
    client.events.on( config.EVENTS.WAR_ACTION, this.onWarInput, this);
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
    this.playerDraw = this.playerHand.drawTopCard();
    this.botDraw = this.botHand.drawTopCard();
    const comparison = compareCards( this.playerDraw, this.botDraw );

    // console.log(this.playerHand.totalCards);
    const handResult = {
      playerDraw: this.playerDraw,
      botDraw: this.botDraw,
      comparison,
      numPlayerCards: this.playerHand.totalCards
    }
    // console.log(handResult);
    this.events.emit( config.EVENTS.PLAYER_DRAW_END, handResult );

    // do end of trick stuff. move cards to winner's hand, reshuffle, etc.
    const drawCards = [ this.playerDraw, this.botDraw ];
    if( comparison == 0 ) {
      // const playerWarPrep = this.prepForWar( this.playerHand, config.PLAYER_CONST );
      // const botWarPrep = this.prepForWar( this.botHand, config.OPPONENT_CONST );
    }
    else {
      const winner = comparison > -1 ? this.playerHand : this.botHand;
      winner.takeCards( drawCards );

      // check if we're out of cards (lost) or need to reshuffle
      this.checkEnd( this.playerHand, config.PLAYER_CONST );
      this.checkEnd( this.botHand, config.OPPONENT_CONST );
    }
  }

  // player has selected a move! let's respond
  onWarInput( playerActionType ) {
    const playerCardsNeeded = this.getCardsForAction( playerActionType );

    const playerWar = this.prepForWar( this.playerHand, playerCardsNeeded, this.playerDraw );
    this.events.emit( 
      config.EVENTS.WAR_RESPONSE,
      {
          ...playerWar,
          playerIndicator: config.PLAYER_CONST,
          numHandCards: this.playerHand.handCards.length,
          numWinCards: this.playerHand.wonCards.length,
          warActionType: playerActionType
    });

    // pick random bot action
    const botAction = Phaser.Math.RND.pick([ 
      config.WAR_ACTIONS.DEFENSE,
      config.WAR_ACTIONS.HOLD,
      config.WAR_ACTIONS.MID_ATTACK,
      config.WAR_ACTIONS.BIG_ATTACK
    ]);
    // console.log('bot picked action');
    // console.log({botAction})
    const botCardsNeeded = this.getCardsForAction( botAction );
    const botWar = this.prepForWar( this.botHand, botCardsNeeded, this.botDraw );
    this.events.emit( 
      config.EVENTS.WAR_RESPONSE,
      {
          ...botWar,
          playerIndicator: config.OPPONENT_CONST,
          numHandCards: this.botHand.handCards.length,
          numWinCards: this.botHand.wonCards.length,
          botAction
    });

    // now actually do something with the war cards! (see who won)

    // first check if we blocked successfully either direction
    if( playerActionType == config.WAR_ACTIONS.DEFENSE && botAction == config.WAR_ACTIONS.BIG_ATTACK ) {
      // player wins. they get all the bot's cards.
      console.log('DING DING DING')
      this.playerHand.takeCards( botWar.warCards );
      this.events.emit( config.EVENTS.WAR_COMPLETE, config.PLAYER_CONST );
    }
    else if( botAction == config.WAR_ACTIONS.DEFENSE && playerActionType == config.WAR_ACTIONS.BIG_ATTACK ) {
      this.botHand.takeCards( playerWar.warCards );
      this.events.emit( config.EVENTS.WAR_COMPLETE, config.OPPONENT_CONST );
    }
    else {    // otherwise, compare values
      const summator = ( accumulator, currVal ) => accumulator + Math.floor( currVal / 4 );
      const playerTotal = playerWar.warCards.reduce( summator );
      const botTotal = botWar.warCards.reduce( summator );

      // tie goes to the player here. big TODO for now
      const winningHand = playerTotal >= botTotal ? this.playerHand : this.botHand;
      winningHand.takeCards( playerWar.warCards );
      winningHand.takeCards( botWar.warCards );
      const winningIndicator = winningHand == this.playerHand ? config.PLAYER_CONST : config.OPPONENT_CONST;

      const response = {
        playerTotal,
        botTotal,
        winningPlayer: winningIndicator,
      }

      // let the client know what happened
      this.events.emit( config.EVENTS.WAR_COMPLETE, response );
    }
  }

  checkEnd( hand, playerIndicator ){
    if( hand.handCards.length == 0 ){
      if( hand.wonCards.length == 0 ) {
        this.events.emit( config.EVENTS.GAME_OVER, playerIndicator );
      }
      else {
        hand.reshuffle();
        this.events.emit( config.EVENTS.RESHUFFLE, playerIndicator, hand.handCards.length );
      }
    }
  }

  getCardsForAction( warActionType ) {
    switch( warActionType ) {
      case config.WAR_ACTIONS.DEFENSE: 
        return BUTTONS.HIGH_DEF.cost;
      case config.WAR_ACTIONS.HOLD:
        return BUTTONS.HOLD.cost;
      case config.WAR_ACTIONS.MID_ATTACK:
        return BUTTONS.MID_ATT.cost;
      default: return 100;
    }
  }

  // checks whether there are enough cards in the hand of the given player.
  // if not, shuffles up and tells the client to update the UI
  prepForWar( hand, cardsNeeded, drawnCard ) {
    const needsReshuffle = hand.handCards.length < cardsNeeded;
    const warCards = hand.getCardsForWar( cardsNeeded ).concat( drawnCard );
    // console.log(warCards);

    return { warCards, needsReshuffle };
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
  // console.log({deck})

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