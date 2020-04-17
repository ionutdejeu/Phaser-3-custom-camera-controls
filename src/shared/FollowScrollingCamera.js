import { JoystickCameraGameObject } from "./JoyStickCameraObject";

export const FollowScrollingCameraEvents = {
    PlayerSelectionChanged:'FollowScrollingCamera::StartFollowingObjectEvent',
    PlayerSelectionCanceled:'FollowScrollingCamera::StopFollowingObjectEvent'
}
export class FollowScrollingCamera extends Phaser.Cameras.Scene2D.Camera {
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
    ) {
        super(x, y, width, height);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width || this.scene.game.config.width;
        this.height = height || this.scene.game.config.height;

        this.top = top;
        this.bottom = bottom - this.height;       
        this.right = right - this.width;
        this.left = left; 
        this.draggedGameObject = null;
        this.setBounds(x, y, right,bottom);

         
        this.setRoundPixels(true);
       
        this.init();
        this.joyStick = new JoystickCameraGameObject(this);
        
    }
    
    init() {
        this.scrollPosition = new Phaser.Math.Vector2(this.x, this.y);
        this.scrollY = this.top || this.y;
        this.scrollX = this.left || this.x;

        this._rectangle = new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
         
        this.setDragEvent();
        this.centerToBounds();
        this.scene.cameras.addExisting(this,true);
    }
    initEvents(){
         
    }

    setDragEvent() {
        this.scene.input.on('pointermove',  this.dragHandler,   this);
        this.scene.input.on('pointerup',    this.upHandler,     this);
        this.scene.input.on('pointerdown',  this.downHandler,   this);
        this.scene.input.on('dragstart',    this.objectDragStart,this);
        this.scene.input.on('dragend',      this.objectDragEnd, this);
        this.scene.input.on('drag',         this.objectDragEvent,this);
        
    }
    objectDragStart(pointer,gameObject){
        
        this.draggedGameObject = gameObject;
    }
    objectDragEnd(pointer,gameObject){
        this.draggedGameObject = null;
        
    }
    objectDragEvent(pointer, gameObject, dragX, dragY) {
         
        // var dragger = this.matrix.applyInverse(dragX,dragY);
        // var angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(this.zero, dragger));
        // var distance  = Phaser.Geom.Point.GetMagnitude(dragger)
        // var direction = new Phaser.Math.Vector2(dragger).normalize();
        // //this.lineGraphics.lineBetween(0,0,dragger.x,dragger.y);
        // console.log(dragger,angle,direction);
                
    }

    downHandler() {
        
        
    }
     

    dragHandler(pointer) {
        
        if (pointer.isDown && this.isOver(pointer) && this.draggedGameObject===null ) {
            

            this.startY = this.scrollY;
       
            this.scrollY -= (pointer.position.y - pointer.prevPosition.y);
            this.scrollX -= (pointer.position.x - pointer.prevPosition.x);
            
            
            this.moving = true;
        }
    }
    update(time,delta){
        if(this.moving)
        {
            this.clampScroll();
        }
       
    }
    upHandler() {
       
        this.moving = false;
    }

    isOver(pointer) {
        return this._rectangle.contains(pointer.x, pointer.y);
    }
    clampScroll() {
        if(this.moving){
            this.scrollY = Phaser.Math.Clamp(this.scrollY, this.top, this.bottom);
            this.scrollX = Phaser.Math.Clamp(this.scrollX,this.left,this.right); 
             
        }
    }

    destroy() {
        this.emit(Events.DESTROY, this);
        
        this.removeAllListeners();
        this.matrix.destroy();
        this.culledObjects = [];
        if (this._customViewport) {
            //  We're turning off a custom viewport for this Camera
            this.sceneManager.customViewports--;
        }
        this._bounds = null;
        this.scene = null;
        this.scaleManager = null;
        this.sceneManager = null;

    }
}