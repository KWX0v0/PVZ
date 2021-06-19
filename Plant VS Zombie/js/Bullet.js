function PeaBullet(x,y,stage,line){
    this.bitmap = new createjs.Bitmap("image/Bullet/PeaBullet.png");
    this.bitmap.x = x;
    this.bitmap.y = y;
    this.stage = stage;
    var isHit = false;
    var target = -1;
    this.timer = setInterval(() => {
        this.bitmap.x+=3;
        for(var i=0;i<this.stage.ZombieList.length;i++){
            if(this.stage.ZombieList[i].line!=line||!this.stage.ZombieList[i].isLive) continue;
            if(this.bitmap.x>=this.stage.ZombieList[i].sprite.x+this.stage.ZombieList[i].hitX){
                isHit = true;
                target = i;
            }
        }
        if(isHit){
            isHit = false;
            this.stage.ZombieList[target].sprite.alpha = 0.85;
            setTimeout(() => {
                if(this.stage.ZombieList[target]) this.stage.ZombieList[target].sprite.alpha = 1; 
            }, 300);
            this.stage.ZombieList[target].life -= 20;
            this.stage.containers[line+1].removeChild(this.bitmap);
            clearInterval(this.timer);
        }
        else if(this.bitmap.x>=770){
            this.stage.containers[line+1].removeChild(this.bitmap);
            clearInterval(this.timer);
        }
    }, 10);
}