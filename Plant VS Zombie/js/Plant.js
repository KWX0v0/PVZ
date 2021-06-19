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
    this.offsetX = 0;
    this.offsetY = 0;
    this.ShadowX = 0;
    this.ShadowY = 0;
    this.life =  life;
    this.line = 0;
    this.init = function(x,y,stage){
        this.sprite.x = x+this.offsetX;
        this.sprite.y = y+this.offsetY;
        this.stage = stage;
        this.shadow.x = x-this.ShadowX;
        this.shadow.y = y-this.ShadowY+this.height;
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
    this.timer = null;
    this.ProduceTime = Math.ceil(Math.random()*5)+5;//第一次5～10秒，之后每个23~25秒
    this.auto = function(){
            this.timer = setTimeout(()=>{
                var sunlight = new SunLight();
                sunlight.init(this.sprite.x+10,this.sprite.y+10,this.stage);
                sunlight.auto();
                var RX = Math.ceil(Math.random()*this.width) - this.width;
                var RY = Math.ceil(Math.random()*80) + 30;
                sunlight.sprite.scaleX = 0.3;
                sunlight.sprite.scaleY = 0.3;
                this.sprite.gotoAndPlay("shine");
                setTimeout(()=>{
                    this.sprite.gotoAndPlay("move");
                },1000)
                setTimeout(()=>{
                    this.stage.containers[6].addChild(sunlight.sprite);
                    createjs.Tween.get(sunlight.sprite).to({scaleX:1,scaleY:1,x:this.sprite.x+RX/4,y:this.sprite.y-RY},400).to({x:this.sprite.x+RX/2,y:this.sprite.y+17},400);  
                },800)
                this.ProduceTime = Math.ceil(Math.random()*2)+23;
                this.auto();
            },this.ProduceTime*1000);
        }
    this.stop = function(){
        clearTimeout(this.timer);
    }
}
function Peashooter(){
    this.plant = Plant;
    var src = ["image/Plants/Peashooter/Peashooter.png"];
    this.height = 80;
    this.width = 80;
    var count = 68;
    var actions = {"move":[43,67,,0.4],"shoot":[0,42,,0.51]};
    this.plant(src,this.height,this.width,count,actions,300);
    this.offsetX = -5;
    this.offsetY = -5;
    this.ShadowX = 8
    this.ShadowY = 30;
    var isShooting = false;
    var ShootComplete = true;
    this.timer1 = null;
    this.timer2 = null;
    this.auto = function(){
        this.timer1 = setInterval(() => {
            var hasZombie = false;
            for(var i=0;i<this.stage.ZombieList.length;i++){
                if(this.stage.ZombieList[i].line != this.line||!this.stage.ZombieList[i].isLive)continue;
                if(this.sprite.x<=this.stage.ZombieList[i].sprite.x+this.stage.ZombieList[i].hitX&&this.stage.ZombieList[i].sprite.x+this.stage.ZombieList[i].hitX<=750){
                    hasZombie = true;
                }
            } 
            if(hasZombie&&!isShooting){
                this.sprite.gotoAndPlay("shoot");
                isShooting = true;
            }
            if(isShooting&&ShootComplete){
                ShootComplete = false;
                this.timer2 = setTimeout(() => {
                    var bullet = new PeaBullet(this.sprite.x+this.width,this.sprite.y+15,this.stage,this.line);
                    this.stage.containers[this.line+1].addChild(bullet.bitmap);
                    ShootComplete = true;
                }, 1400);
            }
            if(!hasZombie&&isShooting){
                isShooting = false;
                ShootComplete = true;
                this.sprite.gotoAndPlay("move");
                clearTimeout(this.timer2);
            }
        }, 100);
    }
    this.stop = function(){
        clearInterval(this.timer1);
        clearTimeout(this.timer2)
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
    this.auto = function(){
        setTimeout(() => {
            if(!this.Isclick) this.stage.containers[6].removeChild(this.sprite);
        }, 8000);
    }
    this.sprite.addEventListener("click",()=>{
        if(this.stage.ClickEnable){
            this.Isclick = true;
            createjs.Tween.get(this.sprite).to({x:0,y:0},600);
            setTimeout(()=>{
                this.stage.sun+=25;
                this.stage.containers[6].removeChild(this.sprite);
            },600);
        }
    })
}