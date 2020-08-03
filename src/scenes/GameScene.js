import 'phaser';
import config from '../config/config'
import DomController from '../utils/DomController'
import PGGScene from './PGGScene';
import Referee from '../helpers/Referee';

import HandDisplay from '../helpers/HandDisplay';

const AVI_PADDING = { x: 10, y: 10 };


export default class GameScene extends PGGScene 
{

	constructor() 
	{
		super('Game');
	}

	init()
	{
    console.log("init game")
    
    // only the referee / server should know the state of the game
    // but the client should know how many cards it has
    this.referee = new Referee( this );
	}

	create() 
	{
    this.events = new Phaser.Events.EventEmitter();

		//hide the display
		DomController.HideOverlay();
		
		// console.log("starting game scene");
		// this.bg = this.add.sprite(config.width / 2, config.height / 2,
    // 		config.ATLAS_NAME, config.TITLE_AND_GAME_BG);
    this.cameras.main.setBackgroundColor(0xCCCCCC);

    
    this.botDisplay = new HandDisplay({
      scene: this,
      isPlayer: false,
    })
    this.playerDisplay = new HandDisplay({ 
      scene: this,
      isPlayer: true, 
    });
    this.playerDisplay.events.on(config.EVENTS.DRAW_BUTTON_CLICK, this.onDrawClicked, this);

    this.referee.events.on(
      config.EVENTS.INITIAL_DEAL,
      this.onInitialDeal,
      this );
    this.referee.events.on(
        config.EVENTS.PLAYER_DRAW_END,
        this.onDrawEnd,
        this );

    this.referee.onClientConnect( this );

    this.referee.shuffle();

  }

  onInitialDeal( numCardsDealt ) {
    this.botDisplay.onInitialDeal( numCardsDealt );
    this.playerDisplay.onInitialDeal( numCardsDealt );
  }

  onDrawEnd( result ) {
    console.log('draw result: ' + result);
  }
  
  onDrawClicked() {
    console.log('draw clicked!');
    // this.referee.onPlayerDraw();
    this.events.emit( config.EVENTS.PLAYER_DRAW_START );
  }
}