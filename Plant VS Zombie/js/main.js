window.onload = function(){
    var stage = new createjs.Stage("Canvas");
    var index = new Index();
    stage.addChild(index);
    createjs.Ticker.addEventListener('tick',()=>{
        CheckPage();
        stage.update();
    })
    createjs.Ticker.setFPS(60);
    function CheckPage(){
        if(index.select==1){
            index.select=0;
            setTimeout(() => {
                var adventure = new Adventure();
                stage.addChild(adventure);
            }, 3000); 
        } 
    }
}