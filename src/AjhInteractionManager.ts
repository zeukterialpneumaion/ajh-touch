import { Camera, Object3D, Raycaster, Renderer, Scene, Vector2 } from 'three';

// =============================================================== //
/** 
 * InteractiveObject :: class 
 * */
// =============================================================== //

export class InteractiveObject {

  target: Object3D;       
  name: string;
  intersected: boolean;
  wasIntersected: boolean = false;
  distance: number;

  constructor(target: Object3D, name: string) {

    this.target = target;
    this.name = name;
    this.intersected = false;
    this.distance = 0;

  }

}

// =============================================================== //
/** 
 * InteractiveEvent :: class 
 * */
// =============================================================== //

export class InteractiveEvent {

  type: string;
  cancelBubble: boolean;
  originalEvent: Event | null;

  // Dummy default values
  coords: Vector2 = new Vector2(0, 0);
  distance: number = 0;
  intersected: boolean = false;
  id : number = 0;

  constructor(type: string, originalEvent: Event | null = null) {

    this.cancelBubble = false;
    this.type = type;
    this.originalEvent = originalEvent;
    this.id = 0;

  }

  stopPropagation() {

    this.cancelBubble = true;

  }

}

// =============================================================== //
/** 
 * InteractionManagerOptions :: class 
 * */
// =============================================================== //

export class InteractionManagerOptions {

  bindEventsOnBodyElement: boolean = true;
  autoAdd: boolean = false;
  scene: Scene | null = null;

  constructor(

    options: {

      bindEventsOnBodyElement?: boolean | undefined;
      autoAdd?: boolean | undefined;
      scene?: Scene | undefined;

    }

  ) {

    if (options && typeof options.bindEventsOnBodyElement !== 'undefined') {

      this.bindEventsOnBodyElement = options.bindEventsOnBodyElement;

    }

    if (options && typeof options.scene !== 'undefined') {

      this.scene = options.scene;

    }

    if (options && typeof options.autoAdd !== 'undefined') {

      this.autoAdd = options.autoAdd;

    }

  }
}

// =============================================================== //
/** 
 * InteractionManager :: class 
 * */
// =============================================================== //

export class InteractionManager {

  renderer: Renderer;
  camera: Camera;
  domElement: HTMLElement;
  bindEventsOnBodyElement: boolean;
  autoAdd: boolean;

  scene: Scene | null;

  mouseInstances: Array<Vector2> = new Array<Vector2>();

  supportsPointerEvents: boolean;

  interactiveObjects: Array<Array<InteractiveObject>> = new Array<Array<InteractiveObject>>;

  closestObjects: Array<InteractiveObject | null> = new Array<InteractiveObject | null>();

  raycasterInstances: Array<Raycaster> = new Array<Raycaster>();

  treatTouchEventsAsMouseEvents: boolean;

  maxTouches: number = 16;

  constructor(

    renderer: Renderer,
    camera: Camera,
    domElement: HTMLElement,
    maxTouches: number = 16,
    options?: InteractionManagerOptions
    
  ) {

    this.renderer = renderer;
    this.camera = camera;
    this.domElement = domElement;
    this.maxTouches = maxTouches;

    this.bindEventsOnBodyElement 
    =
      options && typeof options.bindEventsOnBodyElement !== 'undefined'
        ? options.bindEventsOnBodyElement
        : true;

    this.scene 
    =
      options && (typeof options.scene !== 'undefined') 
      ?
      options.scene : null;

    if (this.scene) {

      this.scene.onBeforeRender 
      = () => {

        if (this.autoAdd && this.scene !== null) {

          this.scene.traverse(
                          
            (object) => {

              this.add(object);

              object.addEventListener(
                'removed', 
                (o) => {
                  this.remove(o.target);
                }
              );

            }

          );

        }

        this.update();

      };

    }

    this.autoAdd 
    =
      options && typeof options.autoAdd !== 'undefined'
        ? options.autoAdd
        : false;

    if (this.autoAdd && this.scene === null) {

      console.error(
        'Attention: Options.scene needs to be set when using options.autoAdd'
      );

    }

    for (
      let index = 0; 
      index < this.maxTouches; 
      index++
    ) {

      // array of mouse coordinates
      // top left default position
      this.mouseInstances.push(new Vector2(-1, 1));
      
      // array of raycasters
      this.raycasterInstances.push(new Raycaster()); 

      // create empty interactive objects array
      this.interactiveObjects.push( new Array<InteractiveObject>() ); 
      
      this.closestObjects.push( null );
    }
 
    this.supportsPointerEvents = !!window.PointerEvent;

    //this.interactiveObjects = [];
    this.closestObjects[0] = null;

    domElement.addEventListener('click', this.onMouseClick);

    if (this.supportsPointerEvents) {

      if (this.bindEventsOnBodyElement) {
        
        domElement.ownerDocument.addEventListener(
          'pointermove',
          this.onDocumentPointerMove
        );

      } else {

        domElement.addEventListener(
          'pointermove', 
          this.onDocumentPointerMove
        );

      }

      domElement.addEventListener('pointerdown', this.onPointerDown);
      domElement.addEventListener('pointerup', this.onPointerUp);

    }

    if (this.bindEventsOnBodyElement) {

      domElement.ownerDocument.addEventListener(
        'mousemove',
        this.onDocumentMouseMove
      );

    } else {

      domElement.addEventListener(
        'mousemove', 
        this.onDocumentMouseMove
      );

    }

    domElement.addEventListener('mousedown', this.onMouseDown);
    domElement.addEventListener('mouseup', this.onMouseUp);

    domElement.addEventListener(
      'touchstart', 
      this.onTouchStart, 
      {
        passive: true,
      });

    domElement.addEventListener(
      'touchmove', 
      this.onTouchMove, 
      {
        passive: true,
      });

    domElement.addEventListener(
      'touchend', 
      this.onTouchEnd, 
      {
        passive: true,
      });

    this.treatTouchEventsAsMouseEvents = true;

  }

// =============================================================== //
/** 
 * dispose :: function 
 * */
// =============================================================== //

  dispose 
  = 
  () => {

    this.domElement.removeEventListener('click', this.onMouseClick);

    // supportsPointerEvents
    if (this.supportsPointerEvents) {

      // is bindEventsOnBodyElement
      if (this.bindEventsOnBodyElement) {

        this.domElement.ownerDocument.removeEventListener(
          'pointermove',
          this.onDocumentPointerMove
        );

      } else {

        this.domElement.removeEventListener(
          'pointermove',
          this.onDocumentPointerMove
        );

      };

      this.domElement.removeEventListener(
        'pointerdown', 
        this.onPointerDown
      );

      this.domElement.removeEventListener(
        'pointerup', 
        this.onPointerUp
      );

    };

    if (this.bindEventsOnBodyElement) {

      this.domElement.ownerDocument.removeEventListener(
        'mousemove',
        this.onDocumentMouseMove
      );

    } else {

      this.domElement.removeEventListener(
        'mousemove',
        this.onDocumentMouseMove
      );

    };

    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);

  };

// =============================================================== //
/** 
 * add :: function 
 * */
// =============================================================== //

  add 
  = 
  (object: Object3D, childNames: string[] = []) => {

    if (
      object && !this.interactiveObjects[0].find((i) => i.target === object)
    ) {
      
      if (childNames.length > 0) {

        childNames.forEach(
            
            (name) => {

            const o = object.getObjectByName(name);
            
            if (o) {

              const interactiveObject 
              = new InteractiveObject(o, name);

              this.interactiveObjects[0].push(interactiveObject);

            }

          }

        );

      } else {

        const interactiveObject 
        = 
        new InteractiveObject(object, object.name);

        this.interactiveObjects[0].push(interactiveObject);

      }
    }
  };

// =============================================================== //
/** 
 * remove :: function 
 * */
// =============================================================== //

  remove 
  = 
  (
    object: Object3D, 
    childNames: string[] = []
  ) => {

    if (!object) return;

    if (childNames.length > 0) {

      childNames.forEach((name) => {

        const child = object.getObjectByName(name);

        if (child) {

          this.interactiveObjects[0] 
          = 
          this.interactiveObjects[0].filter(

            (o) => o.target !== child

          );

        }

      });

    } else {

      this.interactiveObjects[0] 
      = 
      this.interactiveObjects[0].filter(

        (o) => o.target !== object

      );

    }

  };

// =============================================================== //
/** 
 * update :: function 
 * */
// =============================================================== //

  update 
  = 
  () => {

    for (let index = 0; index < this.raycasterInstances.length; index++) {

      //const element = array[index];
      this.raycasterInstances[index]
      .setFromCamera(

        this.mouseInstances[index], 
        this.camera

      );

    }
    

    this.interactiveObjects[0].forEach((object) => {

      if (object.target) this.checkIntersection(object,0);

    });

    this.interactiveObjects[0].sort(function (a, b) {

      return a.distance - b.distance;

    });

    const newClosestObject =
      this.interactiveObjects[0].find((object) => object.intersected) ?? null;

    if (newClosestObject != this.closestObjects[0]) {

      if (this.closestObjects[0]) {

        const eventOutClosest = new InteractiveEvent('mouseout');
        this.dispatch(this.closestObjects[0], eventOutClosest);

      }

      if (newClosestObject) {

        const eventOverClosest = new InteractiveEvent('mouseover');
        this.dispatch(newClosestObject, eventOverClosest);

      }

      this.closestObjects[0] = newClosestObject;

    }

    let eventLeave: InteractiveEvent;

    this.interactiveObjects[0].forEach(
      (object) => {

        if (!object.intersected && object.wasIntersected) {

          if (!eventLeave) {

            eventLeave = new InteractiveEvent('mouseleave');

          }

          this.dispatch(object, eventLeave);

        }

      }

    );

    let eventEnter: InteractiveEvent;

    this.interactiveObjects[0].forEach(

      (object) => {

        if (object.intersected && !object.wasIntersected) {

          if (!eventEnter) {

            eventEnter = new InteractiveEvent('mouseenter');

          }

          this.dispatch(object, eventEnter);

        }

      }

    );
    
  };

// =============================================================== //
/** 
 * checkIntersection :: function 
 * */
// =============================================================== //

  /**TODO */
  checkIntersection 
  = 
  (
    object: InteractiveObject, 
    id:number
  ) => {

    const intersects 
    = this.raycasterInstances[id].intersectObjects([object.target], true);

    object.wasIntersected = object.intersected;

    if (intersects.length > 0) {

      let distance = intersects[0].distance;

      intersects.forEach(
          (i) => {
          if (i.distance < distance) {
            distance = i.distance;
          }
        }
      );

      object.intersected = true;
      object.distance = distance;

    } else {

      object.intersected = false;

    }

  };

// =============================================================== //
/** 
 * onDocumentMouseMove :: function 
 * */
// =============================================================== //

  onDocumentMouseMove 
  = 
  (mouseEvent: MouseEvent) => {
    // event.preventDefault();

    this.mapPositionToPoint(

      this.mouseInstances[0], 
      mouseEvent.clientX, 
      mouseEvent.clientY

    );

    const event = new InteractiveEvent('mousemove', mouseEvent);

    this.interactiveObjects[0].forEach(

      (object) => {

        this.dispatch(object, event);

      }

    );

  };

// =============================================================== //
/** 
 * onDocumentPointerMove :: function 
 * */
// =============================================================== //

  onDocumentPointerMove 
  = 
  (pointerEvent: PointerEvent) => {
    // event.preventDefault();
   
    this.mapPositionToPoint(

      this.mouseInstances[pointerEvent.pointerId],
      pointerEvent.clientX,
      pointerEvent.clientY

    );

    const event = new InteractiveEvent('pointermove', pointerEvent);

    this.interactiveObjects[0].forEach(
      (object) => {

        this.dispatch(object, event);

      }

    );

  };

// =============================================================== //
/** 
 * onTouchMove :: function 
 * */
// =============================================================== //

  onTouchMove 
  = 
  (touchEvent: TouchEvent) => {
    // event.preventDefault();

    if (touchEvent.touches.length > 0) {

      for (
        let index = 0; 
        index < touchEvent.touches.length; 
        index++
      ) {

        this.mapPositionToPoint(

          this.mouseInstances[index],
          touchEvent.touches[index].clientX,
          touchEvent.touches[index].clientY

        );
    

        const event 
        = 
        new InteractiveEvent(

          this.treatTouchEventsAsMouseEvents ? 'mousemove' : 'touchmove',
          touchEvent

        );

        this.interactiveObjects[0].forEach(
          (object) => {

            this.dispatch(object, event);

          }

        );
      }
    }
  };

// =============================================================== //
/** 
 * onMouseClick :: function 
 * */
// =============================================================== //

  onMouseClick 
  = 
  (mouseEvent: MouseEvent) => {

    this.update();

    const event = new InteractiveEvent('click', mouseEvent);

    this.interactiveObjects[0].forEach(

      (object) => {

        if (object.intersected) {

          this.dispatch(object, event);

        }

      }

    );

  };

// =============================================================== //
/** 
 * onMouseDown :: function 
 * */
// =============================================================== //

  onMouseDown 
  = 
  (mouseEvent: MouseEvent) => {

    this.mapPositionToPoint(
      this.mouseInstances[0], 
      mouseEvent.clientX, 
      mouseEvent.clientY
    );

    this.update();

    const event = new InteractiveEvent('mousedown', mouseEvent);

    this.interactiveObjects[0].forEach(

      (object) => {

        if (object.intersected) {

          this.dispatch(object, event);

        }

      }

    );

  };

// =============================================================== //
/** 
 * onPointerDown :: function 
 * */
// =============================================================== //

  onPointerDown 
  = 
  (pointerEvent: PointerEvent) => {

    this.mapPositionToPoint(

      this.mouseInstances[pointerEvent.pointerId],
      pointerEvent.clientX,
      pointerEvent.clientY

    );

    this.update();

    const event = new InteractiveEvent('pointerdown', pointerEvent);

    this.interactiveObjects[0].forEach(

      (object) => {

        if (object.intersected) {

          this.dispatch(object, event);

        }

      }

    );

  };

// =============================================================== //
/** 
 * onTouchStart :: function 
 * */
// =============================================================== //

  onTouchStart 
  = 
  (touchEvent: TouchEvent) => {

      if (touchEvent.touches.length > 0) {

        for (
          let index = 0; 
          index < touchEvent.touches.length; 
          index++
        ){ 
            
          this.mapPositionToPoint(

            this.mouseInstances[index],
            touchEvent.touches[index].clientX,
            touchEvent.touches[index].clientY

          );
          
          this.update();
          
          const event 
          = 
          new InteractiveEvent(

            this.treatTouchEventsAsMouseEvents ? 'mousedown' : 'touchstart',
            touchEvent

          );

          this.interactiveObjects[0].forEach(

            (object) => {

              if (object.intersected) {

                this.dispatch(object, event);

              }

            }

          );

      }
      
    }

  };

// =============================================================== //
/** 
 * onMouseUp :: function 
 * */
// =============================================================== //

  onMouseUp 
  = 
  (mouseEvent: MouseEvent) => {

    const event = new InteractiveEvent('mouseup', mouseEvent);

    this.interactiveObjects[0].forEach(

      (object) => {

        this.dispatch(object, event);

      }

    );

  };

// =============================================================== //
/** 
 * onPointerUp :: function 
 * */
// =============================================================== //

  onPointerUp 
  = 
  (pointerEvent: PointerEvent) => {

    const event = new InteractiveEvent('pointerup', pointerEvent);

    this.interactiveObjects[0].forEach(

      (object) => {

        this.dispatch(object, event);

      }

    );

  };

// =============================================================== //
/** 
 * onTouchEnd :: function 
 * */
// =============================================================== //

  onTouchEnd 
  = 
  (touchEvent: TouchEvent) => {

    if (touchEvent.touches.length > 0) {

      
      for (
        let index = 0; 
        index < touchEvent.touches.length; 
        index++
      ){ 

        this.mapPositionToPoint(

          this.mouseInstances[index],
          touchEvent.touches[index].clientX,
          touchEvent.touches[index].clientY

        );

        this.update();

        const event 
        = 
        new InteractiveEvent(

          this.treatTouchEventsAsMouseEvents ? 'mouseup' : 'touchend',
          touchEvent

        );
    
        this.interactiveObjects[0].forEach(

          (object) => {

            this.dispatch(object, event);

          }

        );

      }

    }

  };

// =============================================================== //
/** 
 * dispatch :: function 
 * */
// =============================================================== //

  dispatch 
  =
  (object: InteractiveObject, event: any) => {

    // : InteractiveEvent) => {
    if (object.target && !event.cancelBubble) {

        event.coords = this.mouseInstances[0];

      if(event.originalEvent instanceof PointerEvent == true){

        event.coords 
        = 
        this.mouseInstances[(event.originalEvent as PointerEvent).pointerId];

      }
      try {

          if( event.originalEvent instanceof TouchEvent == true){

             event.coords 
             = 
             this.mouseInstances[(event.originalEvent as TouchEvent).touches.length];

        }

      } catch (error) {
        
      }
      
      event.distance = object.distance;
      event.intersected = object.intersected;

      object.target.dispatchEvent(event);

    }

  };

// =============================================================== //
/** 
 * mapPositionToPoint :: function 
 * */
// =============================================================== //

  mapPositionToPoint 
  = 
  (
    point: Vector2, 
    x: number, 
    y: number
  ) => {

    const rect = this.renderer.domElement.getBoundingClientRect();

    point.x = ((x - rect.left) / rect.width) * 2 - 1;
    point.y = -((y - rect.top) / rect.height) * 2 + 1;

  };

}
