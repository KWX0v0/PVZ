function  Zombie(images,height,width,count,actions,life){
    this.stage = null;
    var ZombieSprite = new createjs.SpriteSheet({
        "images":images,
        "frames":{
            "height":height,
            "width":width,
            "count":count
        },
        "animations":actions
    });
    this.timer = null;
    this.IsEating = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.line = 0;
    this.life = life;
    this.damage = 1;
    this.sprite =  new createjs.Sprite(ZombieSprite);
    var  zombieY = [50,140,250,340,440];
    this.init = function(x,line,stage){
        this.sprite.x = x+this.offsetX;
        this.sprite.y = zombieY[line]+this.offsetY;
        this.line = line;
        this.stage = stage;
    }
}


function normalZombie(){
    this.zombie = Zombie;
    var img = ["image/Zombie/NormalZombie/zombie.png","image/Zombie/NormalZombie/zombie-NoHead.png"];
    this.width = 200;
    this.height = 130;
    var count = 345;
    this.hitX = 100;
    //NH ----  NoHead
    var actions = {"stand":[0,43,,0.3],"move1":[44,90,,0.3],"move2":[91,137,,0.3],"eat":[138,177,,0.3],"die":[178,210,,0.3],"NH-move1":[211,257,,0.3],"NH-move2":[258,304,,0.3],"NH-eat":[305,344,,0.3]};
    this.zombie(img,this.height,this.width,count,actions,200);
    let dropHead = false;
    this.speed = 18;
    this.type = 1;
    this.isLive = true;
    this.auto = function(){
        this.sprite.gotoAndPlay("move"+this.type);
        this.timer = setInterval(()=>{
            if(!this.IsEating)this.sprite.x -= this.speed/100;//0.9
            if(this.life<=70&&!dropHead) {
                dropHead = true;
                if(!this.IsEating) this.sprite.gotoAndPlay("NH-move"+this.type);
                else this.sprite.gotoAndPlay("NH-eat");
                // let head = new createjs.Bitmap("image/Zombie/NormalZombie/ZombieHead.png");
                // head.x = 400;
                // head.y = 300;
                // head.regX = 25;
                // head.regY = 25;
                // this.addChild(head);
                // createjs.Tween.get(head).to({rotation:80,x:420,y:270},300).to({rotation:180,x:430,y:400},200);
            }
            var plantId = -1;
            for(var i=0;i<this.stage.gameMap[this.line].length;i++){
                if(!this.stage.gameMap[this.line][i].hasPlant) continue;
                if(this.stage.gameMap[this.line][i].hitTest(this.sprite.x+this.hitX,this.sprite.y+this.height/2)){
                    plantId = i;
                    this.stage.gameMap[this.line][plantId].plant.life-=this.damage;
                }
            }
            if(plantId!=-1&&!this.IsEating){
                if(dropHead) this.sprite.gotoAndPlay("NH-eat");
                else this.sprite.gotoAndPlay("eat");
                var index1 = this.stage.getChildIndex(this.stage.gameMap[this.line][plantId].plant.sprite);
                var index2 = this.stage.getChildIndex(this.sprite);
                var index3 = this.stage.getChildIndex(this.stage.gameMap[this.line][plantId].plant.shadow);
                if(index1>index2) {
                    this.stage.containers[this.line+1].swapChildrenAt(index1,index2);
                    if(index2<index3) this.stage.containers[this.line+1].swapChildrenAt(index2,index3);
                }//改变僵尸与植物的层级
                this.IsEating = true;
            }
            if(this.IsEating&&plantId==-1){
                if(dropHead) this.sprite.gotoAndPlay("NH-move"+this.type);
                else this.sprite.gotoAndPlay("move"+this.type);
                this.IsEating = false;   
            }
            if(this.life<=0){
                this.stop();
                this.sprite.alpha = 1;
                this.isLive = false;
                this.sprite.gotoAndPlay("die");
                setTimeout(() => {
                    this.sprite.stop();
                    setTimeout(() => {
                        this.stage.containers[this.line+1].removeChild(this.sprite);
                    }, 800);
                }, 1700);
            }
        },10);
    }
    this.stop= function(){
        this.sprite.stop();
        clearInterval(this.timer);
    }
}

function ConeZombie(){
    this.zombie = Zombie;
    var img = ["image/Zombie/ConeZombie/ConeZombie1.png","image/Zombie/ConeZombie/ConeZombie2.png","image/Zombie/ConeZombie/ConeZombie3.png"];
    this.width = 100;
    this.height = 150;
    var count = 446;
    //CH ---- ConeHurted        CB ----  ConeBroked
    var actions = {"stand":[0,43,,0.3],"move1":[44,90,,0.3],"move2":[91,137,,0.3],"eat":[138,177,,0.3],"CH-move1":[178,224,,0.3],"CH-move2":[225,271,,0.3],"CH-eat":[272,311,,0.3],"CB-move1":[312,358,,0.3],"CB-move2":[359,405,,0.3],"CB-eat":[406,445,,0.3]};
    this.zombie(img,this.height,this.width,count,actions,);
    
}

function BucketZombie(){
    this.zombie = Zombie;
    var img = ["image/Zombie/BucketZombie/BucketZombie1.png","image/Zombie/BucketZombie/BucketZombie2.png","image/Zombie/BucketZombie/BucketZombie3.png"];
    this.width = 100;
    this.height = 150;
    var count = 446;
    //BH ---- BucketHurted        BB ----  BucketBroked
    var actions = {"stand":[0,43,,0.3],"move1":[44,90,,0.3],"move2":[91,137,,0.3],"eat":[138,177,,0.3],"BH-move1":[178,224,,0.3],"BH-move2":[225,271,,0.3],"BH-eat":[272,311,,0.3],"BB-move1":[312,358,,0.3],"BB-move2":[359,405,,0.3],"BB-eat":[406,445,,0.3]};
    this.zombie(img,this.height,this.width,count,actions);
    
}