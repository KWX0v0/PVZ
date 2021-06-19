function Index(){
    this.select = 0;
    this.clickEnable = true;
    var BtnArr = new Array();
    var background = new createjs.Bitmap("image/index/Surface.png");
    background.scaleX = 0.915;
    var NameLabel = new createjs.Bitmap("image/index/SelectorScreen_WoodSign1.png");
    NameLabel.y = -10;
    var saveLabel = new createjs.Bitmap("image/index/SelectorScreen_WoodSign2.png");
    saveLabel.y = 130;
    var Btn1 = new createjs.Bitmap("image/index/SelectorScreen_StartAdventure_Button1.png");
    Btn1.x = 420;
    Btn1.y = 50;
    Btn1.id = 1;
    BtnArr.push(Btn1);
    var Btn2 = new createjs.Bitmap("image/index/SelectorScreen_Survival_button.png");
    Btn2.x = 420;
    Btn2.y = 160;
    Btn2.id = 2;
    BtnArr.push(Btn2);
    var Btn3 = new createjs.Bitmap("image/index/SelectorScreen_Challenges_button.png");
    Btn3.x = 420;
    Btn3.y = 250;
    Btn3.id = 3;
    BtnArr.push(Btn3);
    var Btn4 = new createjs.Bitmap("image/index/SelectorScreen_Vasebreaker_button.png");
    Btn4.x = 420;
    Btn4.y = 330;
    Btn4.id = 4;
    BtnArr.push(Btn4);
    var ZombieHandss = new createjs.SpriteSheet({
        images:["image/index/ZombieHand.png"],
        frames:{
            height:600,
            width:800,
            count:25
        },
        animations:{
            move:[0,24,,0.4],
        }
    });
    var ZombieHand = new createjs.Sprite(ZombieHandss);
    ZombieHand.x = 10;
    ZombieHand.y = 3;
    this.addChild(background,NameLabel,saveLabel);
    
    for(var i=0;i<BtnArr.length;i++){
        var temp = new createjs.Shape();
        temp.graphics.beginFill("#000").drawRect(0,15,290,100);
        BtnArr[i].hitArea = temp;
        BtnArr[i].addEventListener("click",(e)=>{
            if(this.clickEnable) Btnclick(e.target.id);
        })
        this.addChild(BtnArr[i]);
    }
    this.addChild(ZombieHand);
    
    let _this = this;
    function Btnclick(i){
        _this.select = i;
        switch(i){
            case 1:
                _this.clickEnable = false;
                var highlight = new createjs.Bitmap("image/index/SelectorScreen_StartAdventure_Highlight.png");
                highlight.x = 420;
                highlight.y = 50;
                _this.addChild(highlight);
                var timer = setInterval(()=>{
                    highlight.alpha = highlight.alpha==0?1:0;
                },100)
                ZombieHand.gotoAndPlay("move")
                setTimeout(() => {ZombieHand.stop()},1000);
                setTimeout(()=>{
                    clearInterval(timer);
                    _this.clickEnable = true;
                    _this.parent.removeChild(_this);
                },3000)
                break;
            case 2:
            case 3:
            case 4:
                alert("暂未开放，尽请期待")
                break;
        }
    }
}
Index.prototype = new createjs.Container();