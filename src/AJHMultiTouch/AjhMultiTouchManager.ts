import { Camera, Vector2 } from "three";
import AjhDisplayItem from "../AjhDisplay/AjhDisplayItem";
import AjhEventMemoryCache from "./AjhEventMemoryCache";
import AjhRaycasterWithPoint from "./AjhRaycasterWithPoint";

export default class AjhMultiTouchManager {

  // ======================================================== //
  
    EventMemoryCacheManager : AjhEventMemoryCache
 
    = new AjhEventMemoryCache();

    interactiveItems: Array<AjhDisplayItem> 
    =
    new Array<AjhDisplayItem>();

    raycastersWithPoints : Array<AjhRaycasterWithPoint>
    =
    new Array<AjhRaycasterWithPoint>();

  // ======================================================== //
  
    constructor(){
        
    }

  // ======================================================== //
  

  // ======================================================== //
  
    addRaycasterWithPoint( id : number ) {

        try {

            // add raycaster if does not exist
            if(this.getRaycasterWithPointById(id) == null ){

                this.raycastersWithPoints.push( 
                    new AjhRaycasterWithPoint(id)
                );

            }

        } 
        catch (e) {

            //  this.logEvents.enableLog(true);
            // this.logEvents.log("Error with cache handling", e);

        }

    }

  // ======================================================== //
  
    removeRaycasterWithPointById( id : number ) {

        try {

            // Remove this event from the target's cache

            const index = this.raycastersWithPoints.findIndex(

                (foundRayPoint) => foundRayPoint.id === id,

            );

            this.raycastersWithPoints.splice(index, 1);

        } 
        catch (e) {

          //  this.logEvents.enableLog(true);

           // this.logEvents.log("Error with cache handling", e);

        }

    }


  // ======================================================== //

    getRaycasterWithPointById( 
        itemId : any
    ) : AjhRaycasterWithPoint  | null {

        // Return the cache for this event's target element

        let foundRaycasterWithPoint = null;

        for (
            let index = 0; 
            index < this.raycastersWithPoints.length; 
            index++
        ) {

            const element = this.raycastersWithPoints[index];

            if( itemId == element.id ){

                foundRaycasterWithPoint =  element
            
            } 
            
        }

        if(foundRaycasterWithPoint == null){
            
        // this.logEvents.log("Error with cache handling", itemId);
        
        }

        return foundRaycasterWithPoint;

    }

  // ======================================================== //

  updateAllRayCasters(camera : Camera){

    this.raycastersWithPoints.forEach( 

        ( element ) => {
        
            let evt 
            = 
            this.EventMemoryCacheManager
            .getPointerEventById(element.id);
            
            element.updatePointCoords(

                new Vector2(
                    evt?.clientX,
                    evt?.clientY
                )

            );

            console.log( 
                " updateAllRayCasters :: x:" 
                + 
                element.screenPoint.x
                +
                ", y:"
                +
                element.screenPoint.y
                +
                "." 
            );
            
            element
            .updateRaycaster(
                camera,
                element.screenPoint
            );

        }

    );

  }

  // ======================================================== //
  
    // removeItemFromCurrentlyIntersectedByI()
    // : Array<AjhDisplayItem> {


    // }
  
  
  // ======================================================== //

    findCurrentlyIntersectedItems()
    : Array<AjhDisplayItem> {

        // Return the cache for this event's target element

        let foundIntersectedItems : Array<AjhDisplayItem> 
        = 
        new Array<AjhDisplayItem>();

        for (
            let index = 0; 
            index < this.interactiveItems.length; 
            index++
        ) {

            const element = this.interactiveItems[index];

            if( element.intersected == true ){

                foundIntersectedItems.push( element );
            
            } 
            
        }

        if( foundIntersectedItems.length == 0 ){
            
            console.log( 
                " No intersected items found from array of " 
                + 
                this.interactiveItems.length
                +
                " items" 
            );

        // this.logEvents.log("Error with cache handling", itemId);
        
        } else {

            console.log(

                " SUCCESS :: "
                +
                foundIntersectedItems.length  
                +
                " intersected items found"
                
            );

        }

        return foundIntersectedItems;

    }

// ======================================================== //

    checkAllItemsForIntersection(){

        for (
            let index = 0; 
            index < this.raycastersWithPoints.length; 
            index++
        ) {

            const raycasterElement = this.raycastersWithPoints[index];
            
            this.interactiveItems.forEach(
    
                ( element ) => {
            
                    element.checkIfIntersectsWith( raycasterElement.raycaster );
        
                }

            );

        }
        
    }


// ======================================================== //

}