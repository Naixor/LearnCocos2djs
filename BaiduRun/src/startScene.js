var StartLayer = cc.Layer.extend({
	spriteBG: null,
	ctor: function() {
		this._super();
		cc.director.setProjection(cc.Director.PROJECTION_2D);
		this.init();
	},
	init: function() {
		this._super();
		var windowSize = cc.winSize;
		var centerPos = {
			x: windowSize.width / 2,
			y: windowSize.height / 2
		};

		this.spriteBG = new cc.Sprite(res.mainBG_jpg);
		this.spriteBG.setPosition(centerPos.x, centerPos.y);
		this.addChild(this.spriteBG);

		cc.spriteFrameCache.addSpriteFrames(res.ui_plist, res.ui_png);
		var iconSpriteSheet = cc.SpriteBatchNode.create(res.ui_png);
		this.addChild(iconSpriteSheet);
		cc.spriteFrameCache.addSpriteFrames(res.unlock_plist, res.unlock_png);
		var unlockSpriteSheet = cc.SpriteBatchNode.create(res.unlock_png);
		this.addChild(unlockSpriteSheet);
		cc.spriteFrameCache.addSpriteFrames(res.bearJump_plist, res.bearJump_png);
		var bearJumpSpriteSheet = cc.SpriteBatchNode.create(res.bearJump_png);
		this.addChild(bearJumpSpriteSheet);

		var menuItem1 = new cc.MenuItemImage("#enterBtn.png", "#enterBtn.png", this.onStart, this);
		menuItem1.setPosition(centerPos.x, centerPos.y - 40);

		var menuItem3 = new cc.MenuItemImage("#musicOnBtn.png", "#musicOnBtn.png", this.onMusic, this);
		var menu3Size = menuItem3.getContentSize();
		menuItem3.setPosition(windowSize.width - menu3Size.width / 2 - 30, windowSize.height - menu3Size.height / 2 - 31);

		var menu = new cc.Menu(menuItem1, menuItem3);
		menu.setPosition(0, 0);
		this.addChild(menu);
	},
	onEnter: function() {
		this._super();
		var earth = new cc.Sprite("#logo1.png");
		var baidu = new cc.Sprite("#logo2.png");
		var run = new cc.Sprite("#logo3.png");
		var fifthen = new cc.Sprite("#logo4.png");
		var tie = new cc.Sprite("#logo5.png");
		var text = new cc.Sprite("#logo6.png");
		var centerPos = {
			x: cc.winSize.width / 2,
			y: 740
		};

		earth.setPosition(centerPos);
		baidu.setPosition(-200, 776);
		run.setPosition(842, 795);
		fifthen.setPosition(167, 681);
		tie.setPosition(427, 600);
		text.setPosition(483, 897);

		// earth.setOpacity(0);
		tie.setOpacity(0);
		text.setOpacity(0);
		fifthen.setOpacity(0);

		baidu.runAction(cc.moveTo(0.5, 204, 820));
		run.runAction(cc.moveTo(0.5, 438, 751));
		tie.runAction(
			cc.spawn(
				cc.fadeIn(0.5),
				cc.sequence(
					cc.moveTo(0.2, 427, 632),
					cc.moveTo(0.15, 427, 646),
					cc.moveTo(0.15, 427, 653)
				)
			)
		)
		text.runAction(
			cc.spawn(
				cc.fadeIn(0.5),
				cc.sequence(
					cc.moveTo(0.2, 483, 865),
					cc.moveTo(0.15, 483, 851),
					cc.moveTo(0.15, 483, 844),
					cc.moveTo(0.3, 483, 844),
					cc.callFunc(function(tar, actor) {
						actor.runAction(
							cc.spawn(
								cc.fadeIn(1),
								cc.sequence(
									cc.scaleTo(0.3, 1.25, 0.75),
									cc.scaleTo(0.1, 0.75, 1.25),
									cc.scaleTo(0.1, 1.15, 0.85),
									cc.scaleTo(0.15, 0.95, 1.05),
									cc.scaleTo(0.1, 1.05, 0.95),
									cc.scaleTo(0.25, 1.0, 1.0)
								)
							)
						);
					}, this, fifthen)
				)
			)
		);

		this.addChild(earth, 0);
		this.addChild(baidu, 1);
		this.addChild(run, 1);
		this.addChild(fifthen, 1);
		this.addChild(tie, 1);
		this.addChild(text, 1);
	},
	onStart: function() {
		// console.log("Start Game!");
		var trans = new cc.TransitionFade(1, new MainScene(GAMEOPTIONS['NOWPASS'], false, GAMEOPTIONS['NOWPASS'] - 1));
		cc.director.runScene(trans);
	},
	onHelp: function() {
		// console.log("Help call!")
	},
	onMusic: function(target) {
		if (musicState === "On") {
			try {
				$bgMusic.pause();
			} catch (e) {}
			musicState = "Off";
		} else if (musicState === "Off") {
			try {
				$bgMusic.play();
			} catch (e) {}
			musicState = "On";
		}
		target.setNormalSpriteFrame("#music" + musicState + "Btn.png");
		// console.log("Music ", musicState);
	}
});

var StartScene = cc.Scene.extend({
	onEnter: function() {
		this._super();
		var startLayer = new StartLayer()
		this.addChild(startLayer);
		startLayer.bake();
	},
	onExit: function() {
		this._super();
		this.removeAllChildrenWithCleanup(true);
	}
});