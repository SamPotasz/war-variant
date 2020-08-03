import 'phaser';
import config from '../config/config'

//how much to rotate the winning cards as we stack them
const ANGLE_PER_WIN_CARD = 3;

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
    this.flippedCard = null;

    this.numCardsInHand = 0;
    this.numCardsInWon = 0;

    this.handStack = this.scene.add.group();
    this.handStack.createMultiple({ key: config.ATLAS_NAME, frame: config.CARD_BACK, 
      frameQuantity: 52 });
    this.handStackY = isPlayer ? config.height - 50 : 50;
    this.handStackYStep = isPlayer ? -2 : 2;
    Phaser.Actions.SetXY( this.handStack.getChildren(), 
      config.width / 2, this.handStackY, 0, this.handStackYStep );
  
    this.winStack = this.scene.add.group();
    this.winStackX = isPlayer ? config.width * 3/4 : config.width * 1/4;
    this.winStackY = isPlayer ? config.height - padding - avatar.height / 2 : padding + avatar.height / 2;
    console.log(isPlayer, this.winStackX, this.winStackY);

    // make player's cards clickable
    if( isPlayer ){
      this.handStack.getChildren().forEach( child => {
        child.setInteractive({useHandCursor: true});
        child.on( 'pointerdown', this.onDrawClicked, this );
      });
    }
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
  }

  updateHandStack() {
    // console.log("updating hand stack to size " + this.numCardsInHand);
    this.handStack.getChildren().map( ( child, i ) => {
      child.setVisible( i < this.numCardsInHand );
    })
  }

  showFlip( cardNumber ) {
    console.log('flipping card ' + cardNumber);
    this.flippedCard = this.scene.add.sprite( 0, 0, config.ATLAS_NAME, 52 - cardNumber );
    // this.scene.add.existing(sprite);
    const yOffset = this.handStackYStep * this.numCardsInHand;
    this.flippedCard.setPosition( config.width / 2, this.handStackY + yOffset );
    // console.log(sprite.x, sprite.y);

    this.scene.tweens.add({
      targets: this.flippedCard,
      y: this.flipTargetY,
      duration: 300,
      ease: 'Quad.easeOut',
    })

    this.numCardsInHand--;
    this.updateHandStack();
  }

  // adds array of cards to winStack
  takeCards( cards ) {
    // console.log("flipping cards to ", this.winStack.x, this.winStack.y);
    cards.forEach( card => {
      this.winStack.add( card );
      this.scene.tweens.add({
        targets: card,
        x: { value: this.winStackX, duration: 400, ease: 'Quad.easeOut', delay: 500 },
        y: { value: this.winStackY, duration: 400, ease: 'Quad.easeOut', delay: 500  },
      })
    })
  }

  // move all the cards in the win stack to the main stack
  reshuffle( numCards ) {
    console.log('reshuffling ' + numCards );
    this.winStack.getChildren().forEach( (sprite, i) => {
      const delay = Math.random() * 500;
      // sprite.setFrame( config.CARD_BACK );
      this.scene.tweens.add({
        targets: sprite,
        x: { value: config.width / 2, duration: 300, delay },
        y: { value: this.handStackY + i * this.handStackYStep, duration: 300, delay },
        onComplete: () => { 
          this.winStack.remove( sprite );
          sprite.setVisible( false );
        }
      })
    })

    this.scene.time.addEvent({
      delay: 800,
      callback: this.onInitialDeal,
      args: [numCards],
      callbackScope: this
    })
  }
}

// takes in a number from 0 - 51 and returns corresponding sprite key
function getCardSprite( cardNumber, scene ) {
  return new Phaser.GameObjects.Sprite( scene, 0, 0, config.ATLAS_NAME, 52 - cardNumber );
}