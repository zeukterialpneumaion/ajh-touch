//import "../assets/css/AjhFonts.css";

export default class AjhInformationWindow {
    private _dataField: HTMLDivElement;
    public get dataField() : HTMLDivElement{
        return this._dataField;
    }
    public set dataField(value: HTMLDivElement) {
        this._dataField = value;
    }

    private _messageField: HTMLDivElement;
    public get messageField() : HTMLDivElement{
        return this._messageField;
    }
    public set messageField(value: HTMLDivElement) {
        this._messageField = value;
    }

        private _titleField: HTMLDivElement;
        public get titleField() : HTMLDivElement{
            return this._titleField;
        }
        public set titleField(value: HTMLDivElement) {
            this._titleField = value;
        }
    
        private _InformationWindowInstance: HTMLDivElement;
        public get InformationWindowInstance(): HTMLDivElement {
            return this._InformationWindowInstance;
        }
        public set InformationWindowInstance(value: HTMLDivElement) {
            this._InformationWindowInstance = value;
        }

    private _width: number = 250;
    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
    }
    
    private _height: number = 170;
    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
    }

    constructor() {

        document.body.style.margin = "0px";
        document.body.style.boxSizing = "border-box";

        // ===================================================== //
               
        this._InformationWindowInstance 
        = document.createElement('div');
        this._InformationWindowInstance.style.userSelect =  "none";//.disable();

        this._InformationWindowInstance.style.padding = "0px";
        this._InformationWindowInstance.style.height = "max-content";//"100" + "px";
        this._InformationWindowInstance.style.width = "max-content";
        
        // ===================================================== //
        
        this._titleField 
        = document.createElement('div');
        
       // this._titleField.style.maxHeight = "10" + "px";//..disable();
        this._titleField.style.userSelect =  "none";
        this._titleField.style.height = "max-content";//"100" + "px";
        this._titleField.style.width = "max-content";
        this._titleField.style.lineHeight = "13" + "px";
        this._InformationWindowInstance
        .appendChild(this._titleField);

        this._titleField.style.color = "#ff9800";
        this._titleField.style.padding = "0px";
        this._titleField.style.top = "10px";

        // ===================================================== //
        
        this._messageField 
        = document.createElement('div');
        this._messageField.style.userSelect =  "none";
        this._messageField.style.height = "max-content";//"100" + "px";
        this._messageField.style.width = "max-content";
       // this._messageField.style.maxHeight = "10" + "px";//..disable();
       //this._messageField.style.top = "15px"; 
       this._messageField.style.lineHeight = "13" + "px";
        this._InformationWindowInstance
        .appendChild(this._messageField);
        this._messageField.style.color = "#77D8FF";

        // ===================================================== //

        this._dataField 
        = document.createElement('div');
        this._dataField.style.userSelect =  "none";
        this._dataField.style.height = "max-content";//"100" + "px";
        this._dataField.style.width = "max-content";
        this._dataField;//..disable();
        //this._dataField.style.maxHeight = "10" + "px";//..disable();
        this._dataField.style.lineHeight = "13" + "px";
        this._dataField.style.top = "5px"; 
        this._InformationWindowInstance
        .appendChild(this._dataField);
        this._dataField.style.color = "#91c91a";

        // ===================================================== //
        
        this._InformationWindowInstance.style.fontFamily 
        = "Consolas";
        //Arial";
        //"Lucida Console";
        //"Minecraftia"

        this._InformationWindowInstance.style.fontSize = "12px";
        
        this._InformationWindowInstance.style.color = "#ff9800";

        this._InformationWindowInstance.style.padding = "1.5em";


        this._InformationWindowInstance.style.maxWidth 
        = 
        //this._width
        250
        + "px";

        this._InformationWindowInstance.style.maxHeight 
        = this._height+"px";

        this._InformationWindowInstance
        .style.backgroundColor
        = 
        "rgba( 44, 44, 44, 0.70 )";

        this._InformationWindowInstance.style.position = "absolute";

        this._InformationWindowInstance.style.opacity = "1.0";

        this.updateAllFields();
        this.show();

      //  this.addListeners();

    }

    addListeners(){

       

    }

   

    setPosition(){

        this._InformationWindowInstance.style.left 
        = "5px";

        this._InformationWindowInstance.style.top 
        = 0
       // ( window.innerHeight - this.height )
        + "px";

        this._InformationWindowInstance.style.maxWidth 
        =
        this._InformationWindowInstance.style.width
        =
        ((window.innerWidth/2)-46) + "px";

    }

    moveToMouseCoords(x : number,y : number){

        if( ( this.width + 40 ) < window.innerWidth ){

            this.width 
            = window.innerWidth-75;
            
            this._InformationWindowInstance.style.maxWidth 
            = this._width+"px";

        }

        // if x is less than the window width - tooltip  width
        console.log(
            window.innerWidth 
            + ":" 
            + this._width
        );
        
        if(
            x < ( window.innerWidth - ( 40 + this._width) ) 
        ){
        
            this._InformationWindowInstance.style.left 
            = (x + 15) + "px";

        }
        else 
        {

           
            if(x < ( ( 30 + this._width) ) ){
        
                this._InformationWindowInstance.style.left 
                = (15) + "px";
    
            }
            else{

                this._InformationWindowInstance.style.left 
                = (x -( 35 + this._width)) + "px";

            }

        }
        
         // if y is less than the window width - tooltip  width
        if(
            y < (window.innerHeight - (30 + this._height ) )
        ){
        
            this._InformationWindowInstance.style.top 
            = (y + 15) + "px";

        }
        else 
        {

            this._InformationWindowInstance.style.top 
            = ( y - ( 15 + this._height ) ) + "px";

        }
       
    }

    show(): void {
;

        this.setPosition();

       

        if (!this._InformationWindowInstance.parentNode){

            document.body.appendChild(

                this._InformationWindowInstance

            );
        
        }

        

    }

    hide(): void {

        console.log("InformationWindow hide()");

        if (this._InformationWindowInstance.parentNode){

            document.body.removeChild(
                this._InformationWindowInstance
            );
        
        }
    }

    updateAllFields(

        title:string = "title",
        data:string = "data",
        message:string = "message"

    ){

        this._titleField.innerText = title;
        this._messageField.innerText = message;
        this._dataField.innerText = data;
    }

 



    updateMessageField(
        message:string = "message"
    ){

        this._messageField.innerText 
        = message;

    }

   

    updateDataField(
        data:string = "data"
    ){

        this._dataField.innerText 
        = data;

    }

    updateTitleField(
        title:string = "title"
    ){

        this._titleField.innerText 
        = title;
        
    }


}