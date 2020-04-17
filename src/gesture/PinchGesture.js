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
        this.boot();//attache events 
        
        this.debugGraphics = this.scene.add.graphics();
        // link events to the main scene events 
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
        this.events.emit('drag2start', this);
    }

    onDrag2End() {
        this.events.emit('drag2end', this);
    }

    onDrag2() {
        this.emit('drag2', this);
    }

}