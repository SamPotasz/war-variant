import 'phaser';
import config from '../config/config'

const HAND_STACK_POS = { x: 375 / 2, y: config.height - 50 }

export default class PlayerDisplay {
  constructor( scene, referee ) {
    this.scene = scene;
    this.referee = referee;

    this.events = new Phaser.Events.EventEmitter();

    this.numCardsInHand = 0;
    this.numCardsInWon = 0;

    this.handStack = this.scene.add.group();
    const created = this.handStack.createMultiple({ key: config.ATLAS_NAME, frame: config.CARD_BACK, 
      frameQuantity: 52 });
    Phaser.Actions.SetXY( this.handStack.getChildren(), HAND_STACK_POS.x, HAND_STACK_POS.y, 0, -2 );
    this.handStack.getChildren().forEach( child => {
      child.setInteractive({useHandCursor: true});
      child.on('pointerdown', this.onHandClick, this);
    });

    this.referee.events.on(
      config.EVENTS.INITIAL_DEAL,
      this.onInitialDeal,
      this );
    this.referee.events.on(
        config.EVENTS.PLAYER_DRAW_END,
        this.onDrawEnd,
        this );
  }

  onInitialDeal( numCardsDealt ) {
    // console.log("initial deal size " + numCardsDealt);
    this.numCardsInHand = numCardsDealt;
    this.updateStackDisplays();
  }

  // -1 for loss, +1 for win, 0 for tie / war
  onDrawEnd( result ) {
    // animate the flip. 

    // show the result.
    console.log( result );
  }

  onHandWon( numCardsWon ) {
    this.numCardsInWon += numCardsWon
    this.updateStackDisplays();
  }

  onHandClick() {
    console.log('hand click');
    this.events.emit(config.EVENTS.PLAYER_DRAW_START);
  }

  // update the graphics of what's in our hand
  updateStackDisplays() {
    this.updateHandStack();
    this.updateWonStack();
  }

  updateHandStack() {
    // console.log("updating hand stack to size " + this.numCardsInHand);
    this.handStack.getChildren().map( ( child, i ) => {
      child.setVisible( i < this.numCardsInHand );
    })
  }

  updateWonStack() {

  }
}