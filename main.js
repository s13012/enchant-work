'use strict';

enchant();

var gs = {
  width:320,
  height:320,
  fps:16,
  assets: {}
};

gs.assets.bear = {
  height: 32,
  width: 32,
  path: './assets/chara1.png'
}

gs.assets.map = {
  height: 16,
  width: 16,
  path: './assets/map0.png'
}

gs.assets.apple = {
  heigh: 16,
  width: 16,
  path: './assets/icon0.png'
}

gs.assets.effect = {
  heigh: 16,
  width: 16,
  path: './assets/effect0.png'
}

window.onload = function() {
  var game = new Core(gs.width, gs.height);
  game.fps = gs.fps; 
  game.score = 0;

  game.preload(
    gs.assets.bear.path,
    gs.assets.map.path,
    gs.assets.apple.path,
    gs.assets.effect.path
  );

  var label, bear;

  var eMap = Class.create(Map,{
      initialize:function() {
        var asset = gs.assets.map;
        Map.call(this,asset.width,asset.height);
        this.backgroundColor = "darkgray";
        this.image = game.assets[asset.path];
        this.loadData(this.makeMapData(20,20,3));
      },
      makeMapData:function(rownum, colnum, value){
        var rows = [];

        for (var row = 0; row < rownum; row++){
          if (row === rownum - 1) {
            rows.push(line(colnum,-1));
          } else {
            rows.push(line(colnum,value));
          }
        }
        return rows;

        function line(colnum, value){
          var cols = [];
          for (var col = 0; col < colnum; col++){
            cols.push(value);
          }
          return cols;
        }
      }
  });

  var BackGround = Class.create(Sprite,{
      initialize:function(){
        Sprite.call(this, gs.width, gs.height);
        this.backgroundColor = "darkgray";
        this.maptip = game.assets[gs.assets.map.path];
        this.image = new Surface(gs.width, gs.height);
        this.imageDraw();
      },
      imageDraw:function(){
        for (var i = 0; i < 320; i += 16) {
          this.image.draw(this.maptip, 3 * 16, 0, 16, 16, i, 320 - 16, 16, 16);
        }
      }
  });

  var TimerLabel = Class.create(Label,{
      initialize:function(){
        Label.call(this);
        this.text = this.prefix = "残り時間:";
      },
      display:function(){
        this.text =
        "残り時間:" + Math.floor(game.frame / gs.fps);
      },
      onenterframe:function(){
        this.display();
      }
  });


  var Bear = Class.create(Sprite,{
      initialize:function(){
        var asset = gs.assets.bear;
        Sprite.call(this,asset.width,asset.height);
        this.image = game.assets[asset.path];
        this.x = (gs.width - this.width) / 2;
        this.y = gs.height - this.height - 16;
        this.frame = [5,6,5,7];
        this.damage = false;
        this.damageTime = 0;
      },
      onenterframe:function(){
        if(this.damage === false){
          this.move();
        } else {
          this.hurted();
        }
      },
      move:function(){
        var speed = 3;
        if (!this.isRange()){
          this.turn();
        }
        this.x += speed * this.scaleX;
      },
      isRange:function(){
        return ((this.x > 0) 
          && (this.x < game.width - this.width)
        );
      },
      turn:function(){
        this.scaleX *= -1;
      },
      hurted:function(){
        this.frame = 8;
        if (this.damageTime++ > 30) {
          this.damage = false;
          this.damageTime = 0;
        }
      }
  });

  var Apple = Class.create(Sprite,{
    initialize:function(){
      var asset = gs.assets.apple;
      Sprite.call(this, asset.width, asset.height);
      this.image = game.assets[asset.path]; 
      this.x = Math.floor(Math.random() * 300);
      this.y = -16;
      this.frame = 15;
      this.speed = 3 + Math.floor(Math.random() * 6);
    },
    onenterframe:function(){
      this.y += this.speed;

      if(bear.within(this, 16)){
        this.remove();
      }
    },
    ontouchstart:function(){
      
    }
  });

  game.onload = function() {
    //背景
//    game.rootScene.addChild(new eMap());
    game.rootScene.addChild(new eMap());
    game.rootScene.addChild(new TimerLabel());
    bear = new Bear();
    game.rootScene.addChild(bear);
    game.rootScene.addChild(new Apple());

  };
  /*
   game.addApple = function(x, speed) {
     //リンゴの生成
         apple.addEventListener(Event.ENTER_FRAME, function() {
         apple.y += apple.speed;

         if (bear.within(apple, 16)) {
           blast = new Blast(apple.x, apple.y);
           this.remove(); 


           bear.damage = true;
         } 

         else if (apple.y > 286) {
           var blast = new Blast(apple.x, apple.y);
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
   */
  /*
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
   */
   //爆発エフェクト
   /*
   var Blast = enchant.Class.create(enchant.Sprite, {
       initialize: function(x, y){
         enchant.Sprite.call(this);
         this.x = x;
         this.y = y;
         this.image = game.assets[gs.assets.effect.path];
         this.width = 16;    
         this.height = 16;    
         this.dead = false;    
         this.time = 0;
         this.duration = 20;
         this.frame = 0;

         this.addEventListener('enterframe', function(){
             this.time++;
             this.frame = Math.floor(this.time/this.duration *5);
             if(this.time == this.duration){
               this.remove();
             }
         });
         game.rootScene.addChild(this);
       },
       remove: function(){
         game.rootScene.removeChild(this);
       }
   }); 
   */
  /*
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
   */
  game.start();
};
