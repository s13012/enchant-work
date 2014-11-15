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
  x: (gs.width - 32) / 2,
  y: gs.height - 32 - 16,
  frame: [5, 6, 5, 7],
  damage: false,
  damageTime: 0,
  path: './assets/chara1.png'
}

gs.assets.map = {
  height: 16,
  width: 16,
  backgroundColor: "darkgray",
  path: './assets/map0.png'
}

gs.assets.apple = {
  height: 16,
  width: 16,
  y: -16,
  frame: 15,
  path: './assets/icon0.png'
}

gs.assets.effect = {
  height: 16,
  width: 16,
  time: 0,
  frame: 0,
  duration: 20,
  path: './assets/effect0.png'
}

gs.assets.time = {
  x: 0,
  y: 0,
  type: "countdown",
  time: 10
}

window.onload = function() {
  var bear, timerLabel, game = new Core(gs.width, gs.height);
  game.fps = gs.fps; 
  game.score = 0;
  game.preload(
      gs.assets.bear.path,
      gs.assets.map.path,
      gs.assets.apple.path,
      gs.assets.effect.path
      );

  var eMap = Class.create(Map,{
    initialize:function() {
      var asset = gs.assets.map;
      Map.call(this,asset.width,asset.height);
      this.backgroundColor = asset.backgroundColor;
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

  var TimerLabel = Class.create(TimeLabel,{
    initialize:function(){
      var asset = gs.assets.time;
      TimeLabel.call(this, asset.x, asset.y, asset.type);
      this.time = asset.time;
    }
  });

  var Bear = Class.create(Sprite,{
    initialize:function(){
      var asset = gs.assets.bear;
      Sprite.call(this,asset.width,asset.height);
      this.image = game.assets[asset.path];
      this.x = asset.x;
      this.y = asset.y;
      this.frame = asset.frame;
      this.damage = asset.damage;
      this.damageTime = asset.damageTime;
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
        this.frame = [5,6,5,7];
      }
    }
  });

  var Apple = Class.create(Sprite,{
    initialize:function(){
      var asset = gs.assets.apple;
      Sprite.call(this, asset.width, asset.height);
      this.image = game.assets[asset.path]; 
      this.x = Math.floor(Math.random() * 300);
      this.y = asset.y;
      this.frame = asset.frame;
      this.speed = 3 + Math.floor(Math.random() * 6);
    },
    onenterframe:function(){
      this.y += this.speed;

      if(bear.within(this, 16)){
        new Blast(this.x, this.y);
        this.remove();
        bear.damage = true;
      } else if (this.y > 286) {
        new Blast(this.x,this.y);
        this.remove();
      }
    },
    ontouchstart:function(){
      game.score++;
      new Blast(this.x, this.y);
      this.remove();
    }
  });

  var CreateApple = Class.create({
    initialize:function(){
      this.CreateApples();
    },
    CreateApples:function(){
      game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
        if (game.frame > 0) {
          if ((game.frame % 10) === 0) {
            game.rootScene.addChild(new Apple());
          }
        }

        if (timerLabel.time < 0) {
          alert("SCORE:" + game.score);
          game.end();
        }
      });
    }
  });

  //爆発エフェクト
  var Blast = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
      var asset = gs.assets.effect;
      enchant.Sprite.call(this, asset.width, asset.height);
      this.x = x;
      this.y = y;
      this.image = game.assets[asset.path];
      this.time = asset.time;
      this.duration = asset.duration;
      this.frame = asset.frame;
      game.rootScene.addChild(this);
    },
    remove: function(){
      game.rootScene.removeChild(this);
    },
    onenterframe:function(){
      this.time++;
      this.frame = Math.floor(this.time / this.duration * 5);

      if(this.time === this.duration){
        this.remove();
      }
    }
  }); 

  game.onload = function() {
    //背景
    game.rootScene.addChild(new eMap());
    //残り時間
    timerLabel = new TimerLabel();
    game.rootScene.addChild(timerLabel);
    //クマ
    bear = new Bear();
    game.rootScene.addChild(bear);
    //リンゴ
    new CreateApple();
  };
  game.start();
};
