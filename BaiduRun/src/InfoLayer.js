var InfoLayer = cc.LayerColor.extend({
	title: null,
	location: null,
	imgSprite: null,
	titleIndex: 0,
	locationIndex: 0,
	titleLabel: null,
	wordLabel: null,
	locationLabel: null,
	share: null,
	menu: null,
	ctor: function(title, location, imageRes, word){
		this._super(cc.color(0, 0, 0, 204));
		this.title = title;
		this.location = location;
		this.init(title, location, imageRes, word);
	},
	init: function(title, location, imageRes, word){
		var winSize = cc.director.getWinSize();
		var centerPos = {x: winSize.width/2, y: winSize.height/2};

		var bgSize = {width: 560, height: 0};
		var wordHeight = (Math.ceil(word.length/18)+1)*38;

		this.titleLabel = new cc.LabelTTF("", "Microsoft YaHei", 48, {width: bgSize.width, height: 60}, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
		this.imgSprite = cc.Sprite.create(imageRes);
		this.locationLabel = new cc.LabelTTF("", "Microsoft YaHei", 26, {width: bgSize.width, height: 40}, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
		this.wordLabel = new cc.LabelTTF(word, "Microsoft YaHei", 28, {width: bgSize.width - 50, height: wordHeight});
		this.wordLabel.setLineHeight(38);

		var imgHeight = this.imgSprite.getContentSize().height;
		bgSize.height = wordHeight+ 260 +imgHeight;
		var top = centerPos.y+ bgSize.height/2;
		var dh = top- 190 -wordHeight- imgHeight;
		
		this.titleLabel.setAnchorPoint(0.5, 1);
		this.locationLabel.setAnchorPoint(0.5, 1);
		this.imgSprite.setAnchorPoint(0.5, 1);
		this.wordLabel.setAnchorPoint(0.5, 1);

		this.titleLabel.setPosition(centerPos.x, top);
		this.locationLabel.setPosition(centerPos.x, top-80);
		this.imgSprite.setPosition(centerPos.x, top-140);
		this.wordLabel.setPosition(centerPos.x, top-170- imgHeight);

		this.imgSprite.setOpacity(0);
		this.wordLabel.setOpacity(0);
	
		if (GAMEOPTIONS["NOWPASS"] === 8) {
			var successBtn = new cc.MenuItemImage("#winBtn.png", "#winBtn.png", this.onWin, this);
			successBtn.setPosition(centerPos.x, dh);
			this.menu = new cc.Menu(successBtn);
		}else {
			var shareItem = new cc.MenuItemImage("#shareBtn.png", "#shareBtn.png", this.onShare, this);
			var itemSize = shareItem.getContentSize();
			shareItem.setPosition((winSize.width+ itemSize.width)/2 +20, dh);
			var continueItem = new cc.MenuItemImage("#continueBtn.png", "#continueBtn.png", this.onContinue, this);
			continueItem.setPosition((winSize.width- itemSize.width)/2 -20, dh);

			this.menu = new cc.Menu(continueItem, shareItem);
		}
		this.menu.setOpacity(0);
		this.menu.setPosition(0, 0);
		// this.addChild(bgLabel, 0);
	},
	onEnter: function(){
		this._super();
		this.addChild(this.titleLabel, 0);
		this.addChild(this.locationLabel, 0);
		this.addChild(this.imgSprite, 0);
		this.addChild(this.wordLabel, 1);
		this.schedule(this.updateScreen, 0.1, cc.kCCRepeatForever, 1);	
	},
	onExit: function(){
		this._super();
		this.removeAllChildrenWithCleanup(true);
		this.title = null;
		this.wordLabel = null;
		this.imgSprite = null;
		this.menu = null;
		titleIndex = null;
		locationIndex = null;
		titleLabel = null;
		wordLabel = null;
		locationLabel = null;
	},
	updateScreen: function(){
		if (this.titleIndex < this.title.length) {
			this.titleLabel.setString(this.title.slice(0, ++this.titleIndex));		
		}else {
			if (this.locationIndex <= this.location.length) {
				this.locationLabel.setString(this.location.slice(0, ++this.locationIndex));		
			}else {
				this.updateScreen = function(){};
				this.imgSprite.runAction(
					cc.sequence(
						cc.fadeIn(0.2),
						cc.callFunc(function(){
							this.addChild(this.menu, 1);
							this.wordLabel.runAction(cc.fadeIn(0.3));
							this.menu.runAction(cc.fadeIn(0.3));
						}, this)
					)
				)
			}
		}
	},
	onWin: function(){
		this.getParent().finish();
		this.removeFromParent(true);
	},
	onContinue: function(){
		// this.getParent().getChildByTag(TagOfLayer.mainAnimationLayer).nextPass();
		this.removeFromParent(true);
	},
	onShare: function(){
		if (this.share) {
			return;
		}
		this.share = new cc.Sprite(SHARERES.res.share_png);
		this.share.setAnchorPoint(1, 1);
		this.share.setPosition(cc.winSize.width - 30, cc.winSize.height - 60);
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