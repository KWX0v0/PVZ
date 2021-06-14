function PeaBullet(x,y,stage,line){
    this.bitmap = new createjs.Bitmap("image/Bullet/PeaBullet.png");
    this.bitmap.x = x;
    this.bitmap.y = y;
    this.stage = stage;
    this.stage.addChild(this.bitmap);
    let _this = this;
    var isHit = false;
    var target = -1;
    this.timer = setInterval(() => {
        _this.bitmap.x+=10;
        for(var i=0;i<_this.stage.ZombieList.length;i++){
            if(_this.stage.ZombieList[i].line!=line) continue;
            if(_this.bitmap.x>=_this.stage.ZombieList[i].sprite.x+_this.stage.ZombieList[i].hitX){
                isHit = true;
                target = i;
            }
        }
        if(isHit){
            isHit = false;
            _this.stage.ZombieList[target].life -= 20;
            _this.stage.removeChild(_this.bitmap);
            clearInterval(_this.timer);
        }
        else if(_this.bitmap.x>=720){
            _this.stage.removeChild(_this.bitmap);
            clearInterval(_this.timer);
        }
    }, 50);
}