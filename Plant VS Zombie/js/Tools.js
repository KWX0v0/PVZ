
function Shovel(x,y,stage){
    this.bitmap = new createjs.Bitmap("image/adventure/Shovel.png");
    this.bitmap.x = x;
    this.bitmap.y = y;
    var hitArea = new createjs.Shape(); 
    hitArea.graphics.beginFill("#000").drawRect(0,0,80,80);
    this.bitmap.hitArea = hitArea;
    this.stage = stage;
    let _this = this;
    var plantId = -1;
    var line = 0;
    this.bitmap.addEventListener("click",()=>{
        if(_this.stage.ClickEnable){
            _this.stage.ClickEnable = false;
            //使铲子的层级为最高层
            _this.stage.removeChild(_this.bitmap);
            _this.stage.addChild(_this.bitmap);
            _this.stage.parent.addEventListener("stagemousemove",(e)=>{
                _this.bitmap.x = e.stageX-15;
                _this.bitmap.y = e.stageY-65;
                plantId = -1;
                for(var i=0;i<_this.stage.gameMap.length;i++){
                    for(var j=0;j<_this.stage.gameMap[i].length;j++){
                        if(!_this.stage.gameMap[i][j].hasPlant) continue;
                        _this.stage.gameMap[i][j].plant.sprite.alpha = 1;
                        if(_this.stage.gameMap[i][j].hitTest(e.stageX,e.stageY)){
                            _this.stage.gameMap[i][j].plant.sprite.alpha = 0.8;
                            line = i;
                            plantId = j;
                        }
                    }
                }
            })
            _this.stage.parent.addEventListener("stagemouseup",()=>{
                if(plantId!=-1){
                    _this.stage.removeChild(_this.stage.gameMap[line][plantId].plant.sprite,_this.stage.gameMap[line][plantId].plant.shadow);
                    _this.stage.gameMap[line][plantId].plant.stop();
                   _this.stage.gameMap[line][plantId].hasPlant = false;
                   _this.stage.gameMap[line][plantId].plant = null;
                }
                setTimeout(() => {
                    _this.stage.ClickEnable = true;
                    _this.bitmap.x = x;
                    _this.bitmap.y = y;
                    _this.stage.parent.removeAllEventListeners();
                }, 0);
                
             })
        }
    })
}



function Card(image,plant,plantbitmap,price,CoolingTime){
    this.price = price;
    this.stage = null;
    this.ClickEnable = false;
    this.hasCover = false;
    this.sunEnough = false;
    this.coolComplete = true;
    this.CoolingTime = CoolingTime;
    this.CardBitmap = new createjs.Bitmap(image);
    this.Plant = new plant;
    this.PlantBitmap = new createjs.Bitmap(plantbitmap);
    this.virtual = new createjs.Bitmap(plantbitmap);
    this.virtual.alpha = 0;
    this.cover = new createjs.Shape(); 
    var plantId = -1;
    var line = 0;    
    var hitArea = new createjs.Shape(); 
    hitArea.graphics.beginFill("#000").drawRect(0,0,50,70);
    this.CardBitmap.hitArea = hitArea;
    let _this = this;
    this.check = function(){
        if(!_this.hasCover){
            _this.hasCover = true;
            _this.cover.graphics.beginFill("#000").drawRect(_this.CardBitmap.x,_this.CardBitmap.y,50,70);
            _this.cover.alpha = 0.5;
            _this.stage.addChild(_this.cover);
        }
        if(!_this.sunEnough){
            _this.cover.visible = true;
            _this.ClickEnable = false;
        }else{
            _this.cover.visible = false;
            if(_this.coolComplete) _this.ClickEnable = true;
        }
    }

    this.CardBitmap.addEventListener("click",()=>{
        if(_this.ClickEnable&&_this.stage.ClickEnable){
            _this.ClickEnable = false;
            _this.stage.ClickEnable = false;
            var temp =  new createjs.Shape();  
            temp.graphics.beginFill("#000").drawRect(_this.CardBitmap.x,_this.CardBitmap.y,50,70);
            temp.alpha = 0.4;
            _this.stage.addChild(temp);
            _this.stage.addChild(_this.virtual);
            _this.stage.parent.addEventListener("stagemousemove",(e)=>{
                _this.PlantBitmap.x = e.stageX-_this.Plant.width/2;
                _this.PlantBitmap.y = e.stageY-_this.Plant.height;
                _this.stage.addChild(_this.PlantBitmap);
                _this.plantId = -1;
               for(var i=0;i<_this.stage.gameMap.length;i++){
                   for (let j = 0; j < _this.stage.gameMap[i].length; j++) {
                       if(_this.stage.gameMap[i][j].hasPlant) continue;
                       if(_this.stage.gameMap[i][j].hitTest(e.stageX,e.stageY)){
                               _this.virtual.alpha = 0.5;
                               _this.virtual.x = _this.stage.gameMap[i][j].graphics.command.x;
                               _this.virtual.y = _this.stage.gameMap[i][j].graphics.command.y;
                               line = i;
                               plantId = j;
                       }
                   }
                }
                if(plantId == -1){
                    _this.virtual.alpha = 0;
                }
            })
            _this.stage.parent.addEventListener("stagemouseup",(event)=>{
                if(plantId !=-1){
                    _this.Plant = new plant;
                    _this.Plant.init(_this.stage.gameMap[line][plantId].graphics.command.x,_this.stage.gameMap[line][plantId].graphics.command.y,_this.stage);
                    _this.stage.gameMap[line][plantId].plant = _this.Plant; 
                    _this.stage.gameMap[line][plantId].plant.line = line;
                    _this.stage.gameMap[line][plantId].plant.auto();
                    _this.stage.gameMap[line][plantId].hasPlant = true;
                    _this.stage.addChild(_this.stage.gameMap[line][plantId].plant.shadow,_this.stage.gameMap[line][plantId].plant.sprite);
                    _this.stage.setChildIndex(_this.stage.gameMap[line][plantId].plant.shadow,1);
                    _this.stage.setChildIndex(_this.stage.gameMap[line][plantId].plant.sprite,2);
                    _this.stage.removeChild(_this.virtual,_this.PlantBitmap);
                    _this.stage.sun -= _this.price;
                    _this.Cooling(temp);
                    _this.stage.parent.removeAllEventListeners();
                    _this.stage.ClickEnable = true;
                }
                    if(_this.CardBitmap.hitArea.hitTest(event.stageX-_this.CardBitmap.x,event.stageY-_this.CardBitmap.y)){
                        _this.stage.removeChild(_this.virtual,_this.PlantBitmap);
                        _this.ClickEnable = false;
                        _this.stage.removeChild(temp);
                        _this.stage.parent.removeAllEventListeners();
                        _this.stage.ClickEnable = true;
                    }
                })
        }
    })
    this.Cooling = function(temp){
        _this.ClickEnable = false;
        _this.coolComplete = false;
        createjs.Tween.get(temp).to({scaleY:0,y:_this.CardBitmap.y+1},_this.CoolingTime);
        setTimeout(()=>{
            _this.coolComplete = true;
            _this.ClickEnable = true;
            _this.stage.removeChild(temp);
        },_this.CoolingTime)
    }
}



function SunflowerCard(x,y,stage){
    this.card = Card;
    this.card("image/Cards/SunflowerCard.png",Sunflower,"image/Plants/Sunflower/SunFlower.gif",50,7500);
    this.CardBitmap.x = x;
    this.CardBitmap.y = y;
    this.stage = stage;
}

function PeashooterCard(x,y,stage){
    this.card = Card;
    this.card("image/Cards/PeashooterCard.png",Peashooter,"image/Plants/Peashooter/Peashooter.gif",100,7500);
    this.CardBitmap.x = x;
    this.CardBitmap.y = y;
    this.stage = stage;
}