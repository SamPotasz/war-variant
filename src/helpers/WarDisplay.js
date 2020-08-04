import config from '../config/config';

// TODO: implement better UI for these options messaging
export const BUTTONS = {
  HIGH_DEF: {
    label: "DEFENSE!",
    key: config.WAR_ACTIONS.DEFENSE,
    sprite: config.DEFENSE_BUTTONS,
    cost: 8,
    info: "An automatic win against BIG ATTACKs!\nBut you TRASH 5 cards to do so...",
  },
  HOLD: {
    label: "HOLD STEADY",
    key: config.WAR_ACTIONS.HOLD,
    sprite: config.HOLD_BUTTONS,
    cost: 4,
    info: "Just wager the minimum 4 cards you need to go to war. The middle road, low-cost option.",
  },
  MID_ATT: {
    label: "MID ATTACK",
    key: config.WAR_ACTIONS.MID_ATTACK,
    sprite: config.ATTACK_BUTTONS,
    cost: 12,
    info: "Wager 12 whole cards to try and turn the tides.",
  },
  BIG_ATT: {
    label: "BIG ATTACK!",
    key: config.WAR_ACTIONS.BIG_ATTACK,
    sprite: config.ATTACK_BUTTONS,
    cost: "All",
    info: "Go all in! Wager all your additional cards to gain their points towards winning this war.",
  },
}

export class WarDisplay {
  constructor( {scene} ) {
    this.scene = scene;
    this.events = new Phaser.Events.EventEmitter();
  }

  declareWar( numPlayerCards ) {
    // console.log(numPlayerCards)
    this.title = this.scene.add.text( config.width / 2, config.height / 3,
      'WAR!', 
      { fontFamily: 'Boogaloo', fontSize: 60, color: '#000000' });
    
    this.title.setScale( 0.1 );
    this.title.setOrigin( 0.5 );
    this.scene.tweens.add({
      targets: this.title,
      scale: { value: 1.0, duration: 1000 },
      angle: { value: 360 * 4, duration: 1000 },
      completeDelay: 500,
      onComplete: () => this.addUI(numPlayerCards),
      // onCompleteParams: [numPlayerCards],
      // onCompleteScope: this
    })
  }

  addUI( numPlayerCards ) {
    console.log(numPlayerCards);
    const fontStyle = { fontFamily: 'Muli', 
      fontSize: 15, color: '#000000', align: 'center'};

    this.label = this.scene.add.text( config.width / 2, config.height / 3 + 70,
      "Choose your strategy!\nYou can use a special power in addition\nto wagering the minimum 4 cards necessary.\nYou have " + numPlayerCards + " cards left.",
      fontStyle);
    this.label.setOrigin( 0.5 );

    // create buttons
    this.buttonGroup = this.scene.add.group();
    const buttonY = this.label.y + 100;
    Object.values(BUTTONS).map( (value, i) => {

      const x = i * 90 + 50;
      const buttonStyle = { fontFamily: 'Muli', fontSize: 10, color: '#000000' };

      const button = this.scene.add.sprite( 
        x, buttonY, 
        config.ATLAS_NAME, value.sprite);
      button.setScale( 1.7, 1.0 );
      button.setInteractive({useHandCursor: true});
      button.on('pointerdown', 
        () => this.events.emit( config.EVENTS.WAR_ACTION, value.key ))

      const buttonLabel = this.scene.add.text( x, buttonY,
        value.label + "\n+" + value.cost + " Cards", fontStyle );
      buttonLabel.setOrigin( 0.5 );

      // determine if we can pay the cost
      let canPay
      if( value.cost !== "All" ) {
         canPay = numPlayerCards >= value.cost;
      }
      else { 
        canPay = numPlayerCards > BUTTONS.MID_ATT.cost;
      }

      // TODO: something better than alerts
      let infoButton = this.scene.add.sprite(
        x, buttonY + 50, config.ATLAS_NAME, config.INFO_BUTTON );
      infoButton.setScale( 0.25 );
      infoButton.setInteractive({useHandCursor: true});
      infoButton.on('pointerdown', 
        () => alert( value.info ));

      if( !canPay ) {
        button.setInteractive( false );
        button.setTint('0xffffff');
      }

      this.buttonGroup.addMultiple( [button, buttonLabel, infoButton ]);
    });
  }

  close() {
    this.buttonGroup.clear( true, true );
    this.title.setVisible(false);
    this.label.setVisible(false);
  }

  showResults( playerScore, botScore ) {
    this.title = this.scene.add.text( config.width / 2, config.height / 3,
      'WAR!', 
      { fontFamily: 'Boogaloo', fontSize: 60, color: '#000000' });
    
    this.title.setScale( 0.1 );
    this.title.setOrigin( 0.5 );

    const addOn = playerScore >= botScore ? "You win!" : "You lose!";
    this.title.text = "Your score: " + playerScore + "\nOpponent: " + botScore + "\n" + addOn;
  }
}