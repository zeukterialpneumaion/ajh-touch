import { Camera, Object3D, Raycaster, Renderer, Scene, Vector2 } from 'three';

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

export class InteractionManagerOptions {
  bindEventsOnBodyElement: boolean = true;
  autoAdd: boolean = false;
  scene: Scene | null = null;

  constructor(options: {
    bindEventsOnBodyElement?: boolean | undefined;
    autoAdd?: boolean | undefined;
    scene?: Scene | undefined;
  }) {
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

export class InteractionManager {
  renderer: Renderer;
  camera: Camera;
  domElement: HTMLElement;
  bindEventsOnBodyElement: boolean;
  autoAdd: boolean;
  scene: Scene | null;
  mouses: Array<Vector2>;
  supportsPointerEvents: boolean;
  interactiveObjects: InteractiveObject[];
  closestObject: InteractiveObject | null;
  raycasters: Array<Raycaster>;
  treatTouchEventsAsMouseEvents: boolean;

  constructor(
    renderer: Renderer,
    camera: Camera,
    domElement: HTMLElement,
    options?: InteractionManagerOptions
  ) {
    this.renderer = renderer;
    this.camera = camera;
    this.domElement = domElement;
    this.bindEventsOnBodyElement =
      options && typeof options.bindEventsOnBodyElement !== 'undefined'
        ? options.bindEventsOnBodyElement
        : true;

    this.scene =
      options && typeof options.scene !== 'undefined' ? options.scene : null;
    if (this.scene) {
      this.scene.onBeforeRender = () => {
        if (this.autoAdd && this.scene !== null) {
          this.scene.traverse((object) => {
            this.add(object);

            object.addEventListener('removed', (o) => {
              this.remove(o.target);
            });
          });
        }

        this.update();
      };
    }
    this.autoAdd =
      options && typeof options.autoAdd !== 'undefined'
        ? options.autoAdd
        : false;

    if (this.autoAdd && this.scene === null) {
      console.error(
        'Attention: Options.scene needs to be set when using options.autoAdd'
      );
    }

    // array of mouse coordinates
    this.mouses 
    = 
    [
      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1),

      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1),

      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1),

      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1),
      new Vector2(-1, 1)

    ]; // top left default position

    this.supportsPointerEvents = !!window.PointerEvent;

    this.interactiveObjects = [];
    this.closestObject = null;

    //array of raycasters
    this.raycasters 
    = 
    [ 
      new Raycaster(),
      new Raycaster(),
      new Raycaster(),
      new Raycaster(),

      new Raycaster(),
      new Raycaster(),
      new Raycaster(),
      new Raycaster(),

      new Raycaster(),
      new Raycaster(),
      new Raycaster(),
      new Raycaster(),

      new Raycaster(),
      new Raycaster(),
      new Raycaster(),
      new Raycaster()
    ];

    domElement.addEventListener('click', this.onMouseClick);

    if (this.supportsPointerEvents) {
      if (this.bindEventsOnBodyElement) {
        domElement.ownerDocument.addEventListener(
          'pointermove',
          this.onDocumentPointerMove
        );
      } else {
        domElement.addEventListener('pointermove', this.onDocumentPointerMove);
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
      domElement.addEventListener('mousemove', this.onDocumentMouseMove);
    }
    domElement.addEventListener('mousedown', this.onMouseDown);
    domElement.addEventListener('mouseup', this.onMouseUp);
    domElement.addEventListener('touchstart', this.onTouchStart, {
      passive: true,
    });
    domElement.addEventListener('touchmove', this.onTouchMove, {
      passive: true,
    });
    domElement.addEventListener('touchend', this.onTouchEnd, {
      passive: true,
    });

    this.treatTouchEventsAsMouseEvents = true;
  }

  dispose = () => {
    this.domElement.removeEventListener('click', this.onMouseClick);

    if (this.supportsPointerEvents) {
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
      }
      this.domElement.removeEventListener('pointerdown', this.onPointerDown);
      this.domElement.removeEventListener('pointerup', this.onPointerUp);
    }

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
    }
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
  };

  add = (object: Object3D, childNames: string[] = []) => {
    if (object && !this.interactiveObjects.find((i) => i.target === object)) {
      if (childNames.length > 0) {
        childNames.forEach((name) => {
          const o = object.getObjectByName(name);
          if (o) {
            const interactiveObject = new InteractiveObject(o, name);
            this.interactiveObjects.push(interactiveObject);
          }
        });
      } else {
        const interactiveObject = new InteractiveObject(object, object.name);
        this.interactiveObjects.push(interactiveObject);
      }
    }
  };

  remove = (object: Object3D, childNames: string[] = []) => {
    if (!object) return;

    if (childNames.length > 0) {
      childNames.forEach((name) => {
        const child = object.getObjectByName(name);
        if (child) {
          this.interactiveObjects = this.interactiveObjects.filter(
            (o) => o.target !== child
          );
        }
      });
    } else {
      this.interactiveObjects = this.interactiveObjects.filter(
        (o) => o.target !== object
      );
    }
  };

  update = () => {

    for (let index = 0; index < this.raycasters.length; index++) {
      //const element = array[index];
      this.raycasters[index]
      .setFromCamera(
        this.mouses[index], 
        this.camera
      );
    }
    

    this.interactiveObjects.forEach((object) => {
      if (object.target) this.checkIntersection(object,0);
    });

    this.interactiveObjects.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const newClosestObject =
      this.interactiveObjects.find((object) => object.intersected) ?? null;
    if (newClosestObject != this.closestObject) {
      if (this.closestObject) {
        const eventOutClosest = new InteractiveEvent('mouseout');
        this.dispatch(this.closestObject, eventOutClosest);
      }
      if (newClosestObject) {
        const eventOverClosest = new InteractiveEvent('mouseover');
        this.dispatch(newClosestObject, eventOverClosest);
      }
      this.closestObject = newClosestObject;
    }

    let eventLeave: InteractiveEvent;
    this.interactiveObjects.forEach((object) => {
      if (!object.intersected && object.wasIntersected) {
        if (!eventLeave) {
          eventLeave = new InteractiveEvent('mouseleave');
        }
        this.dispatch(object, eventLeave);
      }
    });

    let eventEnter: InteractiveEvent;
    this.interactiveObjects.forEach((object) => {
      if (object.intersected && !object.wasIntersected) {
        if (!eventEnter) {
          eventEnter = new InteractiveEvent('mouseenter');
        }
        this.dispatch(object, eventEnter);
      }
    });

    
  };

  /**TODO */
  checkIntersection = (object: InteractiveObject, id:number) => {
    const intersects 
    = this.raycasters[id].intersectObjects([object.target], true);

    object.wasIntersected = object.intersected;

    if (intersects.length > 0) {
      let distance = intersects[0].distance;
      intersects.forEach((i) => {
        if (i.distance < distance) {
          distance = i.distance;
        }
      });
      object.intersected = true;
      object.distance = distance;
    } else {
      object.intersected = false;
    }
  };

  onDocumentMouseMove = (mouseEvent: MouseEvent) => {
    // event.preventDefault();

    this.mapPositionToPoint(
      this.mouses[0], 
      mouseEvent.clientX, 
      mouseEvent.clientY
    );

    const event = new InteractiveEvent('mousemove', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onDocumentPointerMove = (pointerEvent: PointerEvent) => {
    // event.preventDefault();
   
    this.mapPositionToPoint(
      this.mouses[pointerEvent.pointerId],
      pointerEvent.clientX,
      pointerEvent.clientY
    );

    const event = new InteractiveEvent('pointermove', pointerEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onTouchMove = (touchEvent: TouchEvent) => {
    // event.preventDefault();

    if (touchEvent.touches.length > 0) {

      for (let index = 0; index < touchEvent.touches.length; index++) {
        this.mapPositionToPoint(
          this.mouses[index],
          touchEvent.touches[index].clientX,
          touchEvent.touches[index].clientY
        );
      }
    }

    const event = new InteractiveEvent(
      this.treatTouchEventsAsMouseEvents ? 'mousemove' : 'touchmove',
      touchEvent
    );

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onMouseClick = (mouseEvent: MouseEvent) => {
    this.update();

    const event = new InteractiveEvent('click', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  };

  onMouseDown = (mouseEvent: MouseEvent) => {
    this.mapPositionToPoint(this.mouses[0], mouseEvent.clientX, mouseEvent.clientY);

    this.update();

    const event = new InteractiveEvent('mousedown', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  };

  onPointerDown = (pointerEvent: PointerEvent) => {
    this.mapPositionToPoint(
      this.mouses[pointerEvent.pointerId],
      pointerEvent.clientX,
      pointerEvent.clientY
    );

    this.update();

    const event = new InteractiveEvent('pointerdown', pointerEvent);

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  };

  onTouchStart = (touchEvent: TouchEvent) => {

      if (touchEvent.touches.length > 0) {

        for (let index = 0; index < touchEvent.touches.length; index++){ 
            
          this.mapPositionToPoint(
            this.mouses[index],
            touchEvent.touches[index].clientX,
            touchEvent.touches[index].clientY
          );
          
          this.update();
          
          const event = new InteractiveEvent(
            this.treatTouchEventsAsMouseEvents ? 'mousedown' : 'touchstart',
            touchEvent
          );

          this.interactiveObjects.forEach((object) => {
            if (object.intersected) {
              this.dispatch(object, event);
            }
          });
      }
      
    }


    
  };

  onMouseUp = (mouseEvent: MouseEvent) => {
    const event = new InteractiveEvent('mouseup', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onPointerUp = (pointerEvent: PointerEvent) => {
    const event = new InteractiveEvent('pointerup', pointerEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  };

  onTouchEnd = (touchEvent: TouchEvent) => {
    if (touchEvent.touches.length > 0) {

      
      for (let index = 0; index < touchEvent.touches.length; index++){ 

        this.mapPositionToPoint(
          this.mouses[index],
          touchEvent.touches[index].clientX,
          touchEvent.touches[index].clientY
        );

        this.update();

        const event = new InteractiveEvent(
          this.treatTouchEventsAsMouseEvents ? 'mouseup' : 'touchend',
          touchEvent
        );
    
        this.interactiveObjects.forEach((object) => {
          this.dispatch(object, event);
        });

      }
    }

   
  };

  dispatch = (object: InteractiveObject, event: any) => {
    // : InteractiveEvent) => {
    if (object.target && !event.cancelBubble) {
        event.coords = this.mouses[0];
      if(event.originalEvent instanceof PointerEvent == true){
        event.coords = this.mouses[(event.originalEvent as PointerEvent).pointerId];
      }
      try {
          if( event.originalEvent instanceof TouchEvent == true){
             event.coords = this.mouses[(event.originalEvent as TouchEvent).touches.length];
        }
      } catch (error) {
        
      }
     
      
      event.distance = object.distance;
      event.intersected = object.intersected;
      object.target.dispatchEvent(event);
    }
  };

  mapPositionToPoint = (point: Vector2, x: number, y: number) => {
    const rect = this.renderer.domElement.getBoundingClientRect();

    point.x = ((x - rect.left) / rect.width) * 2 - 1;
    point.y = -((y - rect.top) / rect.height) * 2 + 1;
  };
}
