import DomController from '../utils/DomController'

class PGGScene extends Phaser.Scene 
{
	constructor(sceneKey)
	{
		super({key: sceneKey})

		this.key = sceneKey

		// this.dialogueView.muteEvent.on('mute clicked', this.onMuteClicked, this)
		
    window.addEventListener('resize', this.resizeApp, this);
    this.resizeApp();
	}

	resizeApp ()
	{
		// console.log("checking resize active in " + this.key)
		// if(this.scene.isActive(this.key))
		// {
			console.log("Resizing app in " + this.key)
		    // Width-height-ratio of game resolution
		    const game_ratio = 375 / 812;
			
		    // Make div full height of browser and keep the ratio of game resolution
		    const div = document.getElementById('phaser-game');
		    div.style.width = (window.innerHeight * game_ratio) + 'px';
		    div.style.height = window.innerHeight + 'px';
			
		    // Check if device DPI messes up the width-height-ratio
		    const canvas	= document.getElementsByTagName('canvas')[0];
			
		    const dpi_w	= parseInt(div.style.width) / canvas.width;
		    const dpi_h	= parseInt(div.style.height) / canvas.height;		
			
		    const height	= window.innerHeight * (dpi_w / dpi_h);
		    const width	= height * game_ratio;
			
		    // Scale canvas	
		    canvas.style.width	= width + 'px';
		    canvas.style.height	= height + 'px';
		    
		    const newWidth = (window.innerHeight * game_ratio) + 'px';
			
        const overlay = document.getElementById('overlay')
        overlay.style.width = newWidth
		    overlay.style.height = window.innerHeight + 'px';
		    overlay.style.transform = "translate(-50%, -50%)";
		
		    // let hud = document.getElementById('HUD')
		    // hud.style.width = newWidth
		    // hud.style.transform = "translate(-50%, -50%)"
		// }
	}
}

export default PGGScene;