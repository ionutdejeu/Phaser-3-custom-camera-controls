const GetValue = Phaser.Utils.Objects.GetValue;
const SpliceOne = Phaser.Utils.Array.SpliceOne;
const DistanceBetween = Phaser.Math.Distance.Between;
const AngleBetween = Phaser.Math.Angle.Between;

const TOUCH0 = 0;
const TOUCH1 = 1;
const TOUCH2 = 2;

const IDLE = 'IDLE';
const BEGIN = 'BEGIN';
const RECOGNIZED = 'RECOGNIZED';


export class PinchGesture{
    constructor(scene,config){
        this.scene = scene;
        this.pointers = [];
        this.movedState = {};
        this.tracerState = TOUCH0;
        this.dragThreshold = 0;
        this.state = IDLE;
        this.boot();//attache events 
        
        this.debugGraphics = this.scene.add.graphics();
        // link events to the main scene events 

        this.stateText = this.scene.add.text(100, 100, '', { font: '16px Courier', fill: '#00ff00' });

        this.events = this.scene.events;
        this.drawPointerDebug();
        
    }

    boot() {
        this.scene.input.on('pointerdown', this.onPointerDownHandler, this);
        this.scene.input.on('pointerup', this.onPointerUpHandler, this);
        this.scene.input.on('pointermove', this.onPointerMoveHandler, this);
    }
    drawPointerDebug(pointer){

       
        this.debugGraphics.clear();
        this.pointers.forEach(p => {
            this.debugGraphics.fillStyle(0x00ff00, 1);
            this.debugGraphics.fillRect(p.x, p.y, 44, 44);
        });
        this.stateText.setText([
            'Pinch Gesture',
            'state: ' + this.state,
            'scale: ' + this.scaleFactor,
            'previousDinstance: ' + this.prevDistanceBetweenTouchPoints
        ]);
    }

    transitionTo(newState){
        
        switch(this.state){
            case undefined:
                // before 
                this.state = IDLE
                this.prevDistanceBetweenTouchPoints = 0
                this.scaleFactor = 1 // initial default output value
                break;
            case RECOGNIZED: 
                if(newState !== RECOGNIZED) 
                {
                    this.events.emit('pinchend',this);
                }
                break;
        }
        switch(newState){
            case IDLE:
                this.events.emit('pinchend',this);
                break;
             
        }

        this.state = newState;
    }
    onPointerDownHandler(pointer){
        
        if (this.pointers.length === 2) {
            return;
        }
        var index = this.pointers.indexOf(pointer);
        if(index !== -1){
            return;
        }
        this.movedState[pointer.id] = false;
        this.pointers.push(pointer);
        this.drawPointerDebug();
        
        switch (this.tracerState) {
            case TOUCH0:
                this.tracerState = TOUCH1;
                this.onDrag1Start();
                break;
            case TOUCH1:
                this.tracerState = TOUCH2;
                this.onDrag2Start();
                break;
        }

    }
    onPointerUpHandler(pointer){
        
        this.drawPointerDebug();
        var index = this.pointers.indexOf(pointer);
        if(index === -1){
            return;
        }
        var index = this.pointers.indexOf(pointer);
        if (index === -1) { // Not in catched pointers
            return;
        } else {
            delete this.movedState[pointer.id];
            SpliceOne(this.pointers, index);
        }
        switch (this.tracerState) {
            case TOUCH1:
                this.tracerState = TOUCH0;
                this.onDrag1End();
                break;
            case TOUCH2:
                this.tracerState = TOUCH1;
                this.onDrag2End();
                this.onDrag1Start();
                break;
        }
    }
    onPointerMoveHandler(pointer){   
        this.drawPointerDebug();
        if(pointer.isDown){
            var isTrackedPointer = (this.pointers.indexOf(pointer) !== -1);
            if(!this.movedState[pointer.id]){
                this.movedState[pointer.id] = (pointer.x !== pointer.downX) || (pointer.y !== pointer.downY);   
            }
            if(this.movedState[pointer.id]){
                switch (this.tracerState) {
                    case TOUCH1:
                        this.onDrag1();
                        break;
                    case TOUCH2:
                        this.onDrag2();
                        break;
                }
            }
        }
    }
    onDrag1Start() {
        this.events.emit('drag1start', this);
    }

    onDrag1End() {
        this.events.emit('drag1end', this);
    }

    onDrag1() {
        this.events.emit('drag1', this);
    }

    onDrag2Start() {
        this.scaleFactor = 1;
        this.prevDistanceBetweenTouchPoints = this.distanceBetween;
        //this.state = (this.dragThreshold === 0) ? RECOGNIZED : BEGIN;
        this.transitionTo((this.dragThreshold === 0) ? RECOGNIZED : BEGIN);
        this.events.emit('drag2start', this);
    }

    onDrag2End() {
        this.transitionTo(IDLE);
        this.events.emit('drag2end', this);
    }

    onDrag2() {
        switch (this.state) {
            case BEGIN:
                if ((this.pointers[0].getDistance() >= this.dragThreshold) &&
                    (this.pointers[1].getDistance() >= this.dragThreshold)) {
                    var curDistance = this.distanceBetween;
                    this.scaleFactor = curDistance / this.prevDistanceBetweenTouchPoints;
                    this.prevDistanceBetweenTouchPoints = curDistance;
                    this.transitionTo(RECOGNIZED)
                    //this.state = RECOGNIZED;
                }
                break;
            case RECOGNIZED:
                var curDistance = this.distanceBetween;
                this.scaleFactor = curDistance / this.prevDistanceBetweenTouchPoints;
                this.events.emit('pinch', this);
                this.prevDistanceBetweenTouchPoints = curDistance;
                break;
        }
        this.events.emit('drag2', this);
    }
    get distanceBetween(){
        if(this.tracerState != TOUCH2){
            return 0;
        }
        var p0 = this.pointers[0],p1 = this.pointers[1];
        return DistanceBetween(p0.x,p0.y,p1.x,p1.y);
    }
    get angleBetween(){
        if(this.tracerState != TOUCH2){
            return 0;
        }
        var p0 = this.pointers[0],
            p1 = this.pointers[1];
        return AngleBetween(p0.x, p0.y, p1.x, p1.y);
    }

}