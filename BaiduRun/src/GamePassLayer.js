var GamePassLayer = cc.LayerColor.extend({
	passNo: null,
    ctor: function(passNo){
		this._super(cc.color(0, 0, 0, 204));
		this.passNo = passNo;
		this.init();
    },
    init: function(){
		var winSize = cc.director.getWinSize();
		var centerPos = {x: winSize.width/2, y: winSize.height/2};
		
		var bearJumpFrames = [];
		for(var i = 0;i < 2;i++){
			bearJumpFrames.push(cc.spriteFrameCache.getSpriteFrame("bearJump"+ i +".png"));
		}
		var bearJumpAnimate = new cc.Animation(bearJumpFrames, 0.2, 1);
		var bearJumpAction = new cc.Animate(bearJumpAnimate);
		var bearSprite = new cc.Sprite("#bearJump0.png");
		bearSprite.runAction(cc.repeatForever(bearJumpAction));
		var passMenuItem = cc.MenuItemImage.create("#finishBtn.png", "#finishBtn.png", this.onPass, this);
		
		var h1 = bearSprite.getContentSize().height;
		var h2 = passMenuItem.getContentSize().height;
		
		bearSprite.setPosition(centerPos.x, centerPos.y+ h2 + 10);
		passMenuItem.setPosition(centerPos.x, centerPos.y- (h1+h2)/2 + 10);

		var menu = cc.Menu.create(passMenuItem);
		menu.setPosition(0, 0);

		this.addChild(bearSprite, 0);
		this.addChild(menu, 1);
    },
    onEnter: function(){
    	this._super();
		this.scheduleOnce(this.onPass.bind(this), 1.5); 
    },
    onExit: function(){
    	this._super();
    	this.removeAllChildrenWithCleanup(true);
    },
    onPass: function(){
    	this.removeFromParent(true);
		if(GAMEOPTIONS["NOWPASS"] === this.passNo){
			GAMEOPTIONS["NOWPASS"]++;
			window.localStorage.setItem("NOWPASS", GAMEOPTIONS["NOWPASS"]);
		}
    	cc.director.runScene(new MainScene(GAMEOPTIONS["NOWPASS"], true, this.passNo));
    }
})