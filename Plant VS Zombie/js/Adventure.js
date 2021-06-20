function Adventure(){
    let background = new createjs.Bitmap("image/adventure/background1.jpg");
    let cars = new Array();
    this.gameMap = new Array();
    this.ZombieList = new Array();
    this.Cards = new Array();
    this.containers = new Array();
    // 0为上方放置框 1-5为地图1-5行 6为掉落物 7为进度条 8为僵尸预览舞台
    this.ClickEnable = false;
    this.sun = 50;
    this.sunCount = 0;
    let sunNum = null;
    this.checkTimer=null;
    this.zombieTimer = null;
    this.sunTimer = null;
    this.sunFresh = Math.ceil(Math.random()*274)+425;
    this.addChild(background);
    let _this = this;
    createjs.Tween.get(background).wait(500).to({x:-580},1500).wait(1500).to({x:-215},500);
    setTimeout(function(){
        init();
    },4000); 
    function init(){ 
         // 一个格子82x95 起步为40x90  可点击范围为78x90
        for(let i=0;i<5;i++){
            let mY = i*95+90;
            _this.gameMap.push([]);
            for(let j=0;j<9;j++){
                let mX = j*82+40;
                let grid = new createjs.Shape();
                grid.graphics.beginFill("#000").drawRect(mX,mY,78,90);
                grid.hasPlant = false;
                grid.plant = null;
                _this.gameMap[i].push(grid);
            }
        }
        for(let i=0;i<9;i++){
            let child =  new createjs.Container();
            _this.containers.push(child);
            _this.addChild(_this.containers[i]);
        }
        for(let i=0;i<5;i++){
            let car = new createjs.Sprite(new createjs.SpriteSheet({
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
            _this.containers[i+1].addChild(cars[i]);
        }
        let seedBank = new createjs.Bitmap("image/adventure/SeedBank.png");
        let shovelBank = new createjs.Bitmap("image/adventure/ShovelBank.png");
        let shovel = new Shovel(440,-5,_this);
        shovelBank.x = 446;
        sunNum = new createjs.Text(_this.sun, "20px Arial", "#000");
        sunNum.x = 34;
        sunNum.y = 63;
        
        _this.containers[0].addChild(seedBank,sunNum);
        //卡片之间间距为5 卡片宽为50 字体大小11
        let sunflowerCard = new SunflowerCard(83,8,_this);
        _this.Cards.push(sunflowerCard);
        let peashooterCard = new PeashooterCard(138,8,_this);
        _this.Cards.push(peashooterCard);
        for (let i = 0; i < _this.Cards.length; i++) {
            _this.containers[0].addChild(_this.Cards[i].CardBitmap);
        }
        let prepare =  new createjs.Sprite( new createjs.SpriteSheet({
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
        _this.containers[6].addChild(prepare);
        let process = new createjs.Bitmap("image/adventure/FlagMeterFull.png");
        process.x = _this.parent.canvas.width - 157;
        process.y = _this.parent.canvas.height - 21;
        let processTitle = new createjs.Bitmap("image/adventure/FlagMeterLevelProgress.png");
        processTitle.x = process.x + 35;
        processTitle.y = process.y - 11;
        let processCover = new createjs.Shape();
        processCover.graphics.beginFill("#000").drawRect(_this.parent.canvas.width-151,_this.parent.canvas.height-15,145,9);
        allCheck();
        setTimeout(()=>{
            _this.ClickEnable = true;
            _this.containers[6].removeChild(prepare)
            _this.containers[0].addChild(shovelBank,shovel.bitmap);
            _this.containers[7].addChild(process,processTitle,processCover);
            createjs.Tween.get(processCover.graphics.command).to({w:0},300000)
            DropSunlight();
            setTimeout(() => {
                ZombieComing();
            }, 5000);
        },2500)
       
    }
    
    function DropSunlight(){
        _this.sunTimer = setTimeout(()=>{
            let sunX = Math.ceil(Math.random()*500)+50;
            let sunlight = new SunLight();
            sunlight.init(sunX,0,_this);
            _this.containers[6].addChild(sunlight.sprite);
            createjs.Tween.get(sunlight.sprite).to({x:sunX+Math.ceil(Math.random()*100)-50,y:500-Math.ceil(Math.random()*300)},6000);
            setTimeout(()=>{
                sunlight.auto()
            },6000);
            _this.sunCount++;
            DropSunlight();
        },_this.sunFresh*10)
    }
    
    this.startAll = function (){
        DropSunlight();
        ZombieComing();
        allCheck();
        for (let i = 0; i < _this.gameMap.length; i++) {
            for (let j = 0; j < _this.gameMap[i].length; j++) {
                if(this.gameMap[i][j].hasPlant) this.gameMap[i][j].plant.auto();
            }
        }
        for(let i=0;i<_this.ZombieList.length;i++){
            this.ZombieList[i].auto();
        }
    }

    this.stopAll = function(){
        clearInterval(this.checkTimer);
        clearTimeout(this.zombieTimer);
        clearTimeout(this.sunTimer);
        for (let i = 0; i < _this.gameMap.length; i++) {
            for (let j = 0; j < _this.gameMap[i].length; j++) {
                if(this.gameMap[i][j].hasPlant) this.gameMap[i][j].plant.stop();
            }
        }
        for(let i=0;i<_this.ZombieList.length;i++){
            this.ZombieList[i].stop();
        }
    }


    var comingTime = 10;
    var waves = 0;
    var zombiecount = 1;
    function ZombieComing(){
        _this.zombieTimer = setTimeout(() => {
            for(let i=0;i<zombiecount;i++){
                let zombie = new normalZombie();
                let line = (Math.ceil(Math.random()*(50+i))+100)%5;
                let ZX = (Math.ceil(Math.random()*3)+i)*50+800; 
                zombie.init(ZX,line,_this);
                zombie.type = Math.ceil(Math.random()*2);
                _this.ZombieList.push(zombie);
                _this.ZombieList[_this.ZombieList.length-1].auto();
                _this.containers[line+1].addChild(_this.ZombieList[_this.ZombieList.length-1].sprite);
            }
            waves++;
            comingTime =  waves>=3?Math.ceil(Math.random()*10)+30:40;
            zombiecount = waves>=3?Math.ceil(Math.random()*5)+3:Math.ceil(Math.random()*4)+1;
            ZombieComing();
        },comingTime*1000);
    }
    
    function allCheck(){
        _this.checkTimer = setInterval(()=>{
            //sun-check
            if(sunNum!=null){
                sunNum.text = _this.sun;
                if(_this.sun>=10&&_this.sun<100) sunNum.x = 28;
                else if(_this.sun>=100&&_this.sun<1000) sunNum.x = 22;
                else if(_this.sun>=1000&&_this.sun<10000) sunNum.x = 16;
                else if(_this.sun<10) sunNum.x = 34;
            }
            for(let i=0;i<_this.Cards.length;i++){
                if(_this.sun<_this.Cards[i].price){
                    _this.Cards[i].sunEnough = false;
                }else{
                    _this.Cards[i].sunEnough = true;
                }
                _this.Cards[i].check();
            }
            let B = Math.ceil(Math.random()*425);
            _this.sunFresh = _this.sunCount*10+425>950?950+B:_this.sunCount*10+425+B;
            //zombie-check
            for (let i = 0; i < _this.ZombieList.length; i++) {
                if(!_this.ZombieList[i].isLive){
                    _this.ZombieList.splice(i,1);
                    i--;
                    continue;
                }
                
                if(cars[_this.ZombieList[i].line]&&_this.ZombieList[i].sprite.x+_this.ZombieList[i].hitX<=cars[_this.ZombieList[i].line].x+80&&_this.ZombieList[i].sprite.x+_this.ZombieList[i].hitX<=750){
                    let line = _this.ZombieList[i].line;
                    cars[line].isHit = true;
                    _this.containers[line+1].removeChild(_this.ZombieList[i].sprite);
                    _this.ZombieList[i].stop();
                    let LawnMowered = new createjs.Sprite(new createjs.SpriteSheet({
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
                    LawnMowered.isStop = false;
                    _this.containers[line+1].addChild(LawnMowered);

                    setTimeout(()=>{
                        LawnMowered.stop();
                        setTimeout(()=>{
                            _this.containers[line+1].removeChild(LawnMowered);
                        },500)
                    },1000)
                    _this.ZombieList.splice(i,1);
                    i--;
                    
                }
                else if(_this.ZombieList[i].sprite.x+_this.ZombieList[i].hitX<=0){
                    _this.stopAll();
                    _this.removeChild(_this.containers[0]);
                    _this.ZombieList[i].sprite.gotoAndPlay("move"+_this.ZombieList[i].type);
                    createjs.Tween.get(_this).to({x:215},1000);
                    createjs.Tween.get(_this.ZombieList[i].sprite).wait(1000).to({x:-_this.ZombieList[i].hitX-150,y:260,alpha:0},1000);
                    let zombieWon = new createjs.Bitmap("image/ZombiesWon.png");
                    zombieWon.scaleX = 0.1;//564X468
                    zombieWon.scaleY = 0.1;
                    zombieWon.x = 167;
                    zombieWon.y = 277;
                    setTimeout(()=>{_this.containers[6].addChild(zombieWon)},2000);
                    createjs.Tween.get(zombieWon).wait(2000).to({x:-87,y:66,scaleX:1,scaleY:1},2000);
                    setTimeout(()=>{
                        _this.parent.index = new Index();
                        _this.parent.addChild(_this.parent.index);
                        _this.parent.removeChild(_this);
                    },6000)
                    break;
                }
            }
            //car-check
            for (let i = 0; i < cars.length; i++) {
                if(!cars[i]) continue;
                if(cars[i].isHit){
                    cars[i].gotoAndPlay("move");
                    cars[i].x+=30;
                }
                if(cars[i].x>=830){
                    _this.containers[i+1].removeChild(cars[i]);
                    cars[i] = null;
                }
                
            }
            //plant-check
            for (let i = 0; i < _this.gameMap.length; i++) {
                for(let j=0;j<_this.gameMap[i].length;j++){
                    if(!_this.gameMap[i][j].hasPlant) continue;
                    if(_this.gameMap[i][j].plant.life<=0){
                        _this.containers[i+1].removeChild(_this.gameMap[i][j].plant.sprite,_this.gameMap[i][j].plant.shadow);
                        _this.gameMap[i][j].hasPlant = false;
                        _this.gameMap[i][j].plant.stop();
                        _this.gameMap[i][j].plant = null;
                    }
                }
                
            }
        },100)
    }
    
}
Adventure.prototype = new createjs.Container();

