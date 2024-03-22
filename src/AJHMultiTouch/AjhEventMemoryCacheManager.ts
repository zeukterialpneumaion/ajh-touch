import AjhLog from "../AjhLogging/AjhLog";
import AjhEventMemoryCache from "./AjhEventMemoryCache";

export default class AjhEventMemoryCacheManager {

    // ================================================================== //
    
        // an array of the object to be checked for event interaions
        // containing ::
        // an array of memory events registered by id
       // EventMemoryCache : Array<AjhEventMemoryCache> = new Array<any>();
        logEvents : AjhLog = new AjhLog();


    // ================================================================== //
    
        constructor(){

        }

    // ================================================================== //
    
        getEventMemoryCacheForItem( 
            itemId : any,
            items : any[]
        ): AjhEventMemoryCache  | null {

            // Return the cache for this event's target element
        
            let foundEventMemoryCache = null;
        
            for (
                let index = 0; 
                index < items.length; 
                index++
            ) {
        
                const element = items[index];
        
                if( itemId == element.id ){
        
                    foundEventMemoryCache =  element
                
                } 
                
            }
        
            if(foundEventMemoryCache == null){
                
                this.logEvents.log("Error with cache handling", itemId);
            }
        
            return foundEventMemoryCache;
        
        }

    // ================================================================== //


    }