enchant();
gsettings = {
	width:320,
	height:320,
};

window.onload = function() {

    game = new Core(gsettings.width, gsettings.height);
    game.fps = 16;
	game.score = 0;
    var label;
    var bear;
    game.preload('chara1.png',
        'map0.png',
        'icon0.png',
        'effect0.png');

    game.onload = function() {
        //背景
        var bg = new Sprite(gsettings.width, gsettings.height);
        bg.backgroundColor = "darkgray";
		
        var maptip = game.assets['map0.png'];//床
        var image = new Surface(gsettings.width, gsettings.height);
        for (var i = 0; i < 320; i += 16) {
            image.draw(maptip, 3 * 16, 0, 16, 16, i, 320 - 16, 16, 16);
        }
        bg.image = image;
        game.rootScene.addChild(bg);
   
        //ラベル
        label = new Label("");
        game.rootScene.addChild(label);

        //クマの生成
        bear = new Sprite(32, 32);
        bear.image  = game.assets['chara1.png'];
        bear.x      = 160 - 16;
        bear.y      = 320 - 16 - 32;
        bear.anim   = [5, 6, 5, 7];
        bear.frame  = 10;
        bear.vy = 0;
        bear.jumping = false;
        bear.damage = false;
        bear.damageTime = 0;

        game.rootScene.addChild(bear);
        
        //クマの定期処理
        bear.tick = 0;
        bear.addEventListener(Event.ENTER_FRAME, function() {

            label.text = "残り時間:" + Math.floor(game.tick / 16)  ;
            
            if (bear.damage === false) {
                bear.tick++;
                bear.frame = bear.anim[bear.tick % 4];
                if (bear.scaleX == 1) {
                    bear.x += 3;
                    if (bear.x > 320 - 32) bear.scaleX = -1;
                } 
                else {
                    bear.x -= 3;
                    //向き変更
                    if (bear.x < 0) bear.scaleX = 1;
                }

                //ジャンプの処理 
                bear.ontouchstart = function() {
                    if (this.jumping === false) {
                        this.vy = -7;
                        this.jumping = true;
                    }
                };
            } else {
                bear.frame = 8;
                bear.damageTime++;
                if (bear.damageTime > 30) {
                    bear.damage = false;
                    bear.damageTime = 0;
                }
            }
                
			this.vy += 0.5;
			this.y += this.vy;
			
			if(this.y >= 272 ) {
				this.y = 272;
				this.jumping = false;
			}            
        });
    };
    
    game.addApple = function(x, speed) {
        //リンゴの生成
        var apple = new Sprite(16, 16);
        apple.image = game.assets['icon0.png'];
        apple.x = x;
        apple.y = -16;
        apple.frame = 15;
        apple.speed = speed;
        game.rootScene.addChild(apple);
        
        apple.addEventListener(Event.ENTER_FRAME, function() {
            apple.y += apple.speed;

            if (bear.within(apple, 16)) {
                blast = new Blast(apple.x, apple.y);
                this.remove(); 
                
                
                bear.damage = true;
            } 

            else if (apple.y > 286) {
                blast = new Blast(apple.x, apple.y);
                this.remove(); 
            }
        });
        // リンゴにタッチ
        apple.ontouchstart = function() {
			game.score++;
            var blast = new Blast(apple.x, apple.y);
            this.remove();
        };
    };
    

    game.tick = 16 * 15;
    game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
        game.tick--;
        if (game.tick > 0) {
            if ((game.tick % 10) === 0) {
                var x     = Math.floor(Math.random() * 300);
                var speed = 3 + Math.floor(Math.random() * 6);
                game.addApple(x,speed);
            }
        }
		if(game.tick ==0){
			alert("SCORE:" + game.score);
		}
    });
    
    //爆発エフェクト
    var Blast = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y){
            enchant.Sprite.call(this);
            this.x = x;
            this.y = y;
            this.image = game.assets['effect0.png'];
            this.width = 16;    
            this.height = 16;    
            this.dead = false;    
            this.time = 0;
            this.duration = 20;
            this.frame = 0;
           
            this.addEventListener('enterframe', function(){
                this.time++;
                this.frame = Math.floor(this.time/this.duration *5);
                if(this.time == this.duration)this.remove();
            });
            game.rootScene.addChild(this);
        },
        remove: function(){
            game.rootScene.removeChild(this);
        }
    });    

    //クマのダメージの処理
    var Damage = enchant.Class.create(enchant.Sprite, {
        initialize: function(x, y){
            enchant.Sprite.call(this);
            this.x = x;
            this.y = y;
            this.image = game.assets['effect0.png'];
            this.time = 0;
            this.duration = 20;
            this.frame = 0;
           
            this.addEventListener('enterframe', function(){
                this.time++;
                this.frame = Math.floor(this.time/this.duration *5);
                if(this.time == this.duration)this.remove();
            });
            game.rootScene.addChild(this);
        }
    });    
    game.start();
};
function rand(num){
    return Math.floor(Math.random() * num);
}
