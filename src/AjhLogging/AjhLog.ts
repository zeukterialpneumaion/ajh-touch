export default class AjhLog {

    logEvents : boolean = false;
    whereToDisplay : any;

    // ================================================================== //

        constructor( whereToDisplay:any = null ){

            this.whereToDisplay = whereToDisplay; 

        }

    // ================================================================== //
    
        // ===== LOG Events ===== //

        enableLog(logEvents : boolean) {

            this.logEvents = !logEvents;

        }

    // ================================================================== //        

    log(name : string, ev : any ) {

            // whereToDisplay
            // = 
            // document.getElementsByTagName("output")[0];

            const s =
            `${name}:<br>` +
            `  pointerID   = ${ev.pointerId}<br>` +
            `  pointerType = ${ev.pointerType}<br>` +
            `  isPrimary   = ${ev.isPrimary}`;

            if( this.whereToDisplay != null){

                this.whereToDisplay.innerHTML += `${s}<br>`;

            }

        }

    // ================================================================== //

        clearLog() {

            const o = document.getElementsByTagName("output")[0];

            o.innerHTML = "";

        }

    // ================================================================== //


}