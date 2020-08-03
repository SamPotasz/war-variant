import 'phaser';
import config from '../config/config'
import DomController from '../utils/DomController'
 
export default class EndScene extends Phaser.Scene 
{
    constructor () 
    {
        super('End');
    }
 
    create () 
    {
        DomController.ShowEndgame(config.END_GAME_TITLE);

    	this.cameras.main.setBackgroundColor(config.END_GAME_BG_COLOR);
    	
    	// this.congrats = this.add.sprite(278, 99,
    	// 	config.ATLAS_NAME, 'congrats');
     //    this.congrats.setScale(0.5);
     //    console.log("congrats width: " + this.congrats.displayWidth);

        let basketConfig = config.END_GAME_ART
    	this.basket = this.add.sprite(basketConfig.x, basketConfig.y,
    		config.ATLAS_NAME, basketConfig.spriteName)
        // this.basket.setDisplaySize(basketConfig.width, basketConfig.height);
        // console.log("Basket width: " + this.basket.displayWidth + " x " + this.basket.displayHeight);   //101 x 116

        //winking rabbit
        let animFrames = this.anims.generateFrameNames(
            config.ATLAS_NAME, 
            {
                prefix: config.ANIMS.RABBIT_WINK.prefix,
                zeroPad: 4,
                start: 1,
                end: config.ANIMS.RABBIT_WINK.end,
            });
        // console.log(animFrames)
        this.anims.create({ key: 'wink', frames: animFrames, repeat: -1 });

        var rabbit = this.add.sprite(
            config.width * 3/4, config.height / 2 + 10,
            config.ATLAS_NAME).play('wink');


   //      let playSpriteName = 'PlayAgain0001';
   //   this.startButton = this.add.sprite( buttonX, buttonY,
            // config.ATLAS_NAME, playSpriteName )

        let buttonWidth = 122
        let buttonHeight = 35
        let buttonX = 245 - buttonWidth / 2
        let buttonY = 365 - buttonHeight / 2

        let startButton = this.add.text(buttonX, buttonY,
                'Play Again?', 
                { fontFamily: 'Muli', fontSize: 30, color: '#ffffff' })
        // Phaser.Display.Align.In.Center(startButton, 
        //     this.add.zone(0, 0, 550, 380))

        // let buttonX = startButton.x
        // let buttonY = startButton.y

        //add listener to the play again button
		startButton.setInteractive({useHandCursor: true})
		startButton.on('pointerdown', this.onStartDown, this)

		//little echo animation for start button
		let tweenDuration = 800
		let startShadows = []
		for(var i = 0; i < 3; i++)
		{
			let shadow = this.add.text(buttonX, buttonY,
                'Play Again?', 
                { fontFamily: 'Muli', fontSize: 30, color: '#ffffff' })
			shadow.alpha = 0.5
			startShadows.push(shadow);

            let finalXScale = 1.5 - i * 0.2;
            let finalWidth = buttonWidth * finalXScale;
            let deltaX = finalWidth - buttonWidth;

            let finalYScale = 2.0 - i * 0.25;
            let deltaY = (buttonHeight * finalYScale) - buttonHeight;

			this.tweens.add({
			    targets: shadow,
			    scaleY: { value: finalYScale, duration: tweenDuration },
			    scaleX: { value: finalXScale, duration: tweenDuration },
                x: {value: buttonX - deltaX / 2, duration: tweenDuration },
                y: {value: buttonY - deltaY / 2, duration: tweenDuration },
			    alpha: { value: 0, duration: tweenDuration },
			    loop: -1,
			    loopDelay: 500,
			});
		}

    }

    onStartDown()
    {
    	this.scene.start('Game');
    }
};