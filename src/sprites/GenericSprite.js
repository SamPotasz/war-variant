import 'phaser';
import config from '../config/config'

export default class GenericSprite extends Phaser.GameObjects.Sprite
{
	constructor(_config)
	{
		super(_config.scene, _config.x, _config.y, _config.atlas, '');
		_config.scene.add.existing(this);

		// let frames = this.scene.anims.generateFrameNames( config.ATLAS_NAME,
		// {
		// 	prefix: config.ANIMS.CHICK_EGG.prefix,
		// 	start: 1,
		// 	end: config.ANIMS.CHICK_EGG.end,
		// })
		// console.log("frames for " + config.ANIMS.CHICK_EGG.prefix + ":");
		// console.log(frames);

		// this.walkAnim = this.scene.anims.create(
		// {
		// 	key: config.ANIMS.CHICK_EGG.key,
		// 	frames: frames, 
		// 	repeat: -1,
		// 	// yoyo: true,
		// 	frameRate: config.ANIMS.CHICK_EGG.frameRate,
		// })

		// this.moveSFX = this.scene.sound.add(config.EGG_MOVE_SFX.key);

		// this.setInteractive();
		// this.on('pointerdown', this.onPointerDown, this)
	}
}