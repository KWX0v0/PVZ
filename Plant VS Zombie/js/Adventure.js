function Adventure(){
    var background = new createjs.Bitmap("image/adventure/background1.jpg");
    var cars = new Array();
    this.sun = 100;
    this.Cards = new Array();
    var sunNum = null;
    background.x = 0;
    this.gameMap = new Array();
    this.ClickEnable = false;
    this.sunCount = 0;
    this.zombieY = [50,140,250,340,440];
    this.zombieList = new Array();
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
            var car = new createjs.Bitmap("image/adventure/LawnMower.gif");
            cars.push(car);
            cars[i].x = -30;
            cars[i].y = i*100+120;
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
        
        var PrepareSprite = new createjs.SpriteSheet({
            "images":["image/adventure/PrepareGrowPlants.png"],
            "frames":{
                "height":108,
                "width":255,
                "count":3
            },
            "animations":{
                "move":[0,2,,0.02]
            }
        });
        var prepare =  new createjs.Sprite(PrepareSprite,"move");
        prepare.x = 280;
        prepare.y = 250;
        _this.addChild(prepare);
        setInterval(()=>{
            sunCheck(_this);
        },100)
        setTimeout(()=>{
            _this.ClickEnable = true;
            _this.removeChild(prepare)
            _this.addChild(shovelBank,shovel.bitmap);
            DropSunlight();
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


    function sunCheck(_this){
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
    }
}
Adventure.prototype = new createjs.Container();

