import { PinchGesture } from "../gesture/PinchGesture";

export class PinchScrollingCamera extends Phaser.Cameras.Scene2D.Camera {
    constructor(
        scene,
        {
            x = 0,
            y = 0,  
            width,
            height,
            top = 0,
            bottom = 5000,
            right = 5000,
            left = 0,
        }
    )
    {
        super(x, y, width, height);
        this.scene = scene;
        this.scene.cameras.addExisting(this,true);
        this.punchGesture = new PinchGesture(this.scene,{});
        this.scene.events.on('drag1',(dragScale)=>{
            console.log("drag1",dragScale);
        });
        this.scene.events.on('pinch',(dragScale)=>{
            var scaleFactor = dragScale.scaleFactor;
            this.zoom *= scaleFactor;
            console.log(this.zoom, scaleFactor);
        });
        
    }

}