function Plant(images,height,width,count,actions,life){
    this.stage = null;
    var plantSprite = new createjs.SpriteSheet({
        "images":images,
        "frames":{
            "height":height,
            "width":width,
            "count":count
        },
        "animations":actions
    });
    this.sprite =  new createjs.Sprite(plantSprite,"move");
    this.shadow = new createjs.Bitmap("image/Plants/plantshadow.png");
    let _this = this;
    this.offsetX = 0;
    this.offsetY = 0;
    this.ShadowX = 0;
    this.ShadowY = 0;
    this.life =  life;
    this.line = 0;
    this.init = function(x,y,stage){
        _this.sprite.x = x+_this.offsetX;
        _this.sprite.y = y+_this.offsetY;
        _this.stage = stage;
        _this.shadow.x = x-_this.ShadowX;
        _this.shadow.y = y-_this.ShadowY+_this.height;
    }
}
function Sunflower(){
    this.plant = Plant;
    var src = ["image/Plants/Sunflower/Sunflower.png"];
    this.height = 74;
    this.width = 73;
    var count = 36;
    var actions = {"move":[0,17,,0.3],"shine":[18,35,,0.3]};
    this.plant(src,this.height,this.width,count,actions,250);
    this.ShadowX = 8;
    this.ShadowY = 25;
    var timer = null;
    this.ProduceTime = Math.ceil(Math.random()*5)+5;//第一次5～10秒，之后每个23~25秒
    let _this = this;
    this.auto = function(){
            timer = setTimeout(()=>{
                var sunlight = new SunLight();
                sunlight.init(_this.sprite.x+10,_this.sprite.y+10,_this.stage);
                sunlight.auto();
                var RX = Math.ceil(Math.random()*_this.width) - _this.width;
                var RY = Math.ceil(Math.random()*80) + 30;
                sunlight.sprite.scaleX = 0.3;
                sunlight.sprite.scaleY = 0.3;
                _this.sprite.gotoAndPlay("shine");
                setTimeout(()=>{
                    _this.sprite.gotoAndPlay("move");
                },1000)
                setTimeout(()=>{
                    _this.stage.addChild(sunlight.sprite);
                    createjs.Tween.get(sunlight.sprite).to({scaleX:1,scaleY:1,x:_this.sprite.x+RX/4,y:_this.sprite.y-RY},400).to({x:_this.sprite.x+RX/2,y:_this.sprite.y+17},400);  
                },800)
                _this.ProduceTime = Math.ceil(Math.random()*2)+23;
                _this.auto();
            },_this.ProduceTime*1000);
        }
    this.stop = function(){
        clearTimeout(timer);
    }
}
function Peashooter(){
    this.plant = Plant;
    var src = ["image/Plants/Peashooter/Peashooter.png"];
    this.height = 80;
    this.width = 80;
    var count = 68;
    var actions = {"move":[43,67,,0.4],"shoot":[0,42,,0.51]};
    this.plant(src,this.height,this.width,count,actions,250);
    this.offsetX = -5;
    this.offsetY = -5;
    this.ShadowX = 8
    this.ShadowY = 30;
    var isShooting = false;
    var ShootComplete = true;
    let _this = this;
    var timer1 = null;
    var timer2 = null;
    this.auto = function(){
        timer1 = setInterval(() => {
            var hasZombie = false;
            for(var i=0;i<_this.stage.ZombieList.length;i++){
                if(_this.stage.ZombieList[i].line == _this.line){
                    hasZombie = true;
                }
            } 
            if(hasZombie&&!isShooting){
                _this.sprite.gotoAndPlay("shoot");
                isShooting = true;
            }
            if(isShooting&&ShootComplete){
                ShootComplete = false;
                timer2 = setTimeout(() => {
                    var bullet = new PeaBullet(_this.sprite.x+_this.width,_this.sprite.y+20,_this.stage,_this.line);
                    ShootComplete = true;
                }, 1400);
            }
            if(!hasZombie&&isShooting){
                isShooting = false;
                _this.sprite.gotoAndPlay("move");
                clearTimeout(timer2);
            }
        }, 100);
    }
    this.stop = function(){
        clearInterval(timer1);
        clearTimeout(timer2)
    }
}

function SunLight(){
    this.plant = Plant;
    var src = ["image/Plants/SunLight.png"];
    this.height = 79;
    this.width = 79;
    var count = 29;
    var actions = {"move":[0,28,,0.2]};
    this.plant(src,this.height,this.width,count,actions);
    var suncircle = new createjs.Shape();
    suncircle.graphics.beginFill("#000").drawRect(0,0,79,79);
    this.sprite.hitArea = suncircle;
    this.Isclick= false;
    let _this = this;
    this.auto = function(){
        setTimeout(() => {
            if(!_this.Isclick) _this.stage.removeChild(_this.sprite);
        }, 8000);
    }
    this.sprite.addEventListener("click",()=>{
        if(_this.stage.ClickEnable){
            _this.Isclick = true;
            createjs.Tween.get(_this.sprite).to({x:0,y:0},600);
            setTimeout(()=>{
                _this.stage.sun+=25;
                _this.stage.removeChild(_this.sprite);
            },600);
        }
    })
}