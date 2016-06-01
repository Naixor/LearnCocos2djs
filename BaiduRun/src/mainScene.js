var MainBackLayer = cc.Layer.extend({
	ctor: function(){
		this._super();
		this.init();
		return true;
	},
	init: function(){
		this._super();
		var size = cc.winSize;
		var bgSprite = new cc.Sprite(res.mapBG_png);
		var menuItem3 = new cc.MenuItemImage("#music"+ musicState +"Btn.png", "#music"+ musicState +"Btn.png", this.onMusic, this);
		var menu3Size = menuItem3.getContentSize();
		menuItem3.setPosition(size.width - menu3Size.width/2 - 30, size.height - menu3Size.height/2 - 31);
		var menu = new cc.Menu(menuItem3);
		menu.setPosition(0, 0);

		bgSprite.setPosition({
			x: size.width/2,
			y: size.height/2
		});
		this.addChild(bgSprite, 0);
		this.addChild(menu);
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
	}
});

var MainAnimationLayer = cc.Layer.extend({
	bear: null,
	isBearRun: null,
	passItems: [],
	nowPass: null,
	bearSprite: null,
	posArr: null,
	bezierPoints: null,
	ctor: function(nowPass){
		this._super();
		this.nowPass = nowPass || 1;
		this.posArr = [
			{x: -70, y: 1007},
			{x: 102, y: 678},
			{x: 296, y: 759},
			{x: 531, y: 792},
			{x: 550, y: 587},
			{x: 408, y: 432},
			{x: 188, y: 332},
			{x: 365, y: 149}
		];
		this.bezierPoints = [
			[{x:   0, y: 740}, {x:   0, y: 740}, {x: 102, y: 678}],
			[{x: 165, y: 621}, {x: 280, y: 685}, {x: 296, y: 759}],
			[{x: 332, y: 862}, {x: 493, y: 866}, {x: 531, y: 792}],
			[{x: 559, y: 740}, {x: 565, y: 629}, {x: 550, y: 587}],
			[{x: 525, y: 516}, {x: 444, y: 433}, {x: 408, y: 432}],
			[{x: 367, y: 413}, {x:  93, y: 484}, {x: 188, y: 332}],
			[{x: 209, y: 302}, {x: 365, y: 260}, {x: 365, y: 149}]
		];
		this.init();
	},
	init: function(){
		this._super();
		var labels = [
			{
				text: "北大资源宾馆",
				res: "#floorLabelBG6.png",
				pos: {x: 101, y: 594}
			},
			{
				text: "海泰大厦",
				res: "#floorLabelBG4.png",
				pos: {x: 292, y: 678}
			},
			{
				text: "理想国际大厦",
				res: "#floorLabelBG6.png",
				pos: {x: 534, y: 716}
			},
			{
				text: "银科大厦",
				res: "#floorLabelBG4.png",
				pos: {x: 550, y: 511}
			},
			{
				text: "普天大厦",
				res: "#floorLabelBG4.png",
				pos: {x: 408, y: 357}
			},
			{
				text: "百度大厦",
				res: "#floorLabelBG4.png",
				pos: {x: 188, y: 255}
			},
			{
				text: "百度科技园",
				res: "#floorLabelBG5.png",
				pos: {x: 369, y: 74}
			}
		];

		this.isBearRun = false;

		this.bearSprite = new cc.Sprite("#bear.png");
		this.bearSprite.setPosition(this.posArr[this.nowPass-1]);
		this.addChild(this.bearSprite, 2)

		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event){
				if (this.getParent().getChildByTag(3) || this.isBearRun) {
					return;
				}
				var target = event.getCurrentTarget();  
	            //Get the position of the current point relative to the button
	            var locationInNode = target.convertToNodeSpace(touch.getLocation());    
	            var s = target.getContentSize();
	            var rect = cc.rect(0, 0, s.width, s.height);
	            // console.log(cc.rectContainsPoint(rect, locationInNode));
	            //Check the click area
	            if (cc.rectContainsPoint(rect, locationInNode)) {       
	                return true;
	            }
	            return false;
			}.bind(this),
			onTouchMoved: function(){},
			onTouchEnded: function(touch, event){
				var target = event.getCurrentTarget();
				if (target.status === "active") {
					this.isBearRun = true;
					this.bearSprite.runAction(
						cc.sequence(
							cc.spawn(
								cc.jumpTo(1, this.posArr[target.passNo-1], 10, 4),
								cc.bezierTo(1, this.bezierPoints[target.passNo-1])
							),
							cc.fadeIn(0.5),
							cc.callFunc(this.loadPass, this, target.passNo)
						)
					);
				}else if(target.status === "passed"){
					this.isBearRun = true;
					this.loadPass(this, target.passNo);
				}
			}.bind(this)
		});

		for( var i = 0, len = PASS.length;i < len;i++ ){
			var sprite = new PassSprite(i+1);
			sprite.setPosition(this.posArr[i+1]);
			if (i+1 < this.nowPass) {
				sprite.passed();
			}else if(i+1 === this.nowPass){
				sprite.active();
			}else {
				sprite.normal();
			}
			this.addChild(sprite, 0);
			cc.eventManager.addListener(listener.clone(), sprite);
			this.passItems.push(sprite);
			sprite = null;

			if (i < this.nowPass-1) {
				var label = new Button({text: labels[i].text, fontSize: 23, fontFamily: "Microsoft YaHei"}, labels[i].res);
				label.setPosition(labels[i].pos);
				this.addChild(label, 1);
				label = null;
			}
		}
		listener = null;
	},
	onEnter: function(){
		this._super();
	},
	onExit: function(){
		this._super();
		this.removeAllChildrenWithCleanup(true);
		this.releaseEvents();
	},
	nextPass: function(){
		var target = this.passItems[this.nowPass-1];
		this.isBearRun = true;
		this.bearSprite.runAction(
			cc.sequence(
				cc.spawn(
					cc.jumpTo(1, this.posArr[target.passNo-1], 10, 4),
					cc.bezierTo(1, this.bezierPoints[target.passNo-1])
				),
				cc.fadeIn(0.5),
				cc.callFunc(this.loadPass, this, target.passNo)
			)
		);
	},
	loadPass: function(e, passNo) {
		LoadingScene.preload(PASS[passNo-1].resources.concat(SHARERES.resources), function () {
			cc.director.runScene(new PlayScene(passNo));
		}, this);
	},
	releaseEvents: function(){
		for (var i = 0; i < this.passItems.length; i++) {
			cc.eventManager.removeListener(this.passItems[i]);
		};
	},
	finish: function(){
		this.bearSprite.runAction(
			cc.sequence(
				cc.spawn(
					cc.jumpTo(1.2, {x: cc.winSize.width/2, y: cc.winSize.height/2}, 10, 6),
					cc.scaleTo(1.2, 3.5, 3.5),
					cc.fadeOut(1.5)
				),
				cc.callFunc(function(){
					this.bake();
					this.releaseEvents();
				}, this)
			)
		)
	}
});

var MainScene = cc.Scene.extend({
	mainBackLayer: null,
	mainAnimationLayer: null,
	ctor: function(totalPass, ok, nowPass){
		this._super();
		this.init(totalPass || 1, ok || false, nowPass);
	},
	init: function(totalPass, ok, nowPass){
		this._super();
		this.mainBackLayer = new MainBackLayer(totalPass);
		this.mainAnimationLayer = new MainAnimationLayer(totalPass);

		this.addChild(this.mainBackLayer, 0);
		this.mainBackLayer.bake();
		this.addChild(this.mainAnimationLayer, 1, TagOfLayer.mainAnimationLayer);
		if (nowPass) {
			if (ok) {
				var i = nowPass - 1;
				var infoLayer = new InfoLayer(PASS[i].info.title, PASS[i].info.location, PASS[i].res.info_jpg, PASS[i].info.word);
				this.addChild(infoLayer, 2, 3);
				infoLayer.bake();
				infoLayer = null;
			}
		}else {
			if (!GAMEOPTIONS['REPLAY']) {
				var introduceLayer = new IntroduceLayer();
				this.addChild(introduceLayer, 2, 3);
				introduceLayer.bake();	
				introduceLayer = null;
			}
		}
	},
	onEnter: function(){
		cc.director.resume();
		this._super();
	},
	onExit: function(){
		this._super();
		this.mainBackLayer = null;
		this.mainAnimationLayer = null;
		this.removeAllChildrenWithCleanup(true);
	},
	finish: function(){
		this.mainAnimationLayer.finish();
		var share = new ShareLayer();
		this.scheduleOnce((function(tar, self){
			return function(){
				self.addChild(tar, 2, 3);			
			}
		})(share, this), 1.3);
	}
});