import 'phaser';
import config from '../config/config'
import DomController from '../utils/DomController'
import PGGScene from './PGGScene';
 
export default class TitleScene extends Phaser.Scene
{
    constructor () 
    {
      super('Title');

		  // window.addEventListener('resize', this.resizeApp, this);

    }
 
    create () 
    {
      DomController.ShowOverlay(
        config.GAME_TITLE_TEXT,
        config.INSTRUCTION_TEXT)

    	this.bg = this.add.sprite(config.width / 2, config.height / 2,
    		config.ATLAS_NAME, config.TITLE_AND_GAME_BG);
        

      let buttonWidth = 77
      let buttonHeight = 26
      let startX = this.sys.game.config.width * 0.5 - buttonWidth / 2
      let startY = this.sys.game.config.height - 45 - buttonHeight / 2

      this.startButton = this.add.text(startX, startY,
        'Start', 
        { fontFamily: 'Muli', fontSize: 30, color: '#ffffff' })

        //add listener to the play again button		
        this.startButton.setInteractive({ useHandCursor: true  })
		this.startButton.on('pointerdown', this.onStartDown, this)

		//little echo animation for start button
		let tweenDuration = 800
		let startShadows = []
		for(var i = 0; i < 3; i++)
		{
            let shadow = this.add.text(startX, startY,
                'Start', 
                { fontFamily: 'Muli', fontSize: 30, color: '#ffffff' })
			shadow.alpha = 0.5
			startShadows.push(shadow);

            // let finalYScale = 2.0 - i * 0.25;
            let finalXScale = 1.5 - i * 0.2;
            let finalWidth = buttonWidth * finalXScale;
            let deltaX = finalWidth - buttonWidth;

            let finalYScale = 2.0 - i * 0.25;
            let deltaY = (buttonHeight * finalYScale) - buttonHeight;

			this.tweens.add({
			    targets: shadow,
			    scaleY: { value: finalYScale, duration: tweenDuration },
			    scaleX: { value: finalXScale, duration: tweenDuration },
                x: {value: startX - deltaX / 2, duration: tweenDuration },
                y: {value: startY - deltaY / 2, duration: tweenDuration },
			    alpha: { value: 0, duration: tweenDuration },
			    loop: -1,
			    loopDelay: 500,
			});
		}


    }

    resizeApp ()
	{
		// console.log("checking resize active in " + this.key)
		// if(this.scene.isActive(this.key))
		// {
			console.log("Resizing app in " + this.key)
		    // Width-height-ratio of game resolution
		    // Replace 360 with your game width, and replace 640 with your game height
		    let game_ratio = 240 / 400;
			
		    // Make div full height of browser and keep the ratio of game resolution
		    let div = document.getElementById('phaser-game');
		    div.style.width = (window.innerHeight * game_ratio) + 'px';
		    div.style.height = window.innerHeight + 'px';
			
		    // Check if device DPI messes up the width-height-ratio
		    let canvas	= document.getElementsByTagName('canvas')[0];
			
		    let dpi_w	= parseInt(div.style.width) / canvas.width;
		    let dpi_h	= parseInt(div.style.height) / canvas.height;		
			
		    let height	= window.innerHeight * (dpi_w / dpi_h);
		    let width	= height * game_ratio;
			
		    // Scale canvas	
		    canvas.style.width	= width + 'px';
		    canvas.style.height	= height + 'px';
		    
		    let newWidth = (window.innerHeight * game_ratio) + 'px';
			
			let overlay = document.getElementById('overlay')
			overlay.style.width = newWidth
		    overlay.style.height = window.innerHeight + 'px';
		    overlay.style.transform = "translate(-50%, -50%)";
		
		    // let hud = document.getElementById('HUD')
		    // hud.style.width = newWidth
		    // hud.style.transform = "translate(-50%, -50%)"
		// }
	}

    onStartDown()
    {
    	this.scene.start('Game');
    }
};