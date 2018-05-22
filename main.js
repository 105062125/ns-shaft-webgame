var game = new Phaser.Game(600, 600, Phaser.AUTO, 'canvas');
var player;
var keyboard;

var platforms = [];
var highscore = [];
var sortscore = [];
var nameboard = [];
var timeboard = [];

var lastscore ;
var scoreboardcount = 0;
var temp=0;
var temp2;
var count = 0;
var leftWall;
var rightWall;
var leftWalldown;
var rightWalldown;
var ceiling;

var text1;
var text2;
var text3;
var text4;
var distance = 0;
var status = 'running';

var hurtmusic = new Audio("hurt.mp3");
var jumpmusic = new Audio("jump.mp3");
var stonemusic = new Audio("stone.mp3");
var movemusic = new Audio("move.mp3");
var deadmusic = new Audio("dead.mp3");

var checkp=1;

game.MyState = {};
game.MyState.player2state = {
    preload:function () {


        //game.load.baseURL = 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/';
        game.load.crossOrigin = 'anonymous';
        game.load.spritesheet('player2', 'player2.png', 32, 32);
        game.load.spritesheet('player', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/player.png', 32, 32);
        game.load.image('wall', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/wall.png');
        game.load.image('ceiling', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/ceiling.png');
        game.load.image('normal', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/normal.png');
        game.load.image('nails', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/nails.png');
        game.load.spritesheet('conveyorRight', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/conveyor_right.png', 96, 16);
        game.load.spritesheet('conveyorLeft', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/conveyor_left.png', 96, 16);
        game.load.spritesheet('trampoline', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/trampoline.png', 96, 22);
        game.load.spritesheet('fake', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/fake.png', 96, 36);
    },
    create:function () {
        keyboard = game.input.keyboard.addKeys({
            'enter': Phaser.Keyboard.ENTER,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'left': Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT,
            'w': Phaser.Keyboard.W,
            'a': Phaser.Keyboard.A,
            's': Phaser.Keyboard.S,
            'd': Phaser.Keyboard.D,
            't': Phaser.Keyboard.T,
            'q': Phaser.Keyboard.Q,
            'p': Phaser.Keyboard.P
        });
    
        createBounders();
        createPlayer2();
        //createTextsBoard();
    }, 
    update:function () {
       
        if(status == 'gameOver' && keyboard.enter.isDown) restart();
        if(status == 'gameOver' && keyboard.q.isDown) 
        {
            game.state.start('startstate');
        }
        
        if(status != 'running') return;

        this.physics.arcade.collide(player, platforms, effect);
        this.physics.arcade.collide(player, [leftWall, rightWall]);
        this.physics.arcade.collide(player, [leftWalldown, rightWalldown]);

        this.physics.arcade.collide(player2, platforms, effect);
        this.physics.arcade.collide(player2, [leftWall, rightWall]);
        this.physics.arcade.collide(player2, [leftWalldown, rightWalldown]);

        this.physics.arcade.collide(player2, player);
//到這
        checkTouchCeiling(player);
        checkTouchCeiling(player2);
        checkGameOver2();

        updatePlayer();
        updatePlayer2();
        updatePlatforms();
        //updateTextsBoard();

        createPlatforms();
    
        
        
    }
    
};
function createPlayer2() {
    player = game.add.sprite(200, 50, 'player');
    player.direction = 10;
    game.physics.arcade.enable(player);
    player.body.gravity.y = 500;  // original500
    player.animations.add('left', [0, 1, 2, 3], 8);
    player.animations.add('right', [9, 10, 11, 12], 8);
    player.animations.add('flyleft', [18, 19, 20, 21], 12);
    player.animations.add('flyright', [27, 28, 29, 30], 12);
    player.animations.add('fly', [36, 37, 38, 39], 12);
    player.life = 10000;
    player.unbeatableTime = 0;
    player.touchOn = undefined;

    player2 = game.add.sprite(220, 50, 'player2');
    player2.direction = 10;
    game.physics.arcade.enable(player2);
    player2.body.gravity.y = 500;  // original500
    player2.animations.add('left', [0, 1, 2, 3], 8);
    player2.animations.add('right', [9, 10, 11, 12], 8);
    player2.animations.add('flyleft', [18, 19, 20, 21], 12);
    player2.animations.add('flyright', [27, 28, 29, 30], 12);
    player2.animations.add('fly', [36, 37, 38, 39], 12);
    player2.life = 10000;
    player2.unbeatableTime = 0;
    player2.touchOn = undefined;
}
function checkGameOver2 () {
    if(player.body.y > 600 || player2.body.y > 600 ) {
        deadmusic.play();
        gameOver2();
    }
}
function updatePlayer2 () {
    if(keyboard.a.isDown) {
        player2.body.velocity.x = -250;
    } else if(keyboard.d.isDown) {
        player2.body.velocity.x = 250;
    } else {
        player2.body.velocity.x = 0;
    }
    setPlayerAnimate(player2);
}
function gameOver2 () {

    platforms.forEach(function(s) {s.destroy()});
    platforms = [];
    status = 'gameOver';
    game.state.start('gameoverplayer2state'); 
}
//------------------------------------------------------------------以下main 1p
game.MyState.mainstate = {
    preload:function () {

        /*var loadingLabel = game.add.text(game.width/2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        var progressBar = game.add.sprite(game.width/2, 200, 'progressBar'); 
        progressBar.anchor.setTo(0.5, 0.5); 
        game.load.setPreloadSprite(progressBar);*/

        //game.load.baseURL = 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/';
        game.load.crossOrigin = 'anonymous';
        game.load.spritesheet('player', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/player.png', 32, 32);
        game.load.image('wall', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/wall.png');
        game.load.image('ceiling', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/ceiling.png');
        game.load.image('normal', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/normal.png');
        game.load.image('nails', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/nails.png');
        game.load.spritesheet('conveyorRight', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/conveyor_right.png', 96, 16);
        game.load.spritesheet('conveyorLeft', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/conveyor_left.png', 96, 16);
        game.load.spritesheet('trampoline', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/trampoline.png', 96, 22);
        game.load.spritesheet('fake', 'https://wacamoto.github.io/NS-Shaft-Tutorial/assets/fake.png', 96, 36);
    },
    create:function () {
        keyboard = game.input.keyboard.addKeys({
            'enter': Phaser.Keyboard.ENTER,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'left': Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT,
            'w': Phaser.Keyboard.W,
            'a': Phaser.Keyboard.A,
            's': Phaser.Keyboard.S,
            'd': Phaser.Keyboard.D,
            't': Phaser.Keyboard.T,
            'q': Phaser.Keyboard.Q,
            'p': Phaser.Keyboard.P
        });
    
        createBounders();
        createPlayer();
        createTextsBoard();
    }, 
    update:function () {
       
        if(status == 'gameOver' && keyboard.enter.isDown) restart();
        if(status == 'gameOver' && keyboard.q.isDown) 
        {
            game.state.start('startstate');
        }
        
        if(status != 'running') return;

        this.physics.arcade.collide(player, platforms, effect);
        this.physics.arcade.collide(player, [leftWall, rightWall]);
        this.physics.arcade.collide(player, [leftWalldown, rightWalldown]);
        checkTouchCeiling(player);
        checkGameOver();

        updatePlayer();
        updatePlatforms();
        updateTextsBoard();

        createPlatforms();
    
        
        
    }
    
};



function createBounders () {
    leftWall = game.add.sprite(0, 0, 'wall');
    game.physics.arcade.enable(leftWall);
    leftWall.body.immovable = true;

    rightWall = game.add.sprite(583, 0, 'wall');  //383
    game.physics.arcade.enable(rightWall);
    rightWall.body.immovable = true;

    leftWalldown = game.add.sprite(0, 400, 'wall');
    game.physics.arcade.enable(leftWalldown);
    leftWalldown.body.immovable = true;

    rightWalldown = game.add.sprite(583, 400, 'wall');  //383
    game.physics.arcade.enable(rightWalldown);
    rightWalldown.body.immovable = true;

    ceiling = game.add.image(0, 0, 'ceiling');
    ceiling = game.add.image(200, 0, 'ceiling');
}

var lastTime = 0;
function createPlatforms () {
    if(game.time.now > lastTime + 600) {
        lastTime = game.time.now;
        createOnePlatform();
        distance += 1;
    }
}

function createOnePlatform () {

    var platform;
    var x = Math.random()*(600 - 96 - 40) + 20;  // 400->600
    var y = 600; // 400->600
    var rand = Math.random() * 100;

    if(rand < 20) {
        platform = game.add.sprite(x, y, 'normal');
    } else if (rand < 40) {
        platform = game.add.sprite(x, y, 'nails');
        game.physics.arcade.enable(platform);
        platform.body.setSize(96, 15, 0, 15);
    } else if (rand < 50) {
        platform = game.add.sprite(x, y, 'conveyorLeft');
        platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
        platform.play('scroll');
    } else if (rand < 60) {
        platform = game.add.sprite(x, y, 'conveyorRight');
        platform.animations.add('scroll', [0, 1, 2, 3], 16, true);
        platform.play('scroll');
    } else if (rand < 80) {
        platform = game.add.sprite(x, y, 'trampoline');
        platform.animations.add('jump', [4, 5, 4, 3, 2, 1, 0, 1, 2, 3], 120);
        platform.frame = 3;
    } else {
        platform = game.add.sprite(x, y, 'fake');
        platform.animations.add('turn', [0, 1, 2, 3, 4, 5, 0], 14);
    }

    game.physics.arcade.enable(platform);
    platform.body.immovable = true;
    platforms.push(platform);

    platform.body.checkCollision.down = false;
    platform.body.checkCollision.left = false;
    platform.body.checkCollision.right = false;
}

function createPlayer() {
    player = game.add.sprite(200, 50, 'player');
    player.direction = 10;
    game.physics.arcade.enable(player);
    player.body.gravity.y = 500;  // original500
    player.animations.add('left', [0, 1, 2, 3], 8);
    player.animations.add('right', [9, 10, 11, 12], 8);
    player.animations.add('flyleft', [18, 19, 20, 21], 12);
    player.animations.add('flyright', [27, 28, 29, 30], 12);
    player.animations.add('fly', [36, 37, 38, 39], 12);
    player.life = 100;
    player.unbeatableTime = 0;
    player.touchOn = undefined;
}

function createTextsBoard () {
    var style = {fill: '#ff0000', fontSize: '20px'}
    text1 = game.add.text(20, 10, '', style);
    text2 = game.add.text(550, 10, '', style);// original + 200 ;
    //text3 = game.add.text(200, 300, 'Press Enter to Play Again', style);   // original 140,200 ;
    //text3.visible = false;
    //text4 = game.add.text(200, 320, 'Press Q to Quit', style);   // original 140,200 ;
    text4.visible = false;
}

function updatePlayer () {
    if(keyboard.left.isDown) {
        player.body.velocity.x = -250;
    } else if(keyboard.right.isDown) {
        player.body.velocity.x = 250;
    } else {
        player.body.velocity.x = 0;
    }
    setPlayerAnimate(player);
}

function setPlayerAnimate(player) {
    var x = player.body.velocity.x;
    var y = player.body.velocity.y;

    if (x < 0 && y > 0) {
        player.animations.play('flyleft');
    }
    if (x > 0 && y > 0) {
        player.animations.play('flyright');
    }
    if (x < 0 && y == 0) {
        player.animations.play('left');
    }
    if (x > 0 && y == 0) {
        player.animations.play('right');
    }
    if (x == 0 && y != 0) {
        player.animations.play('fly');
    }
    if (x == 0 && y == 0) {
      player.frame = 8;
    }
}

function updatePlatforms () {
    for(var i=0; i<platforms.length; i++) {
        var platform = platforms[i];
        platform.body.position.y -= 2;
        if(platform.body.position.y <= -20) {
            platform.destroy();
            platforms.splice(i, 1);
        }
    }
}

function updateTextsBoard () {
    text1.setText('life:' + player.life);
    text2.setText('B' + distance);
}

function effect(player, platform) {
    if(platform.key == 'conveyorRight') {
        conveyorRightEffect(player, platform);
    }
    if(platform.key == 'conveyorLeft') {
        conveyorLeftEffect(player, platform);
    }
    if(platform.key == 'trampoline') {
        trampolineEffect(player, platform);
    }
    if(platform.key == 'nails') {
        nailsEffect(player, platform);
    }
    if(platform.key == 'normal') {
        basicEffect(player, platform);
    }
    if(platform.key == 'fake') {
        fakeEffect(player, platform);
    }
}

function conveyorRightEffect(player, platform) {
    movemusic.play();
    player.body.x += 2;
}

function conveyorLeftEffect(player, platform) {
    movemusic.play();
    player.body.x -= 2;
}

function trampolineEffect(player, platform) {
    platform.animations.play('jump');
    jumpmusic.play();
    player.body.velocity.y = -350;
}

function nailsEffect(player, platform) {
    if (player.touchOn !== platform) {
        hurtmusic.play();
        player.life -= 3;
        player.touchOn = platform;
        game.camera.flash(0xff0000, 100);
    }
}

function basicEffect(player, platform) {
    if (player.touchOn !== platform) {
        if(player.life < 10) {
            player.life += 1;
        }
        player.touchOn = platform;
    }
}

function fakeEffect(player, platform) {
    if(player.touchOn !== platform) {
        platform.animations.play('turn');
        stonemusic.play();
        setTimeout(function() {
            platform.body.checkCollision.up = false;
        }, 100);
        player.touchOn = platform;
    }
}

function checkTouchCeiling(player) {
    if(player.body.y < 0) {
        if(player.body.velocity.y < 0) {
            player.body.velocity.y = 0;
        }
        if(game.time.now > player.unbeatableTime) {
            hurtmusic.play();
            player.life -= 3;
            game.camera.flash(0xff0000, 100);
            player.unbeatableTime = game.time.now + 2000;
        }
    }
}

function checkGameOver () {
    if(player.life <= 0 || player.body.y > 600) {
        deadmusic.play();
        gameOver();
    }
}

function gameOver () {
    //text3.visible = true;
    //text4.visible = true;
    platforms.forEach(function(s) {s.destroy()});
    platforms = [];
    status = 'gameOver';
    writedata();
    game.state.start('gameoverstate'); 
}

function restart () {
    //text3.visible = false;
    //text4.visible = false;
    distance = 0;
    createPlayer();
    status = 'running';
}

var database = firebase.database().ref();
function writedata(){
    var user = firebase.auth().currentUser;
    var date = new Date();
    var username;
      var M = date.getMonth()+1;
      var d = date.getDate();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      if(M<10){
        M = '0'+M;
      }
      if(d<10){
        d = '0'+d;
      }
      if(h<10){
        h = '0'+h;
      }
      if(m<10){
        m = '0' + m;
      }
      if(s<10){
        s = '0' + s;
      }
      var now = M+'/'+d+'-'+h+':'+m+':'+s;

    if(distance > lastscore)
    {
        if(user.displayName == null)
        {
            username = prompt("遊戲名字", "");
            
            if(username)
            {
                user.updateProfile({
                    displayName:username,
                });
                var postData = {
                    name:username,
                    score: distance,
                    time: now
                };
                firebase.database().ref().push(postData);
            }
        }
        else
        {
            var postData = {
                name:user.displayName,
                score: distance,
                time: now
            };
            firebase.database().ref().push(postData);
        }
        var $show = $('#show');
        $show.html('');
        firebase.database().ref().once('value', function(snapshot) {
            count = 0;
            scoreboardcount = 0
        for(var i in snapshot.val()){
            highscore[count] = snapshot.val()[i].score;
            timeboard[count] = snapshot.val()[i].time;
            nameboard[count++] = snapshot.val()[i].name;
            scoreboardcount = scoreboardcount + 1 ;
        }
        bubble();
        lastscore = highscore[scoreboardcount-1]
        console.log(lastscore);
        ranking();
        });
    }
    

    
}

/// -----------------------------------------------------------------------------///以上main

game.MyState.startstate = {
    preload:function () {
        game.load.image('startani', 'startback1.jpg');
    },
    create:function () {
        keyboard = game.input.keyboard.addKeys({
            'enter': Phaser.Keyboard.ENTER,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'w': Phaser.Keyboard.W,
            't':Phaser.Keyboard.T
        });
        startani = game.add.sprite(0, 0, 'startani');
        createstarttext();
    }, 
    update:function () {
        checktrans();
    }
    
};

function checktrans (){
    if(keyboard.enter.isDown)
    {
        game.state.start('mainstate'); 
        distance = 0;
        createPlayer();
        status = 'running'
    }
    if(keyboard.w.isDown)
    {
        game.state.start('mainstate'); 
        distance = 100;
        createPlayer();
        status = 'running'
    }
    if(keyboard.t.isDown)
    {
        game.state.start('player2state'); 
        distance = 0;
        createPlayer();
        createPlayer2();
        status = 'running'
    }
}

function createstarttext(){
    var overtext1style = {fill: '#ffffff', fontSize: '70px'}
    var overtext2style = {fill: '#ffffff', fontSize: '20px'}
    var overtext1 = game.add.text(130, 50, 'S T A I R S', overtext1style);   // original 140,200 ;
    var overtext2 = game.add.text(220, 300, 'Enter : One player', overtext2style);   // original 140,200 ;
    var overtext3 = game.add.text(220, 360, 'T        : Two player', overtext2style);   // original 140,200 ;
}
///----------------------------------------------------------------///以下是game over
game.MyState.gameoverstate = {
    preload:function () {
        game.load.image('over', 'gameover.jpg');
    },
    create:function () {
        keyboard = game.input.keyboard.addKeys({
            'enter': Phaser.Keyboard.ENTER,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'w': Phaser.Keyboard.W,
            'q': Phaser.Keyboard.Q
        });
        over = game.add.sprite(0, 0, 'over');
        createovertext();
    }, 
    update:function () {
        checkoverway();
    }
};

function checkoverway(){
    if(keyboard.enter.isDown)
    {
        game.state.start('mainstate');
        distance = 0;
        createPlayer();
        status = 'running'
    }
    if(keyboard.q.isDown)
    {
        game.state.start('startstate'); 
    }
}

function createovertext(){
    var overstyle = {fill: '#ffffff', fontSize: '30px'}
    var overtext1 = game.add.text(130, 480, 'Press Enter to Play Again', overstyle);   // original 140,200 ;
    var overtext2 = game.add.text(130, 520, 'Press Q to Quit', overstyle);   // original 140,200 ;
}

game.MyState.gameoverplayer2state = {
    preload:function () {
        game.load.image('over', 'gameover.jpg');
    },
    create:function () {
        keyboard = game.input.keyboard.addKeys({
            'enter': Phaser.Keyboard.ENTER,
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'w': Phaser.Keyboard.W,
            'q': Phaser.Keyboard.Q
        });
        over = game.add.sprite(0, 0, 'over');
        createovertext();
    }, 
    update:function () {
        checkoverway2();
    }
};
function checkoverway2(){
    if(keyboard.enter.isDown)
    {
        game.state.start('player2state');
        distance = 0;
        createPlayer2();
        status = 'running'
    }
    if(keyboard.q.isDown)
    {
        game.state.start('startstate'); 
    }
}







game.state.add('gameoverplayer2state', game.MyState.gameoverplayer2state);
game.state.add('gameoverstate', game.MyState.gameoverstate);
game.state.add('mainstate', game.MyState.mainstate); 
game.state.add('startstate',game.MyState.startstate);
game.state.add('player2state',game.MyState.player2state);

game.state.start('startstate'); 

$(function(){
    
    var $show = $('#show');
    firebase.database().ref().once('value', function(snapshot) {
        count = 0;
        scoreboardcount = 0
      for(var i in snapshot.val()){
         highscore[count] = snapshot.val()[i].score;
         timeboard[count] = snapshot.val()[i].time;
         nameboard[count++] = snapshot.val()[i].name;
         scoreboardcount = scoreboardcount + 1 ;
      }
      bubble();
      lastscore = highscore[scoreboardcount-1]
      console.log(lastscore);
      ranking();
    });

    /*firebase.database().ref().once('value', function(snapshot) {
        $show.html('');
        for(var i in snapshot.val()){
           $show.append('<div><div class="name">'+snapshot.val()[i].name+'</div><div class="score">'+snapshot.val()[i].score+' </div><div class="time">'+snapshot.val()[i].time+'</div>');
           highscore[i] = snapshot.val()[i].score;
           scoreboardcount = scoreboardcount + 1 ;
           console.log(highscore[i]);
        }
        $show.scrollTop($show[0].scrollHeight);
        console.log(scoreboardcount);
      });*/

    /*firebase.database().ref().limitToLast(1).on('value', function(snapshot) {
        for(var i in snapshot.val()){
            $show.append('<div><div class="name">'+snapshot.val()[i].name+'</div><div class="score">'+snapshot.val()[i].score+' </div><div class="time">'+snapshot.val()[i].time+'</div>');
        }
        $show.scrollTop($show[0].scrollHeight);

      });*/

  });
  

  //大排到小
  function bubble (){
      for(var j=scoreboardcount-1;j>=1;j--)
      {
          for(var i = 0;i<scoreboardcount-1;i++)
          {
             if(highscore[i] < highscore[i+1])
             {
                temp = highscore[i];
                highscore[i] = highscore[i+1];
                highscore[i+1] = temp;

                temp2 = nameboard[i];
                nameboard[i] = nameboard[i+1];
                nameboard[i+1] = temp2;

                temp2 = timeboard[i];
                timeboard[i] = timeboard[i+1];
                timeboard[i+1] = temp2;
             }
          }
      }
      /*console.log(highscore[0]);
      console.log(highscore[1]);
      console.log(highscore[2]);
      console.log(highscore[3]);
      console.log(highscore[4]);

      console.log(nameboard[0]);
      console.log(nameboard[1]);
      console.log(nameboard[2]);
      console.log(nameboard[3]);
      console.log(nameboard[4]);*/
  }


  function ranking(){
    var $show = $('#show');
    $show.append('<div><div class="rank">'+'遊戲排行榜'+'</div>');
    $show.append('<div><div class="rankno">'+'---------------------------------------------------------------------------------------------------------------------------------------------'+'</div>');
    $show.append('<div><div class="rank2">'+'2'+'</div>');
    $show.append('<div><div class="rank3">'+'3'+'</div>');
    $show.append('<div><div class="rank4">'+'4'+'</div>');
    $show.append('<div><div class="rank5">'+'5'+'</div>');
    for(var i=0 ;i<5;i++){
        if(i<4)
        {
            $show.append('<div><div class="name">'+'遊戲名稱 :'+nameboard[i]+'</div><div class="score">'+'抵達層數 :'+highscore[i]+' </div><div class="time">'+'遊玩時間 :'+timeboard[i]+' </div><div class="no">'+'--------------------------------'+'</div>');
        }
        else
        $show.append('<div><div class="name">'+'遊戲名稱 :'+nameboard[i]+'</div><div class="score">'+'抵達層數 :'+highscore[i]+' </div><div class="time">'+'遊玩時間 :'+timeboard[i]+'</div>');
    }
    $show.append('<div><div class="rankno">'+'---------------------------------------------------------------------------------------------------------------------------------------------'+'</div>');
    $show.scrollTop($show[0].scrollHeight);
  }