  // an array of the object to be checked for event interaions
  // containing ::
  // an array of memory events registered by id
  let EventMemoryCache : Array<any> = new Array<any>();
  

function pushEvent(ev : any) {

    // Save this event in the target's cache
    const evCache = getCacheForEvent(ev);

    evCache!.push(ev);

  }
  
  function removeEvent(ev : any) {

    // Remove this event from the target's cache
    const evCache = getCacheForEvent(ev);

    const index = evCache!.findIndex(

      (cachedEv) => cachedEv.pointerId === ev.pointerId,

    );

    evCache!.splice(index, 1);

  }

  function getCacheForEvent( ev : any): any[]  | null {

    // Return the cache for this event's target element

    let returnedElement = null;

    for (let index = 0; index < EventMemoryCache.length; index++) {

        const element = EventMemoryCache[index];

        if( EventMemoryCache == ev.target.id ){

            returnedElement =  ev.target.id
        
        } 
        
    }

    if(returnedElement == null){
        
        log("Error with cache handling", ev);
    }

    return returnedElement;
  
  }

