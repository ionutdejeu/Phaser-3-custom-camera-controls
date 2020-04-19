import Phaser from "phaser";
import logo_png from './assets/logo.png';
import {FollowScrollingCamera} from './shared/FollowScrollingCamera';
import { PinchGesture } from "./gesture/PinchGesture";
import { PinchScrollingCamera } from "./shared/PinchScrollingCamera";


var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  backgroundColor: '#000',
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var graphics;

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('logo', logo_png);
}

function create ()
{
  //  We need 2 extra pointers, as we only get 1 by default
  this.input.addPointer(2);
  console.log(this.input.pointersTotal);

  var sprite1 = this.add.sprite(600, 600, 'logo').setInteractive({ draggable: true });

  sprite1.on('drag', function (pointer, dragX, dragY) {

      this.x = dragX;
      this.y = dragY;

  });

  // var sprite2 = this.add.sprite(400, 300, 'logo').setInteractive({ draggable: true });

  // sprite2.on('drag', function (pointer, dragX, dragY) {

  //     this.x = dragX;
  //     this.y = dragY;

  // });

  // var sprite3 = this.add.sprite(400, 500, 'logo').setInteractive({ draggable: true });

  // sprite3.on('drag', function (pointer, dragX, dragY) {

  //     this.x = dragX;
  //     this.y = dragY;

  // });

  graphics = this.add.graphics();

  this.add.text(10, 10, 'Multi touch drag test', { font: '16px Courier', fill: '#000000' });
  this.cameras.remove(this.cameras.main);
  // var camera = new FollowScrollingCamera(this,{
  //     x:0,
  //     y:0,
  //     bottom:800,
  //     right:600
  // });
  var camera = new PinchScrollingCamera(this,{
        x:0,
        y:0,
        bottom:800,
        right:600
    });
}

function update ()
{
  // if (this.input.pointer1.isDown || this.input.pointer2.isDown || this.input.pointer3.isDown)
  // {
  //     graphics.clear();
  // }

  // graphics.fillStyle(0xff0000, 1);
  // graphics.fillRect(this.input.pointer1.x, this.input.pointer1.y, 44, 44);

  // graphics.fillStyle(0x00ff00, 1);
  // graphics.fillRect(this.input.pointer2.x, this.input.pointer2.y, 44, 44);

  // graphics.fillStyle(0x0000ff, 1);
  // graphics.fillRect(this.input.pointer3.x, this.input.pointer3.y, 44, 44);
}
