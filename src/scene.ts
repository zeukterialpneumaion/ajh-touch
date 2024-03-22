import GUI from "lil-gui";
import {
  AmbientLight,
  AxesHelper,
  Clock,
  Color,
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
  Vector3,
  WebGLRenderer
} from "three";

import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import AjhDisplayItem from "./AjhDisplay/AjhDisplayItem";
import AjhInformationWindow from "./AjhInformationWindow";
import { InteractionManager } from "./AjhInteractionManager";
import { toggleFullScreen } from "./helpers/fullscreen";
import { resizeRendererToDisplaySize } from "./helpers/responsiveness";

import { bounce, rotate } from "./helpers/animations";
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

let interactionManager : InteractionManager;
let rows : number = 5;
let cols : number = 5;

let groupOfMeshes : Group = new Group();

init();
animate();

function init() {
  // ===== 🖼️ CANVAS, RENDERER, & SCENE =====
  {
    canvas = document.querySelector(`canvas#${CANVAS_ID}`)!;
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //renderer.shadowMap.enabled = true;
   // renderer.shadowMap.type = PCFSoftShadowMap;
    scene = new Scene();

    camera = new PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 13, 0);

    interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );


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

  // ===== 💡 LIGHTS =====
  {

    // ambientLight = new AmbientLight("white", 0.4);
    // pointLight = new PointLight("white", 20, 100);

    // pointLight.position.set(-2, 2, 2);

    // pointLight.castShadow = true;
    // pointLight.shadow.radius = 4;

    // pointLight.shadow.camera.near = 0.5;
    // pointLight.shadow.camera.far = 4000;

    // pointLight.shadow.mapSize.width = 2048;
    // pointLight.shadow.mapSize.height = 2048;

    // scene.add(ambientLight);
    // scene.add(pointLight);

  }

   // ===== 🎥 CAMERA =====
   {
   
  }

 

  // ===== 🕹️ CONTROLS =====
  {

    cameraControls = new OrbitControls(camera, canvas);
    cameraControls.target =new Vector3(0,0,0);// cube.position.clone();
    cameraControls.enableDamping = true;
    cameraControls.autoRotate = false; 
    cameraControls.enabled = false;
    cameraControls.update();

  
    

    // dragControls = new DragControls([arrayOfItems[0]], camera, renderer.domElement);
    // dragControls.addEventListener("hoveron", (event) => {
    //   const mesh = event.object as Mesh;
    //   const material = mesh.material as MeshStandardMaterial;
    //   material.emissive.set("orange");
    // });
    // dragControls.addEventListener("hoveroff", (event) => {
    //   const mesh = event.object as Mesh;
    //   const material = mesh.material as MeshStandardMaterial;
    //   material.emissive.set("black");
    // });
    // dragControls.addEventListener("dragstart", (event) => {
    //   const mesh = event.object as Mesh;
    //   const material = mesh.material as MeshStandardMaterial;
    //   cameraControls.enabled = false;
    //   animation.play = false;
    //   material.emissive.set("black");
    //   material.opacity = 0.7;
    //   material.needsUpdate = true;
    // });
    // dragControls.addEventListener("dragend", (event) => {
    //   cameraControls.enabled = true;
    //   animation.play = true;
    //   const mesh = event.object as Mesh;
    //   const material = mesh.material as MeshStandardMaterial;
    //   material.emissive.set("black");
    //   material.opacity = 1;
    //   material.needsUpdate = true;
    // });
    // dragControls.enabled = false;

    // Full screen
    window.addEventListener("dblclick", (event) => {
      if (event.target === canvas) {
        toggleFullScreen(canvas);
      }
    });
  }

 

  
  // ===== 📦 OBJECTS =====
  {
    
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {

      for (let colIndex = 0; colIndex < cols; colIndex++) {

        const element 
        = new AjhDisplayItem();

        element.body.position.z = 0.75 + ((rowIndex - ( rows / 2 ) )*1.5);
        element.body.position.x = 1 + ((colIndex - ( cols / 2 ) )*2);
        

        arrayOfItems.push( element.body );
        groupOfMeshes.add( element.body );
      
      }
      
    }

    scene.add(groupOfMeshes);

    ////NICE COLOUR::: hex :: "329758" ajh.

    // arrayOfItems.forEach(element => {
    //    scene.add(element as Mesh);
    // });

    groupOfMeshes.children.forEach((child) => {

      // mouseenter
      child.addEventListener('mouseenter', (event : any ) => {
        console.log(event);
        event.stopPropagation();

        InformationWindow.updateAllFields(

          event.target.name
          + 
          " :: "
          +
          event.target.id
          + 
          " :: "
          +
          selectedMeshes.length, // title
          " mouseenter, distance: " +  event.distance, // data
          event.target.uuid + " ajh." // message
  
         );

        // document.querySelector('#title .log')!.innerHTML =
        //   '<span style="color: #ff8800">' +
        //   event.target.name +
        //   ' – mouseenter, distance: ' +
        //   event.distance +
        //   '</span><br/>';

        ((event.target as Mesh).material as MeshMatcapMaterial).color.set(0xff8800);

        document.body.style.cursor = 'pointer';
      });

      // mouseleave
      child.addEventListener('mouseleave', (event : any) => {
        console.log(event);

        InformationWindow.updateAllFields(

          event.target.name
          + 
          " :: "
          +
          event.target.id
          + 
          " :: "
          +
          selectedMeshes.length, // title
          " mouseleave, distance: " +  event.distance, // data
          event.target.uuid + " ajh." // message
  
         );
        

        ((event.target as Mesh).material as MeshMatcapMaterial)
        .color.set(+(event.target as Mesh).name );

        document.body.style.cursor = 'default';

      });

      // mouseover
      child.addEventListener('mouseover', (event : any) => {
        console.log(event);
        event.stopPropagation();
        //event.preventDefault();

        
       InformationWindow.updateAllFields(

        event.target.name
        + 
        " :: "
        +
        event.target.id
        + 
        " :: "
        +
        selectedMeshes.length, // title
        " mouseover, distance: " +  event.distance, // data
        event.target.uuid + " ajh." // message

       );

        // document.querySelector('#title .log')!.innerHTML =
        //   '<span style="color: #ff0000">' +
        //   event.target.name +
        //   ' – mouseover, distance: ' +
        //   event.distance +
        //   '</span><br/>';

        ((event.target as Mesh).material as MeshMatcapMaterial)
        .color.set(0xff0000);

        document.body.style.cursor = 'pointer';

      });

      // mouseout
      child.addEventListener('mouseout', (event : any) => {
        console.log(event);

        InformationWindow.updateAllFields(

          event.target.name
          + 
          " :: "
          +
          event.target.id
          + 
          " :: "
          +
          selectedMeshes.length, // title
          " mouseout, distance: " +  event.distance, // data
          event.target.uuid + " ajh." // message
  
         );

        ((event.target as Mesh).material as MeshMatcapMaterial)
        .color.set( (event.target as any).defaultColor);

        document.body.style.cursor = 'default';
      });

      // mousedown
      child.addEventListener('mousedown', (event : any) => {
        console.log(event);
        event.stopPropagation();
       //  event.preventDefault();
       
       selectedMeshes.push((event.target as Mesh)); 

       InformationWindow.updateAllFields(

        event.target.name
          + 
          " :: "
          +
          event.target.id
          + 
          " :: "
          +
          selectedMeshes.length, // title

        " mousedown, distance: " 
        +
        event.distance, // data

        event.target.uuid + " ajh." // message

       );

        // document.querySelector('#title .log')!.innerHTML =
        //   '<span style="color: #0000ff">' +
        //   event.target.name +
        //   ' – mousedown, distance: ' +
        //   event.distance +
        //   '</span><br/>';

        ((event.target as Mesh).material as MeshMatcapMaterial).color.set(0x0000ff);

      });
      
      // mouseup
      child.addEventListener('mouseup', (event : any) => {

        console.log(event);

        InformationWindow.updateAllFields(

          event.target.name
          + 
          " :: "
          +
          event.target.id
          + 
          " :: "
          +
          selectedMeshes.length, // title
          " mouseup, distance: " +  event.distance, // data
          event.target.uuid + " ajh." // message
  
         );


        let foundIndex = selectedMeshes.findIndex(
          item => item == (event.target as Mesh)
        );
        selectedMeshes.splice(foundIndex,1);

        if (event.intersected) {
          ((event.target as Mesh).material as MeshMatcapMaterial).color.set(0xff0000);
        } else {
          ((event.target as Mesh).material as MeshMatcapMaterial).color.set(new Color( +(event.target as Mesh).name ));
        }
      });
      
      // click
      child.addEventListener('click', (event : any) => {
        console.log(event);
        event.stopPropagation();

        InformationWindow.updateAllFields(

          event.target.name
          + 
          " :: "
          +
          event.target.id
          + 
          " :: "
          +
          selectedMeshes.length, // title

          " click/mouse up, distance: " +  event.distance, // data

          event.target.uuid + " ajh." // message
  
         );

        // document.querySelector('#title .log')!.innerHTML =
        //   event.target.name +
        //   ' – click, distance: ' +
        //   event.distance +
        //   '<br/>';
      });

      interactionManager.add(child);
    });


    // cube = new Mesh(cubeGeometry, cubeMaterial);
    // cube.castShadow = true;
    // cube.position.y = 0.5;

    const planeGeometry = new PlaneGeometry(3, 3);
    const planeMaterial = new MeshLambertMaterial({
      color: "gray",
      emissive: "teal",
      emissiveIntensity: 0.2,
      side: 2,
      transparent: true,
      opacity: 0.4,
    });

    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotateX(Math.PI / 2);
    plane.receiveShadow = true;

    
   
    scene.add(plane);

  }

  //scene.add(InformationWindow.);


  // ===== 🪄 HELPERS =====
  {
    // axesHelper = new AxesHelper(4);
    // axesHelper.visible = false;
    // scene.add(axesHelper);

    // pointLightHelper = new PointLightHelper(pointLight, undefined, "orange");
    // pointLightHelper.visible = false;
    // scene.add(pointLightHelper);

    const gridHelper = new GridHelper(20, 20, "teal", "darkgray");
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);
  }

  // ===== 📈 STATS & CLOCK =====
  {
    clock = new Clock();
    stats = new Stats();
    stats.dom.style.left = 'auto';
    stats.dom.style.right = '0';
    stats.dom.style.top = 'auto';
    stats.dom.style.bottom = '0';
    document.body.appendChild(stats.dom);
  }

  // ==== 🐞 DEBUG GUI ====
  // {
  //   gui = new GUI({ title: "🐞 Debug GUI", width: 300 });

  //   const cubeOneFolder = gui.addFolder("Cube one");

  //   cubeOneFolder
  //     .add(arrayOfItems[0].position, "x")
  //     .min(-5)
  //     .max(5)
  //     .step(0.5)
  //     .name("pos x");
  //   cubeOneFolder
  //     .add(arrayOfItems[0].position, "y")
  //     .min(-5)
  //     .max(5)
  //     .step(0.5)
  //     .name("pos y");
  //   cubeOneFolder
  //     .add(arrayOfItems[0].position, "z")
  //     .min(-5)
  //     .max(5)
  //     .step(0.5)
  //     .name("pos z");

  //   cubeOneFolder.add(arrayOfItems[0].material, "wireframe");
  //   cubeOneFolder.addColor(arrayOfItems[0].material, "color");
  //   cubeOneFolder.add(arrayOfItems[0].material, "metalness", 0, 1, 0.1);
  //   cubeOneFolder.add(arrayOfItems[0].material, "roughness", 0, 1, 0.1);

  //   cubeOneFolder
  //     .add(arrayOfItems[0].rotation, "x", -Math.PI * 2, Math.PI * 2, Math.PI / 4)
  //     .name("rotate x");
  //   cubeOneFolder
  //     .add(arrayOfItems[0].rotation, "y", -Math.PI * 2, Math.PI * 2, Math.PI / 4)
  //     .name("rotate y");
  //   cubeOneFolder
  //     .add(arrayOfItems[0].rotation, "z", -Math.PI * 2, Math.PI * 2, Math.PI / 4)
  //     .name("rotate z");

  //   cubeOneFolder.add(animation, "enabled").name("animated");

  //   const controlsFolder = gui.addFolder("Controls");
  //   controlsFolder.add(dragControls, "enabled").name("drag controls");

  //   const lightsFolder = gui.addFolder("Lights");
  //   lightsFolder.add(pointLight, "visible").name("point light");
  //   lightsFolder.add(ambientLight, "visible").name("ambient light");

  //   const helpersFolder = gui.addFolder("Helpers");
  //   helpersFolder.add(axesHelper, "visible").name("axes");
  //   helpersFolder.add(pointLightHelper, "visible").name("pointLight");

  //   const cameraFolder = gui.addFolder("Camera");
  //   cameraFolder.add(cameraControls, "autoRotate");

  //   // persist GUI state in local storage on changes
  //   gui.onFinishChange(() => {
  //     const guiState = gui.save();
  //     localStorage.setItem("guiState", JSON.stringify(guiState));
  //   });

  //   // load GUI state if available in local storage
  //   const guiState = localStorage.getItem("guiState");
  //   if (guiState) gui.load(JSON.parse(guiState));

  //   // reset GUI state button
  //   const resetGui = () => {
  //     localStorage.removeItem("guiState");
  //     gui.reset();
  //   };
  //   gui.add({ resetGui }, "resetGui").name("RESET");

  //   gui.close();
  // }
}

function animate() {

  

  stats.update();
  
  selectedMeshes.forEach(

    function (item) {

      if (animation.enabled && animation.play) {

        rotate(item, clock, Math.PI / 3);
        bounce(item, clock, 1, 0.5, 0.5);

      }

     

    }

  );

  

   if (resizeRendererToDisplaySize(renderer)) {

     const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

   }

      cameraControls.update();

     interactionManager.update();

      renderer.render(scene, camera);

      requestAnimationFrame(animate);

}
