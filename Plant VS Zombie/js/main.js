window.onload = function(){
    var stage = new createjs.Stage("Canvas");
    var index = new Index();
    // var instance = null;
    // createjs.Sound.registerSound("sounds/index.mp3","index");
    // createjs.Sound.alternateExtensions = ["mp3"];
    // createjs.Sound.addEventListener("fileload",()=>{
    //      instance = createjs.Sound.play("index",{loop:-1});
    // })
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
                // instance.paused = true;
                var adventure = new Adventure();
                stage.addChild(adventure);
            }, 3000); 
        } 
    }
}