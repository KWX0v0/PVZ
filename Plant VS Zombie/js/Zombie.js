function  Zombie(images,height,width,count,actions){
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
    this.offsetX = 0;
    this.offsetY = 0;
    this.sprite =  new createjs.Sprite(ZombieSprite);
    let _this = this;
    this.init = function(x,y,stage){
        _this.sprite.x = x+_this.offsetX;
        _this.sprite.y = y+_this.offsetY;
        _this.stage = stage;
    }
}


function normalZombie(){
    this.zombie = Zombie;
    var img = ["image/Zombie/NormalZombie/zombie.png","image/Zombie/NormalZombie/zombie-NoHead.png"];
    this.width = 200;
    this.height = 130;
    var count = 345;
    //NH ----  NoHead
    var actions = {"stand":[0,43,,0.3],"move1":[44,90,,0.3],"move2":[91,137,,0.3],"eat":[138,177,,0.3],"die":[178,210,,0.3],"NH-move1":[211,257,,0.3],"NH-move2":[258,304,,0.3],"NH-eat":[305,344,,0.3]};
    this.zombie(img,this.height,this.width,count,actions);
    
}

function ConeZombie(){
    this.zombie = Zombie;
    var img = ["image/Zombie/ConeZombie/ConeZombie1.png","image/Zombie/ConeZombie/ConeZombie2.png","image/Zombie/ConeZombie/ConeZombie3.png"];
    this.width = 100;
    this.height = 150;
    var count = 446;
    //CH ---- ConeHurted        CB ----  ConeBroked
    var actions = {"stand":[0,43,,0.3],"move1":[44,90,,0.3],"move2":[91,137,,0.3],"eat":[138,177,,0.3],"CH-move1":[178,224,,0.3],"CH-move2":[225,271,,0.3],"CH-eat":[272,311,,0.3],"CB-move1":[312,358,,0.3],"CB-move2":[359,405,,0.3],"CB-eat":[406,445,,0.3]};
    this.zombie(img,this.height,this.width,count,actions);
    
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