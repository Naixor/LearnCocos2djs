var IntroduceLayer = cc.LayerColor.extend({
	ctor: function(){
		this._super(cc.color(0, 0, 0, 204));
		this.init();
	},
	init: function(){
		var winSize = cc.winSize;

		var bearLabel = new BearLabel("百度15周年之\n“Baidu 15 Run”\n线上闯关大挑战。\n看图猜词，聪明绝顶的你\nLet`s go！", 30, 0.5, 48);
		var size = bearLabel.getContentSize();
		bearLabel.setPosition((winSize.width-size.width)/2, winSize.height/2 - size.height/4);

		var startMenuItem = new cc.MenuItemImage("#startBtn.png", "#startBtn.png", this.onStart, this);
		startMenuItem.setPosition(winSize.width/2, winSize.height/2 - size.height/4 - startMenuItem.getContentSize().height);
		var menu = new cc.Menu(startMenuItem);
		menu.setPosition(0, 0);

		this.addChild(bearLabel, 0);
		this.addChild(menu, 1);
	},
	onExit: function(){
		this._super();
	},
	onStart: function(){
		this.removeFromParent(true);
	}
});