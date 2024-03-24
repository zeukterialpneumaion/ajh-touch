import GUI from "lil-gui";
import {
    AmbientLight,
    AxesHelper,
    Clock,
    GridHelper,
    Group,
    Mesh,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    PointLightHelper,
    Scene,
    TorusGeometry,
    Vector2,
    Vector3,
    WebGLRenderer
} from "three";

import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import AjhDisplayItem from "./AjhDisplay/AjhDisplayItem";
import AjhInformationWindow from "./AjhInformationWindow";
import { toggleFullScreen } from "./helpers/fullscreen";
import { resizeRendererToDisplaySize } from "./helpers/responsiveness";

import AjhMultiTouchManager from "./AJHMultiTouch/AjhMultiTouchManager";
import "./style.css";

const CANVAS_ID = "scene";

let canvas: HTMLElement;
let renderer: WebGLRenderer;
let scene: Scene;
// let loadingManager: LoadingManager;
let ambientLight: AmbientLight;
let pointLight: PointLight;
let camera: PerspectiveCamera;
let cameraControls: OrbitControls;
let dragControls: DragControls;
let axesHelper: AxesHelper;
let pointLightHelper: PointLightHelper;
let clock: Clock;
let stats: Stats;
let gui: GUI;
let arrayOfItems : Array<Mesh> = new Array<Mesh>();
let amountToAdd = 20;
let selectedMeshes : Array<Mesh> = new Array<Mesh>();

let InformationWindow:AjhInformationWindow = new AjhInformationWindow();

//let AjhTouchEvents : AjhMultiTouch = new AjhMultiTouch();

const animation = { enabled: true, play: true };


let circle : Mesh;

let multitouchManager : AjhMultiTouchManager 
= 
new AjhMultiTouchManager();


let rows : number = 5;
let cols : number = 5;

let groupOfMeshes : Group = new Group();

init();
animate();

function init() {

  // ===== 🖼️ CANVAS, RENDERER, & SCENE ===== //

  {
    canvas 
    = 
    document.querySelector(`canvas#${CANVAS_ID}`)!;

    renderer 
    = 
    new WebGLRenderer(
        { 
            canvas, 
            antialias: true, 
            alpha: true 
        }
    );

    renderer
    .setPixelRatio(
        Math.min(
            window.devicePixelRatio, 
            2
        )
    );

    //renderer.shadowMap.enabled = true;
   // renderer.shadowMap.type = PCFSoftShadowMap;
    scene = new Scene();

    camera 
    = 
    new PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 13, 0);


  }

  // ===== 👨🏻‍💼 LOADING MANAGER =====
  // {

  //   loadingManager = new LoadingManager();

  //   loadingManager.onStart = () => {
  //     console.log("loading started");
  //   };
  //   loadingManager.onProgress = (url, loaded, total) => {
  //     console.log("loading in progress:");
  //     console.log(`${url} -> ${loaded} / ${total}`);
  //   };
  //   loadingManager.onLoad = () => {
  //     console.log("loaded!");
  //   };
  //   loadingManager.onError = () => {
  //     console.log("❌ error while loading");
  //   };
  // }

    // ===== 💡 LIGHTS ===== //

    // ===== 🎥 CAMERA ===== //

    // ===== 🕹️ CONTROLS ===== //

    cameraControls 
    = 
    new OrbitControls(camera, canvas);

    cameraControls.target 
    =
    new Vector3(0,0,0);// cube.position.clone();

    cameraControls.enableDamping = true;

    cameraControls.autoRotate = false; 

    cameraControls.enabled = false;

    cameraControls.update();

    // Full screen
    window.addEventListener(
        "dblclick", 
        (event) => {
            if (event.target === canvas) {
                toggleFullScreen(canvas);
            }
        }
    );
  
  // ===== 📦 OBJECTS =====
    
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {

        for (let colIndex = 0; colIndex < cols; colIndex++) {

                const element 
                = new AjhDisplayItem(rowIndex+"_"+colIndex);

                let  horizontalvertical : boolean = false;
                if(horizontalvertical){

                    element.body.position.z = 0.75 + ((rowIndex - ( rows / 2 ) )*1.5);
                    element.body.position.x = 1 + ((colIndex - ( cols / 2 ) )*2);
                
                } else {

                    element.body.position.z = 1 + ((rowIndex - ( rows / 2 ) )*2);
                    element.body.position.x = 0.75 + ((colIndex - ( cols / 2 ) )*1.5);

                }

                multitouchManager.interactiveItems.push( element );
                groupOfMeshes.add( element.body );
                   
        }
      
    }

    scene.add(groupOfMeshes);

    canvas.addEventListener
    (
        "pointermove", 
       onPointerMoveListener  
    ) 

    canvas.addEventListener
    (
        "pointerdown", 
        onPointerDownListener  
    ) 

    canvas.addEventListener
    (
        "pointerup", 
        onPointerUpListener  
    ) 

    ////NICE COLOUR::: hex :: "329758" ajh.


    const circleGeometry = new TorusGeometry(0.75,0.05);

    const circleMaterial  
    = 
    new MeshMatcapMaterial({
        color: "#329758",
    });


    circle 
    = 
    new Mesh(circleGeometry, circleMaterial);

    circle.rotateX(Math.PI / 2);

    //circle.receiveShadow = true;

    circle.position.y = 1;
   // scene.add(circle);




    const planeGeometry = new PlaneGeometry(3, 3);
    const planeMaterial 
    = 
    new MeshLambertMaterial({
      color: "gray",
      emissive: "teal",
      emissiveIntensity: 0.2,
      side: 2,
      transparent: true,
      opacity: 0.4,
    });

    const plane 
    = 
    new Mesh(planeGeometry, planeMaterial);

    plane.rotateX(Math.PI / 2);

    plane.receiveShadow = true;

    scene.add(plane);

  //scene.add(InformationWindow.);

  // ===== 🪄 HELPERS ===== //

    const gridHelper 
    = 
    new GridHelper(20, 20, "teal", "darkgray");

    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

  // ===== 📈 STATS & CLOCK ===== //
  {
    clock = new Clock();
    stats = new Stats();
    stats.dom.style.left = 'auto';
    stats.dom.style.right = '0';
    stats.dom.style.top = 'auto';
    stats.dom.style.bottom = '0';
    document.body.appendChild(stats.dom);
  }

  // ==== 🐞 DEBUG GUI ==== //
 
}

    function animate() {

        stats.update();
    

        if (resizeRendererToDisplaySize(renderer)) {

            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

        }

        cameraControls.update();

        if(
            multitouchManager
            .getRaycasterWithPointById(0)
            != 
            undefined
        ){

            if(
                multitouchManager
                .findCurrentlyIntersectedItems().length
                > 0
                
            ){
                let intersectPoint 
                =  
                multitouchManager
                .findCurrentlyIntersectedItems()[0].intersectPoint;

                circle.position.x = intersectPoint.x;
                circle.position.z = intersectPoint.z;

            }

        }
       

        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }

// =================================================== //
/** 
 * onPointerMoveListener :: function 
 * */
// =================================================== //

    function onPointerMoveListener( 
        pointerEvt : PointerEvent 
    ){

        let id =  (pointerEvt as PointerEvent).pointerId;
        
        let pX =  (pointerEvt as PointerEvent).clientX;
        let pY =  (pointerEvt as PointerEvent).clientY;

        let raycaster 
        =  
        multitouchManager
        .getRaycasterWithPointById(id);

        if(raycaster != null || raycaster != undefined ){

            raycaster.updatePointCoords(
                new Vector2(pX,pY)
            );

            raycaster.updateRaycaster(camera);

            multitouchManager.checkAllItemsForIntersection();

        }

        let rX 
        = 
        multitouchManager
        .getRaycasterWithPointById(id)?.screenPoint.x;

        let rY 
        = 
        multitouchManager
        .getRaycasterWithPointById(id)?.screenPoint.y;

       

        let raypoint 
        = 
        multitouchManager
        .getRaycasterWithPointById( id )?.screenPoint;
        
        let numberOfCachedEvents 
        =  
        multitouchManager.EventMemoryCacheManager
        .EventMemoryCache.length;
        
        addLogging(
            "pointer move",
            id, // : number,
            pX, // : number,
            pY, // : number,
            rX, // : number,
            rY, // : number,
            numberOfCachedEvents,// : number
        )

    }

// =================================================== //
/** 
 * onPointerDownListener :: function 
 * */
// =================================================== // 

    function onPointerDownListener( 
        pointerEvt : PointerEvent 
    ){

        //touch events to behave like mouse,  
        // works for div but meshes are different... ::
        // if ( 
        //     pointerEvt
        //     .target?.hasPointerCapture(pointerEvt.pointerId)
        // ) {
        //     pointerEvt
        //     .target?.releasePointerCapture(pointerEvt.pointerId);
        // }

        let pointerid 
        = 
        (pointerEvt as PointerEvent).pointerId;

        console.log( 
            "PointerDown:: event id ::" 
            +
            pointerid 
        );

        multitouchManager.addRaycasterWithPoint(pointerid);
        
        multitouchManager.EventMemoryCacheManager
        .pushEventIntoCache(pointerEvt);

        let id =  (pointerEvt as PointerEvent).pointerId;
        let pX =  (pointerEvt as PointerEvent).clientX;
        let pY =  (pointerEvt as PointerEvent).clientY;

        let raycaster 
        =  
        multitouchManager
        .getRaycasterWithPointById(id);

        raycaster?.updatePointCoords(
            new Vector2(pX,pY)
        );

        raycaster?.updateRaycaster(camera);

        let rX 
        = 
        multitouchManager
        .getRaycasterWithPointById(id)?.screenPoint.x;

        let rY 
        = 
        multitouchManager
        .getRaycasterWithPointById(id)?.screenPoint.y;

        multitouchManager.checkAllItemsForIntersection();

        let raypoint 
        = 
        multitouchManager
        .getRaycasterWithPointById( id )?.screenPoint;
        
        let numberOfCachedEvents 
        =  
        multitouchManager.EventMemoryCacheManager
        .EventMemoryCache.length;

        addLogging(
            "pointer down",
            id, // : number,
            pX, // : number,
            pY, // : number,
            rX, // : number,
            rY, // : number,
            numberOfCachedEvents,// : number
        )

        circle.visible = true;

    }

// =================================================== //
/** 
 * onPointerUpListener :: function 
 * */
// =================================================== // 

    function onPointerUpListener( 
        pointerEvt : PointerEvent 
    ){

        let id =  (pointerEvt as PointerEvent).pointerId;
        let pX =  (pointerEvt as PointerEvent).clientX;
        let pY =  (pointerEvt as PointerEvent).clientY;

        multitouchManager.removeRaycasterWithPointById(id);
       // multitouchManager.re
        multitouchManager.EventMemoryCacheManager
        .removeEventFromCache(pointerEvt);

        let rX 
        = 
        multitouchManager
        .getRaycasterWithPointById(id)?.screenPoint.x;

        let rY 
        = 
        multitouchManager
        .getRaycasterWithPointById(id)?.screenPoint.y;

        multitouchManager.checkAllItemsForIntersection();

        let raypoint 
        = 
        multitouchManager
        .getRaycasterWithPointById( id )?.screenPoint;
        
        let numberOfCachedEvents 
        =  
        multitouchManager.EventMemoryCacheManager
        .EventMemoryCache.length;

        addLogging(
            "pointer up",
            id, // : number,
            pX, // : number,
            pY, // : number,
            rX, // : number,
            rY, // : number,
            numberOfCachedEvents,// : number
        )

        circle.visible = false;

    }

// =================================================== //


function addLogging(
    eventType : string,
    id : number,
    pX : number,
    pY : number,
    rX : number | undefined,
    rY : number | undefined,
    numberOfCachedEvents : number
){



    console.log(

        eventType
        +
        " id: " 
        +
        id 
        +
        " CurrentlyIntersectedItems: "
        +
        multitouchManager.findCurrentlyIntersectedItems()

    );
    
    InformationWindow.updateAllFields(

        // title
        eventType
        +
        " id:" 
        +
        id 
        + 
        " number of raycasters: "
        +
        multitouchManager.raycastersWithPoints.length,

        // data
        " P x: " 
        +  
        pX // raypoint?.x
        +
        ", y: " 
        +  
        pY //raypoint?.y
        +
        " R x: " 
        +  
        rX?.toFixed(4) // raypoint?.x
        +
        ", y: " 
        +  
        rY?.toFixed(4) //raypoint?.y
        +
        " ajh.",

        // message
        "numberOfCachedEvents : "
        + 
        numberOfCachedEvents
        + 
        " CurrentlySelectedItems: "
        +
        multitouchManager
        .findCurrentlyIntersectedItems().length
        
    );


}