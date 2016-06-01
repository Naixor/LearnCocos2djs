var ShareLayer = cc.LayerColor.extend({
	ctor: function(){
		this._super(cc.color(0, 0, 0, 204));
		this.init();
	},
	init: function(){
		var winSize = cc.winSize;
		var bearLabel = new BearLabel("你是第"+ GAMEOPTIONS["TOTALSUM"] +"位闯关的大侠。\n好厉害，竟然通关啦，为你点赞！\n转发到朋友圈并截图\n发给百度Family微信号\n（微信号：baidufamily)，就有\n机会赢取百度15周年年会门票！", 26, 0, 40);
		var size = bearLabel.getContentSize();
		bearLabel.setPosition((winSize.width-size.width)/2, (winSize.height-size.height)/2);

		var startMenuItem = new cc.MenuItemImage("#lastShareBtn.png", "#lastShareBtn.png", this.onShare, this);
		var h = (winSize.height - size.height)/2 - startMenuItem.getContentSize().height;
		startMenuItem.setPosition(winSize.width/2 + 145, h);
		var playAgainBtn = new cc.MenuItemImage(PASS[6].res.playAgainBtn_png, PASS[6].res.playAgainBtn_png, this.onPlayAgain, this);
		playAgainBtn.setPosition(winSize.width/2 - 145, h);
		var menu = new cc.Menu(startMenuItem, playAgainBtn);
		menu.setPosition(0, 0);

		var slogoSprite = new cc.Sprite(PASS[6].res.slogo_png);
		slogoSprite.setAnchorPoint(0, 1);
		slogoSprite.setPosition(50, winSize.height- 50);

		this.addChild(bearLabel, 0);
		this.addChild(slogoSprite, 0);
		this.addChild(menu, 1);
	},
	onExit: function(){
		this._super();
	},
	onPlayAgain: function(){
		window.localStorage.clear();
		this.removeFromParent();
		GAMEOPTIONS['NOWPASS'] = 1;
		GAMEOPTIONS['REPLAY'] = true;
		cc.director.runScene(new MainScene(1, false, 0));
	},
	onShare: function(){
		if (this.share) {
			return;
		}
		this.share = new cc.Sprite(SHARERES.res.share_png);
		this.share.setAnchorPoint(1, 1);
		this.share.setPosition(cc.winSize.width-30, cc.winSize.height - 60);
		this.share.runAction(
			cc.sequence(
				cc.moveBy(0.5, 0, 60),
				cc.moveBy(0.5, 0, -60),
				cc.moveBy(0.5, 0, 60),
				cc.moveBy(0.5, 0, -60),
				cc.callFunc(function(tar, share){
					share.removeFromParent(true);
					this.share = null;
				}, this, this.share)
			)
		)
		this.addChild(this.share);
	}
});