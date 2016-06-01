var PlayLayer = cc.LayerColor.extend({
	imageSprite: null,
	btnMenu: null,
	passNo: null,
	ctor: function(passNo){
		this._super(cc.color(1, 134, 219, 255));
		this.passNo = passNo;
		this.init(passNo);
	},
	init: function(passNo){
		var windowSize = cc.winSize;
		var centerPos = {x: windowSize.width/2, y: windowSize.height/2};
		
		this.imageSprite = new cc.Sprite(PASS[passNo-1].res.bg);
		this.imageSprite.setAnchorPoint(0, 1);
		this.imageSprite.setPosition(0, windowSize.height);

		var stepBtn = new Button({text: "第"+ passNo.convertToCH() +"关", fontSize: 28, lineWidth: 0.5, fontFamily: "Microsoft YaHei", x: 20, y: 0}, "#stepLabel.png", null, this.onBack, this);
		var stepBtnSize = stepBtn.getContentSize();
		stepBtn.setPosition(30 + stepBtnSize.width/2, windowSize.height - stepBtnSize.height/2 - 31);

		var menuItem2 = new cc.MenuItemImage("#music"+ musicState +"Btn.png", "#music"+ musicState +"Btn.png", this.onMusic, this);
		var menu2Size = menuItem2.getContentSize();
		menuItem2.setPosition(windowSize.width - menu2Size.width/2 - 30, windowSize.height - menu2Size.height/2 - 31);

		this.btnMenu = new cc.Menu(stepBtn, menuItem2);
		this.btnMenu.setPosition(0, 0);

		this.addChild(this.imageSprite, 0);
		this.addChild(this.btnMenu, 1);
	},
	onBack: function(){
		// cc.director.popToRootScene();
		cc.director.runScene(new MainScene(GAMEOPTIONS["NOWPASS"], false, this.passNo));		
	},
	onMusic: function(target){
		if(musicState === "On") {
			try{
				$bgMusic.pause();
			}catch(e){}
			musicState = "Off";
		}else if(musicState === "Off"){
			try{
				$bgMusic.play();
			}catch(e){}
			musicState = "On";
		}
		target.setNormalSpriteFrame("#music"+ musicState +"Btn.png");
		// console.log("Music ", musicState);
	}
});

var PlayScene = cc.Scene.extend({
	passNo: null,
	keyBoardLayer: null,
	anwser: null,
	gamePassLayer: null,
	lastAnwser: null,
	isPassed: false,
	lock: false,
	ctor: function(passNo){
		this._super();
		this.passNo = passNo || 1;
		this.anwser = PASS[passNo-1].anwser;
		this.init();
	},
	init: function(){
		this._super();
		this.gamePassLayer = new GamePassLayer(this.passNo);
	},
	onEnter: function(){
		this._super();
		var playLayer = new PlayLayer(this.passNo);
		this.keyBoardLayer = new KeyBoardLayer(this.anwser, PASS[this.passNo-1].keywords);
		this.addChild(playLayer, 0, TagOfLayer.playLayer);
		this.addChild(this.keyBoardLayer, 1, TagOfLayer.keyboard);
		this.schedule(this.check, 1.0, cc.kCCRepeatForever, 1);
	},
	onExit: function(){
		this._super();
		this.removeAllChildrenWithCleanup(true);
		this.keyBoardLayer = null;
		this.gamePassLayer = null;
	},
	check: function(dt){
		var ans = this.keyBoardLayer.playerAnwser.join("");
		if ( ans.length !== this.anwser.length ) {
			return;
		}
		if ( this.lastAnwser === ans ) {
			if (!this.lock) {
				this.lock = true;
				var gameOverLayer = new GameOverLayer(this.passNo, {text: "这个输入已经试过啦...", fontSize: 38});
				this.addChild(gameOverLayer, 2);
				gameOverLayer.bake();
				gameOverLayer = null;			
			}
			return;
		}
		this.lastAnwser = ans;
		this.lock = true;

		var result = this.keyBoardLayer.check();
		if ( result === 0 ) {
			this.isPassed = true;
			this.addChild(this.gamePassLayer, 2);
		}else {
			var say = "";
			switch(result){
				case 1:{
					say = "可惜，差一点点就对啦...";
					break;
				}
				case 2:{
					say = "正确答案正向你招手...";
					break;
				}
				default:{
					say = "还需努力，差的有点多...";
				}
			}
			var gameOverLayer = new GameOverLayer(this.passNo, {text: say, fontSize: 38});
			this.addChild(gameOverLayer, 2);
			gameOverLayer.bake();
			gameOverLayer = null;
		}
	}
});