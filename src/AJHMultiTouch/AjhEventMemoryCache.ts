import AjhLog from "../AjhLogging/AjhLog";

export default class AjhEventMemoryCache {

    // ================================================================== //
    
        // an array of the object to be checked for event interaions
        // containing ::
        // an array of memory events registered by id
        EventMemoryCache : Array<any> = new Array<any>();

        logEvents : AjhLog = new AjhLog();


    // ================================================================== //
    
        constructor(){

        }

    // ================================================================== //
    
        pushEventIntoCache(ev : any) {

            // Save this event in the target's cache
            this.EventMemoryCache.push(ev);
        
        }

    // ================================================================== //
    
        removeEventFromCache(ev : any) {

            try {

                // Remove this event from the target's cache

                const index = this.EventMemoryCache.findIndex(

                    (cachedEv) => cachedEv.pointerId === ev.pointerId,

                );

                this.EventMemoryCache!.splice(index, 1);

            } 
            catch (e) {

                this.logEvents.enableLog(true);

                this.logEvents.log("Error with cache handling", e);

            }

        }

}