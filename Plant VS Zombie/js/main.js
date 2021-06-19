window.onload = function(){
    var stage = new createjs.Stage("Canvas");
    stage.index = new Index();
    stage.addChild(stage.index);
    createjs.Ticker.addEventListener('tick',()=>{
        CheckPage();
        
        stage.update();
    })
    createjs.Ticker.setFPS(60);
    function CheckPage(){
        if(stage.index.select==1){
            stage.index.select=0;
            setTimeout(() => {
                stage.adventure = new Adventure();
                stage.addChild(stage.adventure);
            }, 3000); 
        } 
    }
}