import 'phaser';

console.log(window.screen.width);

export default {
	type: Phaser.AUTO,
	parent: 'phaser-game',
  resolution: window.devicePixelRatio,
	width: 375,
  height: 812,
  render: {
		antialias: false,
  },
  
  // sprite name stuff
	ATLAS_NAME: 'spriteAtlas',
  TITLE_AND_GAME_BG: 'background',	//file name of background for title screen and main gameplay
  CARD_BACK: 'back',
  AVATAR_SPRITE: 'frogAvi',
  INFO_BUTTON: 'info',
  ATTACK_BUTTONS: 'red_button08',
  HOLD_BUTTONS: 'grey_button10',
  DEFENSE_BUTTONS: 'blue_button11',

  EVENTS: {
    INITIAL_DEAL: 'first deal of the game',
    DRAW_BUTTON_CLICK: 'DRAW_BUTTON_CLICK',
    PLAYER_DRAW_START: 'PLAYER_DRAW_START',
    PLAYER_DRAW_END: 'PLAYER_DRAW_END',
    GAME_OVER: 'GAME_OVER_EVENT',
    RESHUFFLE: 'RESHUFFLE_EVENT',
    WAR_ACTION: 'WAR_ACTION_CLICKED',
    WAR_RESPONSE: 'WAR_SERVER_RESPONSE',
  },

  WAR_ACTIONS: {
    DEFENSE: "WAR_DEFENSE",
    HOLD: "WAR_HOLD",
    MID_ATTACK: "WAR_MID_ATTACK",
    BIG_ATTACK: "GOING ALL IN",
  },
  
  PLAYER_CONST: 'THIS IS FOR THE PLAYER',
  OPPONENT_CONST: 'THIS INDICATES THE EVENT IS FOR THE OPPONENT',

	//end screen stuff
	END_GAME_TITLE: "Congratulations!",		//title text
	END_GAME_BG_COLOR: 0x996699,			//background color
	END_GAME_ART: { spriteName: 'basketandeggs', x: 80, y: 266 }, //sprite to display on LHS of screen (w/ position info)

	
	ANIMS:
	{
		CHICK_EGG: //45x59
		{
			key: 'chick-egg',				//don't change this!
			prefix: 'chick-egg-small',		//prefix of the files. modify this to match your new anim!
			suffix: '_revision',			//if your file names have a suffix after the frame numbers, put that here
			repeat: -1,						//tells the game to repeat this anim forever
			start: 1,						//start on file PREFIX+START+SUFFIX
			end: 8,							//end on file PREFIX+END+SUFFIX
			frameRate: 24,					//how fast to play this animation
		},

		RABBIT_JUMP: 	//68 px wide
		{
			key: 'rabbit jump',				//don't change!
			prefix: 'ButterscotchJump', 	//prefix of the files. modify this to match your new anim!
			suffix: '_revision',			//if your file names have a suffix after the frame numbers, put that here
			repeat: -1,						//tells the game to repeat this anim forever
			start: 1,						//start on file PREFIX+START+SUFFIX
			end: 11,						//end on file PREFIX+END+SUFFIX
			frameRate: 24,					//how fast to play this animation
		},
		RABBIT_LUNGE:
		{
			key: 'lunge',					//don't change this!
			prefix: 'hammer',				//prefix of the files. modify this to match your new anim!
			suffix: '_relined',				//if your file names have a suffix after the frame numbers, put that here
			repeat: -1,						//tells the game to repeat this anim forever
			start: 1,						//start on file PREFIX+START+SUFFIX
			end: 6,							//end on file PREFIX+END+SUFFIX
			frameRate: 12,					//how fast to play this animation
		},
		RABBIT_WINK: 	//played on the end game screen.
		{
			key: 'wink',					//don't change this!
			prefix: 'Butterscotch-Logo',	//prefix of the files. modify this to match your new anim!
			repeat: -1,						//value of -1 says to repeat forever
			start: 1,						//start on file PREFIX+START
			end: 91,						//end on file PREFIX+END
			frameRate: 12,					//how fast to play this animation
		},
	},

	/*
		begin sfx config.
		Make sure files are spelled correctly or nothing will load or play :-(
		Also! Make sure they are located in assets/sfx
	*/
	LUNGE_SFX: 
	{
		key: 'LUNGE SFX',		//key can be whatever you want. just needs to be unique from other sfx
		mp3: 'Whoosh.mp3',		//file name of what you want to load & play for the sfx. MP3 format
		ogg: 'Whoosh.ogg',		//file name of what you want to load & play for the sfx. OGG format (web needs both)
	},
	CATCH_SFX: 
	{
		key: 'CATCH SFX',
		mp3: 'Chirp.mp3',
		ogg: 'Chirp.ogg',
	},
	EGG_MOVE_SFX: 
	{
		key: 'EGG MOVE SFX',
		mp3: 'Pop1.mp3',
		ogg: 'Pop1.ogg',
	},
};