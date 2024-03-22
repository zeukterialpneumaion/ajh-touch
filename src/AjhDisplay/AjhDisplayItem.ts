import { BoxGeometry, Color, MathUtils, Mesh, MeshBasicMaterial, MeshMatcapMaterial, MeshStandardMaterial } from "three";
import AjhEventMemoryCache from "../AJHMultiTouch/AjhEventMemoryCache";
import AjhLog from "../AjhLogging/AjhLog";

export default class AjhDisplayItem {



    body  : Mesh;

    EventMemeoryCache : AjhEventMemoryCache = new AjhEventMemoryCache();

    log: AjhLog = new AjhLog();


    constructor () {


        this.body = this.createBody()


    }

    createBody(): Mesh {

        let mesh 
        = new Mesh(this.cubeGeometry.clone(), this.matcapMaterial.clone());

        (mesh as Mesh).name 
        = 
        MathUtils.randInt(0, 0xffffff).toString();

        (mesh.material as MeshMatcapMaterial).color 
        = 
        new Color( + mesh.name );

        mesh.castShadow = true;
        
        mesh.position.y = 0.5;

        return mesh

    }

    sideLength = 1;

    cubeGeometry 
    = 
    new BoxGeometry(
        this.sideLength, 
        this.sideLength, 
        this.sideLength
    );

    cubeMaterial 
    = new MeshStandardMaterial({
      color: "#f69f1f",
      metalness: 0.5,
      roughness: 0.7,
    });

    basicMaterial 
    = new MeshBasicMaterial({
      color: "#f69f1f",
      //metalness: 0.5,
     // roughness: 0.7,
    });

    matcapMaterial 
    = new MeshMatcapMaterial({
      color: "#f69f1f",
    });



}