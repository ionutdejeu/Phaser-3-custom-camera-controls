

export class JoystickCameraGameObject extends Phaser.GameObjects.Container {

    constructor(camera,
        radius,
        color,
        strokeWidth
        ) {
            
        
        super(camera.scene, 0, 0);
        camera.scene.add.existing(this);
        this.camera = camera;
        this.setSize(0,0);
        this.setScrollFactor(0,0);
        //this.setOrigin(0.5,0.5);

        this.direction      = new Phaser.Geom.Point(0, 0);
		this.distance       = 0;
		this.pinAngle       = 0;
        this.zero           = new Phaser.Geom.Point(0,0);
        this.dragOrigin     = new Phaser.Math.Vector2(0,0);
         
         
        this.boundaryGraphics = this.scene.add.graphics();
        this.boundaryGraphics.setScrollFactor(0,0);
        this.boundaryGraphics.fillStyle(color|| 0x62C2CC);
        this.boundaryGraphics.lineStyle(strokeWidth|| 1, color|| 0x62C2CC, 1);
        this.boundaryGraphics.strokeCircle(0,0, radius||100);
        this.boundaryGraphics.strokeCircle(0,0, 1);
         
        this.lineGraphics = this.scene.add.graphics();
        this.lineGraphics.fillStyle(color|| 0x62C2CC);
        this.lineGraphics.setScrollFactor(0,0);

        this.tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        this.tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix();

        this.text1 = this.scene.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
        this.text2 = this.scene.add.text(150, 10, '', { font: '16px Courier', fill: '#00ff00' });
        this.text3 = this.scene.add.text(300, 10, '', { font: '16px Courier', fill: '#00ff00' });
        
        this.add(this.text1);
        this.add(this.text2);
        this.add(this.text3);
        
        this.add(this.boundaryGraphics);
        this.add(this.lineGraphics);
        
        this.visible = false;
        this.scene.input.on('dragstart', function (pointer, gameObject) {
            //this.setPosition(pointer.x+this.camera.scrollX,pointer.y+this.camera.scrollY);
            this.setPosition(pointer.x,pointer.y);
            this.visible = true;
            //this.dragOrigin.set(pointer.x+this.camera.scrollX,pointer.y+this.camera.scrollY);
            this.dragOrigin.set(pointer.x,pointer.y);
            console.log('DragOrigin:',this.dragOrigin,'Local Position:',this.x,this.y);

        },this);
        
        
        this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            
            this.lineGraphics.clear();
            var dragger = this.camera.matrix.applyInverse(dragX,dragY);
            var dragger2 = new Phaser.Math.Vector2(dragX,dragY);
            this.getWorldTransformMatrix(this.tempMatrix, this.tempParentMatrix);

            //this.tempMatrix = this.camera.matrix;
            var d = this.tempParentMatrix.decomposeMatrix();

            // var diffVector = this.dragOrigin.clone().subtract(new Phaser.Math.Vector2(d.translateX,d.translateY));
            // var translatedVector = diffVector.clone();
            // var angle = this.pinAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(this.dragOrigin, dragger));
            // var distance  = this.distance = Phaser.Geom.Point.GetMagnitude(diffVector);
            // var direction = new Phaser.Math.Vector2(diffVector).normalize();
            // this.lineGraphics.lineBetween(this.dragOrigin.x,this.dragOrigin.y,dragger.x,dragger.y);
            // this.lineGraphics.lineBetween(this.dragOrigin.x,this.dragOrigin.y,dragger2.x,dragger2.y);
            // this.lineGraphics.lineBetween(this.dragOrigin.x,this.dragOrigin.y,d.translateX,d.translateY);
            this.lineGraphics.lineBetween(0,0,dragX,dragY);
           
            this.lineGraphics.lineStyle(1, 0x00ff00, 1);
            this.lineGraphics.strokeCircle(0,0, 10);

            var dragger3 = this.tempMatrix.applyInverse(dragX,dragY);
            this.lineGraphics.lineBetween(0,0,dragger3.x,dragger3.y);
            this.lineGraphics.lineStyle(1, 0x0000FF, 1);
            var dragger4 = this.tempMatrix.applyInverse(pointer.x,pointer.y);
            this.lineGraphics.lineBetween(0,0,Phaser.Math.Clamp(dragger4.x,-100,100),Phaser.Math.Clamp(dragger4.y,-100,100));

            this.text1.setText([
                'camera',
                'x: ' + d.translateX,
                'y: ' + d.translateY,
                'sx: ' + d.scaleX,
                'sy: ' + d.scaleY,
                'center x: ' + this.camera.centerX,
                'center y: ' + this.camera.centerY,
                'cam. scroll x' + this.camera.scrollX,
                'cam. scroll y' + this.camera.scrollY,
                'r: ' + Phaser.Math.RadToDeg(d.rotation), 
            ]);
            this.text3.setText([
                'drag',
                'origin x: ' + this.dragOrigin.x,
                'origin Y: ' + this.dragOrigin.y,
                'dragX: ' + dragger.x,
                'dragY: ' + dragger.y,
                //'angle: ' + angle,
                //'distance'+ distance,
                //'directionX'+direction.x,
                //'directionY'+direction.y,
                
            ]);
            this.text2.setText([
                'camera',
                'x: ' + this.camera.x,
                'y: ' + this.camera.y,
                'scrollX: ' + this.camera.scrollX,
                'scrollY: ' + this.camera.scrollY,
                'width: ' + this.camera.width,
                'height: ' + this.camera.height,
                'right: ' + this.camera.right,
                'left: ' + this.camera.left,
                'top: ' + this.camera.top,
                'bottom: ' + this.camera.bottom
            ]);

           
            
        },this);
    
        this.scene.input.on('dragend', function (pointer, gameObject) {
           
            this.visible = false;
            //this.dragOrigin.setTo(pointer.x,pointer.y);
        },this);
        
    }
    enable() {
        this.disabled = false;
    }
    disable() {
        this.disabled = true;
    }
     
}