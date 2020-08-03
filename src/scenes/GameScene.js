import 'phaser';
import config from '../config/config'
import DomController from '../utils/DomController'
import PGGScene from './PGGScene';
import Referee from '../helpers/Referee';
import PlayerDisplay from '../helpers/Player';

const AVI_PADDING = { x: 10, y: 10 };
const AVI_SPRITE = "frogAvi";

export default class GameScene extends PGGScene 
{

	constructor() 
	{
		super('Game');
	}

	init()
	{
		console.log("init game")
	}

	create() 
	{
		//hide the display
		DomController.HideOverlay();
		
		// console.log("starting game scene");
		// this.bg = this.add.sprite(config.width / 2, config.height / 2,
    // 		config.ATLAS_NAME, config.TITLE_AND_GAME_BG);
    this.cameras.main.setBackgroundColor(0xCCCCCC);
    
    // add avatars
    const botAvatar = this.add.image( 
      config.width - AVI_PADDING.x, AVI_PADDING.y, 
      config.ATLAS_NAME, AVI_SPRITE );
    botAvatar.x -= botAvatar.width / 2;
    botAvatar.y += botAvatar.height / 2;
		
		const playerAvi = this.add.image( 
      AVI_PADDING.x, config.height - AVI_PADDING.y, 
      config.ATLAS_NAME, AVI_SPRITE );
		playerAvi.x += playerAvi.width / 2;
		playerAvi.y -= playerAvi.height / 2;

    // only the referee / server should know the state of the game
    // but the client should know how many cards it has
    const referee = new Referee();
    
    const player = new PlayerDisplay( this, referee );
    referee.onPlayerConnect( player );

    referee.shuffle();

	}
}