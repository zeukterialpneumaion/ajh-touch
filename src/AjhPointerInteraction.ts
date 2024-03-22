// Log events flag
let logEvents : boolean = false;

// Event caches, one per touch target
const evCache1: any[] = [];
const evCache2: any[] = [];
const evCache3: any[] = [];


function setHandlers(name : string) {
    // Install event handlers for the given element
    const el = document.getElementById(name);
    el!.onpointerdown = pointerdownHandler;
    el!.onpointermove = pointermoveHandler;
  
    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    el!.onpointerup = pointerupHandler;
    el!.onpointercancel = pointerupHandler;
    el!.onpointerout = pointerupHandler;
    el!.onpointerleave = pointerupHandler;

  }
  
  function init() {
    setHandlers("target1");
    setHandlers("target2");
    setHandlers("target3");
  }
  
function pointerdownHandler(ev : any) {
    // The pointerdown event signals the start of a touch interaction.
    // Save this event for later processing (this could be part of a
    // multi-touch interaction) and update the background color
    pushEvent(ev);
    if (logEvents) {
      log(`pointerDown: name = ${ev.target.id}`, ev);
    }
    updateBackground(ev);
  }

  
function pointermoveHandler(ev : any) {
    // Note: if the user makes more than one "simultaneous" touch, most browsers
    // fire at least one pointermove event and some will fire several pointermoves.
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the target received a move event.
    if (logEvents) {
      log("pointerMove", ev);
    }
    updateBackground(ev);
    ev.target.style.border = "dashed";
  }
  
function pointerupHandler(ev : any) {
    if (logEvents) {
      log(ev.type, ev);
    }
    // Remove this touch point from the cache and reset the target's
    // background and border
    removeEvent(ev);
    updateBackground(ev);
    ev.target.style.border = "1px solid black";
  }
  




  function updateBackground(ev : any) {
    // Change background color based on the number of simultaneous touches/pointers
    // currently down:
    //   white - target element has no touch points i.e. no pointers down
    //   yellow - one pointer down
    //   pink - two pointers down
    //   lightblue - three or more pointers down
    const evCache = getCache(ev);
    switch (evCache!.length) {
      case 0:
        // Target element has no touch points
        ev.target.style.background = "white";
        break;
      case 1:
        // Single touch point
        ev.target.style.background = "yellow";
        break;
      case 2:
        // Two simultaneous touch points
        ev.target.style.background = "pink";
        break;
      default:
        // Three or more simultaneous touches
        ev.target.style.background = "lightblue";
    }
  }


function enableLog(ev : any) {
  logEvents = !logEvents;
}

function log(name : string, ev : any) {
  const o = document.getElementsByTagName("output")[0];
  const s =
    `${name}:<br>` +
    `  pointerID   = ${ev.pointerId}<br>` +
    `  pointerType = ${ev.pointerType}<br>` +
    `  isPrimary   = ${ev.isPrimary}`;
  o.innerHTML += `${s}<br>`;
}

function clearLog(event : any) {
  const o = document.getElementsByTagName("output")[0];
  o.innerHTML = "";
}

  