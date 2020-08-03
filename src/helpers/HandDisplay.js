import 'phaser';
import config from '../config/config'

const HAND_STACK_POS = { x: 375 / 2, y: config.height - 50 }

export default class HandDisplay {
  constructor({ scene, isPlayer }) {
    this.scene = scene;

    this.events = new Phaser.Events.EventEmitter();

    const avatar = this.scene.add.image( 0, 0, config.ATLAS_NAME, config.AVATAR_SPRITE );
    const padding = 10;
    avatar.x = isPlayer ? padding + avatar.width / 2 : config.width - padding - avatar.width / 2;
    avatar.y = isPlayer ? config.height - padding - avatar.height / 2 : padding + avatar.height / 2;

    // y position cards get flipped to for each player
    this.flipTargetY = isPlayer ? config.height / 2 + 50 : config.height / 2 - 50;

    this.numCardsInHand = 0;
    this.numCardsInWon = 0;

    this.handStack = this.scene.add.group();
    this.handStack.createMultiple({ key: config.ATLAS_NAME, frame: config.CARD_BACK, 
      frameQuantity: 52 });
    this.handStackY = isPlayer ? config.height - 50 : 50;
    this.handStackYStep = isPlayer ? -2 : 2;
    Phaser.Actions.SetXY( this.handStack.getChildren(), 
      config.width / 2, this.handStackY, 0, this.handStackYStep );
  
    // make player's cards clickable
    if( isPlayer ){
      this.handStack.getChildren().forEach( child => {
        child.setInteractive({useHandCursor: true});
        child.on( 'pointerdown', this.onDrawClicked, this );
      });
    }

    this.flippedCard = null;
  }

  onInitialDeal( numCardsDealt ) {
    // console.log("initial deal size " + numCardsDealt);
    this.numCardsInHand = numCardsDealt;
    this.updateStackDisplays();
  }

  onHandWon( numCardsWon ) {
    this.numCardsInWon += numCardsWon
    this.updateStackDisplays();
  }

  onDrawClicked() {
    this.events.emit(config.EVENTS.DRAW_BUTTON_CLICK);
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

  showFlip( cardNumber ) {
    console.log('flipping card ' + cardNumber);
    const sprite = this.scene.add.sprite( 0, 0, config.ATLAS_NAME, 52 - cardNumber );
    // this.scene.add.existing(sprite);
    const yOffset = this.handStackYStep * this.numCardsInHand;
    sprite.setPosition( config.width / 2, this.handStackY + yOffset );
    console.log(sprite.x, sprite.y);

    this.scene.tweens.add({
      targets: sprite,
      y: this.flipTargetY,
      duration: 600,
      ease: 'Quad.easeOut',
    })

    this.numCardsInHand--;
    this.updateHandStack();
  }
}

// takes in a number from 0 - 51 and returns corresponding sprite key
function getCardSprite( cardNumber, scene ) {
  return new Phaser.GameObjects.Sprite( scene, 0, 0, config.ATLAS_NAME, 52 - cardNumber );
}