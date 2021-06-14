function Adventure(){
    var background = new createjs.Bitmap("image/adventure/background1.jpg");
    var cars = new Array();
    this.sun = 500;
    this.Cards = new Array();
    var sunNum = null;
    background.x = 0;
    this.gameMap = new Array();
    this.ZombieList = new Array();
    this.ClickEnable = false;
    this.sunCount = 0;
    this.sunFresh = Math.ceil(Math.random()*274)+425;
    this.addChild(background);
    let _this = this;
    createjs.Tween.get(background).wait(500).to({x:-580},1500).wait(1500).to({x:-215},500)
    setTimeout(function(){
        start();
    },4000); 
    function start(){ 
         // 一个格子82x95 起步为40x90  可点击范围为78x90
        for(var i=0;i<5;i++){
            var mY = i*95+90;
            _this.gameMap.push([]);
            for(var j=0;j<9;j++){
                var mX = j*82+40;
                var grid = new createjs.Shape();
                grid.graphics.beginFill("#000").drawRect(mX,mY,78,90);
                grid.hasPlant = false;
                grid.plant = null;
                _this.gameMap[i].push(grid);
            }
        }
        
        for(var i=0;i<5;i++){
            var car = new createjs.Sprite(new createjs.SpriteSheet({
                    "images":["image/adventure/LawnMower.png"],
                    "frames":{
                        height:80,
                        width:80,
                        count:17
                    },
                    "animations":{
                        stop:0,
                        move:[0,16,,0.4]
                    }
                }),"stop");
            cars.push(car);
            cars[i].x = -30;
            cars[i].y = i*95+110;
            cars[i].isHit = false;
            _this.addChild(cars[i]);
        }
        var seedBank = new createjs.Bitmap("image/adventure/SeedBank.png");
        var shovelBank = new createjs.Bitmap("image/adventure/ShovelBank.png");
        shovelBank.x = 446;
        shovel = new Shovel(440,-5,_this);
        sunNum = new createjs.Text(_this.sun, "20px Arial", "#000");
        sunNum.x = 34;
        sunNum.y = 63;
        _this.addChild(seedBank,sunNum);
        //卡片之间间距为5 卡片宽为50 字体大小11
        var sunflowerCard = new SunflowerCard(83,8,_this);
        _this.Cards.push(sunflowerCard);
        var peashooterCard = new PeashooterCard(138,8,_this);
        _this.Cards.push(peashooterCard);
        for (let i = 0; i < _this.Cards.length; i++) {
            _this.addChild(_this.Cards[i].CardBitmap);
        }
        var prepare =  new createjs.Sprite( new createjs.SpriteSheet({
            "images":["image/adventure/PrepareGrowPlants.png"],
            "frames":{
                "height":108,
                "width":255,
                "count":3
            },
            "animations":{
                "move":[0,2,,0.02]
            }
        }),"move");
        prepare.x = 280;
        prepare.y = 250;
        _this.addChild(prepare);
        setInterval(()=>{
            allCheck(_this);
        },100)
        setTimeout(()=>{
            _this.ClickEnable = true;
            _this.removeChild(prepare)
            _this.addChild(shovelBank,shovel.bitmap);
            DropSunlight();
            var zombie = new normalZombie();
            zombie.init(700,4,_this);
            zombie.auto();
            _this.ZombieList.push(zombie)
            _this.addChild(_this.ZombieList[0].sprite);
        },2500)
       
    }
    
    function DropSunlight(){
        setTimeout(()=>{
            var sunX = Math.ceil(Math.random()*500)+50;
            var sunlight = new SunLight();
            sunlight.init(sunX,0,_this);
            _this.addChild(sunlight.sprite);
            createjs.Tween.get(sunlight.sprite).to({x:sunX+Math.ceil(Math.random()*100)-50,y:500-Math.ceil(Math.random()*300)},6000);
            setTimeout(()=>{
                sunlight.auto()
            },6000);
            _this.sunCount++;
            DropSunlight();
        },_this.sunFresh*10)
    }


    function allCheck(){
        //sun-check
        if(sunNum!=null){
            sunNum.text = _this.sun;
            if(_this.sun>=10&&_this.sun<100) sunNum.x = 28;
            else if(_this.sun>=100&&_this.sun<1000) sunNum.x = 22;
            else if(_this.sun>=1000&&_this.sun<10000) sunNum.x = 16;
            else if(_this.sun<10) sunNum.x = 34;
        }
        for(var i=0;i<_this.Cards.length;i++){
            if(_this.sun<_this.Cards[i].price){
                _this.Cards[i].sunEnough = false;
            }else{
                _this.Cards[i].sunEnough = true;
            }
            _this.Cards[i].check();
        }
        var B = Math.ceil(Math.random()*425);
        _this.sunFresh = _this.sunCount*10+425>950?950+B:_this.sunCount*10+425+B;
        //zombie-check
        for (var i = 0; i < _this.ZombieList.length; i++) {
            if(_this.ZombieList[i].sprite.x+_this.ZombieList[i].hitX<=0){
        
            }
            if(_this.ZombieList[i].life<=0){
                var temp = _this.getChildIndex(_this.ZombieList[i].sprite);
                clearInterval(_this.ZombieList[i].timer);
                _this.ZombieList[i].sprite.gotoAndPlay("die");
                _this.ZombieList.splice(i,1);
                setTimeout(() => {
                    _this.getChildAt(temp).stop();
                    setTimeout(() => {
                        _this.removeChildAt(temp);
                    }, 1000);
                }, 1700);
            }
            else if(_this.ZombieList[i].sprite.x+_this.ZombieList[i].hitX<=cars[_this.ZombieList[i].line].x+80){
                cars[_this.ZombieList[i].line].isHit = true;
                _this.removeChild(_this.ZombieList[i].sprite);
                var LawnMowered = new createjs.Sprite(new createjs.SpriteSheet({
                    images:["image/adventure/LawnMoweredZombie.png"],
                    frames:{
                        height:140,
                        width:550,
                        count:8
                    },
                    animations:{
                        crash:[0,7,,0.13]
                    }
                }),"crash");
                LawnMowered.x = _this.ZombieList[i].sprite.x+_this.ZombieList[i].hitX-200;
                LawnMowered.y = _this.ZombieList[i].sprite.y;
                _this.addChild(LawnMowered);
                setTimeout(()=>{
                    LawnMowered.stop();
                    setTimeout(()=>{
                        _this.removeChild(LawnMowered);
                    },500)
                },1000)
                clearInterval(_this.ZombieList[i].timer);
                _this.ZombieList.splice(i,1);
            }
        }
        //car-check
        for (var i = 0; i < cars.length; i++) {
            if(cars[i].isHit){
                cars[i].gotoAndPlay("move");
                cars[i].x+=30;
            }
            if(cars[i].x>=810){
                _this.removeChild(cars[i]);
            }
            
        }
        //plant-check
        for (var i = 0; i < _this.gameMap.length; i++) {
            for(var j=0;j<_this.gameMap[i].length;j++){
                if(!_this.gameMap[i][j].hasPlant) continue;
                if(_this.gameMap[i][j].plant.life<=0){
                    _this.removeChild(_this.gameMap[i][j].plant.sprite,_this.gameMap[i][j].plant.shadow);
                    _this.gameMap[i][j].hasPlant = false;
                    _this.gameMap[i][j].plant.stop();
                    _this.gameMap[i][j].plant = null;
                }
            }
            
        }
    }
}
Adventure.prototype = new createjs.Container();

