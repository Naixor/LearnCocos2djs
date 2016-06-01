var GameOverLayer = cc.LayerColor.extend({
	passNo: null,
	font: null,
	labelText: null,
    ctor: function(passNo, font){
		this._super(cc.color(0, 0, 0, 204));
		this.passNo = passNo;
		this.font = {
			text: font.text || "",
			fontFamily: font.fontFamily || "Microsoft YaHei",
			fontStyle: (font.fontStyle && font.fontStyle + " ") || "",
			fontSize: font.fontSize || 16,
			color: font.color || cc.color(255, 255, 255, 255),
		}
		this.init();
    },
    init: function(){
		var winSize = cc.director.getWinSize();
		var centerPos = {x: winSize.width/2, y: winSize.height/2};

		cc.MenuItemFont.setFontSize(40);
		var bearSprite = new cc.Sprite(SHARERES.res.bearCry_png);
		bearSprite.setAnchorPoint(0.5, 0);

		var bearSize = bearSprite.getContentSize();
		bearSprite.setPosition(centerPos.x+ 26, centerPos.y+40);

		var labelText = new cc.LabelTTF(this.font.text, this.font.fontFamily, this.font.fontSize, cc.size(this.font.fontSize * (this.font.text.length+1), this.font.fontSize+2), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		labelText.fillStyle = this.font.color;
		labelText.font = this.font.fontStyle + this.font.fontFamily;
		labelText.setPosition(centerPos.x, centerPos.y);

		var restartMenuItem = cc.MenuItemImage.create("#retryBtn.png", "#retryBtn.png", this.onRestart, this);
		var itemSize = restartMenuItem.getContentSize();
		restartMenuItem.setPosition((winSize.width- itemSize.width)/2 -10, centerPos.y- 140);

		var helpMenuItem = new cc.MenuItemImage("#helpBtn.png", "#helpBtn.png", this.onHelp, this);
		helpMenuItem.setPosition((winSize.width+ itemSize.width)/2 +10, centerPos.y- 140);

		var menu = cc.Menu.create(restartMenuItem, helpMenuItem);
		menu.setPosition(0, 0);

		this.addChild(bearSprite, 0);
		this.addChild(menu, 1);
		this.addChild(labelText, 1);
    },
    onRestart: function(){
    	var p = this.getParent();
    	p.lock = false;
    	p.getChildByTag(TagOfLayer.keyboard).reset();
    	this.removeFromParent(true);
    },
    onHelp: function(){
    	var p = this.getParent();
    	p.lock = false;
    	p.getChildByTag(TagOfLayer.keyboard).reset(10);
    	this.removeFromParent(true);	
    },
    onClose: function(){
    	cc.director.resume();
    	this.removeAllChildrenWithCleanup(true);
    	this.removeFromParent(true);
    },
    removeFromParent: function(clean){
    	this._super(clean);
    }
})