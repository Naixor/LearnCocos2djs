/**
 * @class new Button(font, sprite, pos)
 * @param font {text: String, fontFamily: String | null, fontSize: Number, color: cc.color | null, fontStyle: String | null, x: Number | null | undefined, y: Number | null | undefined}
 * @param normalImage, selectedImage, three, four, five {new cc.MenuItemImage(normalImage, selectedImage, three, four, five)} #see cc.MenuItemImage
 * */
var Button = cc.MenuItemImage.extend({
	className: 'Button',
	LabelTTF: null,
	ctor: function(font, normalImage, selectedImage, three, four, five) {
		this._super(normalImage, selectedImage, three, four, five);
		this.init(font);
	},
	init: function(font) {
		var _font = {
			text: font.text || "",
			fontFamily: font.fontFamily || "Arial",
			fontStyle: (font.fontStyle && font.fontStyle + " ") || "",
			fontSize: font.fontSize || 16,
			color: font.color || cc.color(255, 255, 255, 255),
			lineWidth: font.lineWidth || 0,
			x: font.x || 0,
			y: font.y || 0
		}
		this.LabelTTF = new cc.LabelTTF(_font.text, _font.fontFamily, _font.fontSize, cc.size(_font.fontSize * (_font.text.length + 1), _font.fontSize + 2), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		_font.lineWidth && this.LabelTTF.enableStroke(_font.color, _font.lineWidth);
		this.LabelTTF.fillStyle = _font.color;
		this.LabelTTF.font = _font.fontStyle + _font.fontFamily;
		var labelSize = this.getContentSize();
		this.LabelTTF.setPosition(_font.x + labelSize.width / 2, _font.y + labelSize.height / 2);
		this.addChild(this.LabelTTF, 1, 1);
	},
	runAction: function(action) {
		this.LabelTTF.runAction(action);
	}
});
/*
 * @class new PassSprite(imgRes, passNo)
 * @param {String, Number}
 */
var PassSprite = cc.Sprite.extend({
	status: "normal",
	passNo: null,
	callback: null,
	callback_tar: null,
	ctor: function(passNo) {
		this._super();
		this.passNo = passNo;
	},
	onEnter: function() {
		this._super();
	},
	onExit: function() {
		this._super();
		this.removeAllChildrenWithCleanup(true);
	},
	setPassNo: function(passNo) {
		this.passNo = passNo;
	},
	active: function() {
		this.status = "active";

		var item = new cc.Sprite("#lock.png");
		var size = item.getContentSize();
		var centerPos = {
			x: size.width / 2,
			y: size.height / 2
		}
		this.setContentSize(size);

		var flashSprite = new cc.Sprite("#lockflash.png");
		flashSprite.setPosition(centerPos.x - 2, centerPos.y + 4)
		flashSprite.runAction(
			cc.repeatForever(
				cc.sequence(
					cc.fadeOut(0.5),
					cc.fadeIn(0.5)
				)
			)
		)
		this.addChild(flashSprite, 0);

		item.setPosition(centerPos);
		this.addChild(item, 0);
	},
	passed: function() {
		this.status = "passed";
		var item = new cc.Sprite("#unlock"+ this.passNo +".png");
		var size = item.getContentSize();
		this.setContentSize(size);
		item.setPosition(size.width / 2, size.height / 2);
		this.addChild(item, 0);
	},
	normal: function() {
		this.status = "normal";
		var item = new cc.Sprite("#lock.png");
		var size = item.getContentSize();
		this.setContentSize(size);
		item.setPosition(size.width / 2, size.height / 2);
		this.addChild(item, 0);
	}
});
/*
 * @class new InputLabel(fileName, rect, rotated)
 * @param {String, cc.size} #like cc.Sprite(fileName, rect, rotated)
 * */
var InputLabel = cc.Sprite.extend({
	keywordButon: null,
	ctor: function(fileName, rect, rotated) {
		this._super(fileName, rect, rotated);
	},
	addKeywordBtn: function(keywordButton) {
		if (keywordButton && keywordButton.className === "KeywordButton") {
			if (this.keywordButton) {
				return false;
			}
			this.keywordButton = keywordButton;
			this.keywordButton.runAction(cc.scaleBy(0, 1.25, 1.25));
			this.keywordButton.setPosition(this.getPosition());
			return true;
		}
	},
	clearKeywordBtn: function() {
		if (this.keywordButton) {
			this.keywordButton.backToInital();
			this.keywordButton = null;
		}
	}
});
/**
 * @class new KeywordButton(font, normalImage, selectedImage, three, four, five)
 * @param font {text: String, fontFamily: String | null, fontSize: Number, color: cc.color | null, fontStyle: String | null, x: Number | null | undefined, y: Number | null | undefined}
 * @param normalImage, selectedImage, three, four, five {new cc.MenuItemImage(normalImage, selectedImage, three, four, five)} #see cc.MenuItemImage
 *
 * */
var KeywordButton = cc.MenuItemImage.extend({
	className: 'KeywordButton',
	keyword: null,
	anwserIndex: -1,
	LabelTTF: null,
	initalPos: null,
	ctor: function(font, normalImage, selectedImage, three, four, five) {
		this._super(normalImage, selectedImage, three, four, five);
		this.init(font);
	},
	init: function(font) {
		var _font = {
			text: font.text || "",
			fontFamily: font.fontFamily || "Arial",
			fontStyle: (font.fontStyle && font.fontStyle + " ") || "",
			fontSize: font.fontSize || 16,
			color: font.color || cc.color(255, 255, 255, 255),
			lineWidth: font.lineWidth || 0,
			x: font.x || 0,
			y: font.y || 0
		}
		this.keyword = _font.text;
		this.LabelTTF = new cc.LabelTTF(_font.text, _font.fontFamily, _font.fontSize, cc.size(_font.fontSize * _font.text.length, _font.fontSize + 2), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		this.LabelTTF.enableStroke(_font.color, _font.lineWidth);
		this.LabelTTF.fillStyle = _font.color;
		this.LabelTTF.font = _font.fontStyle + _font.fontFamily;
		var labelSize = this.getContentSize();
		this.LabelTTF.setPosition(_font.x + labelSize.width / 2, _font.y + labelSize.height / 2);
		this.addChild(this.LabelTTF, 1, 1);
	},
	setString: function(text) {
		this.LabelTTF.setString(text);
	},
	setPosition: function() {
		if (arguments.length === 1) {
			if (Object.prototype.toString.call(arguments[0]) === "[object Object]") {
				var pos = {
					x: arguments[0].x,
					y: arguments[0].y
				}
			} else {
				// console.error("Bad arguments");
			}
		} else if (arguments.length === 2) {
			var pos = {
				x: arguments[0],
				y: arguments[1]
			}
		} else {
			// console.error("Bad arguments");
			return;
		}
		if (this.initalPos === null) {
			this.initalPos = pos;
		}
		this._super(pos);
	},
	backToInital: function() {
		this.anwserIndex = -1;
		this.runAction(cc.scaleBy(0, 0.8, 0.8))
		this.setPosition(this.initalPos);
	},
	remove: function(){
		this.setEnabled(false);
		this.LabelTTF.runAction(cc.fadeOut(0.5));
		this.runAction(
			cc.sequence(
				cc.fadeOut(0.5),
				cc.callFunc(function(){
					this.unscheduleAllCallbacks();
					this.removeFromParent(true);
				}, this)
			)
		)
	},
	hide: function() {
		this.LabelTTF.setOpacity(0);
		this.setOpacity(0);
	},
	show: function() {
		this.LabelTTF.setOpacity(255);
		this.setOpacity(255);
	}
});
/*
 * @class new BearLabel(text)
 */
var BearLabel = cc.Layer.extend({
	bgSprite: null,
	label: null,
	ctor: function(text, fontSize, lineWidth, lineHeight) {
		this._super();
		this.init(text, fontSize, lineWidth, lineHeight);
	},
	init: function(text, fontSize, lineWidth, lineHeight) {
		this.bgSprite = new cc.Sprite("#introduce.png");

		var size = this.bgSprite.getContentSize();
		var centerPos = {
			x: size.width / 2,
			y: size.height / 2
		};

		this.label = new cc.LabelTTF(text, "Microsoft YaHei", fontSize || 16, size, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
		this.label.enableStroke(cc.color(255, 255, 255, 255), lineWidth || 0);
		this.label.setPosition(centerPos);
		lineHeight && this.label.setLineHeight(lineHeight);
		this.bgSprite.setPosition(centerPos);
		this.setContentSize(size);
	},
	onEnter: function() {
		this._super();
		this.addChild(this.bgSprite, 0);
		this.addChild(this.label, 1);
	},
	onExit: function() {
		this._super();
		this.removeAllChildrenWithCleanup(true);
		this.bgSprite = null;
		this.label = null;
	}
});
/*
 * @class new KeyBoardLayer(anwser, keywords)
 * @param anwser {String}
 * @param keywords {String}
 **/
var KeyBoardLayer = cc.LayerColor.extend({
	anwser: null,
	keywords: null,
	anwserLabels: null,
	keywordBtns: null,
	playerAnwser: null,
	ctor: function(anwser, keywords) {
		this._super();
		this.anwser = anwser.split("");
		this.keywords = keywords.split("|");
		this.playerAnwser = new Array(this.anwser.length);
		this.anwserLabels = [];
		this.keywordBtns = [];
		this.playerAnwser = [];
		this.init();
	},
	init: function() {
		this._super(cc.color(0, 0, 0, 0), cc.winSize.width, 402);
		var keywordMargin = {
			top: 8,
			left: 16
		}
		var keywordSize = {
			width: 65,
			height: 69
		}
		var keyboardCenterPos = {
			x: cc.winSize.width / 2,
			y: 154
		}
		var i = 0;
		this.keywordBtns = [];
		while (0 < this.keywords.length) {
			this.keywordBtns.push(new KeywordButton({
				text: this.randomKeyword(),
				fontFamily: "Microsoft YaHei",
				fontSize: 38,
				lineWidth: 0.5,
				color: cc.color(102, 102, 102, 255)
			}, "#keywordLabel.png", null, this.keywordSelect, this));
			var pos = {
				x: (i % 7 - 3) * (keywordMargin.left + keywordSize.width) + keyboardCenterPos.x,
				y: (Math.floor(i / 7) - 1) * (keywordMargin.top + keywordSize.height) + keyboardCenterPos.y
			}
			this.keywordBtns[i++].setPosition(pos);
		}
		var keywordBtns = this.keywordBtns;

		var inputMargin = {
			top: 0,
			left: 40
		}
		var inputSize = {
			width: 80,
			height: 80
		}
		var inputCenterPos = {
			x: cc.winSize.width / 2,
			y: 359
		}
		var centerIndex = (this.anwser.length - 1) / 2
		for (var n = 0; n < this.anwser.length; n++) {
			var il = new InputLabel("#inputLabel.png");
			il.setPosition({
				x: (n - centerIndex) * (inputSize.width + inputMargin.left) + inputCenterPos.x,
				y: inputCenterPos.y
			});
			this.anwserLabels.push(il);
			this.addChild(il, 1);
			il = null;
		}

		var keywordMenu = new cc.Menu(keywordBtns);
		keywordMenu.setContentSize(cc.winSize.width, 402);
		keywordMenu.setPosition(0, 0);
		this.addChild(keywordMenu, 1);
		keywordBtns = null;
		keywordMenu = null;
	},
	onExit: function() {
		this._super();
		this.removeAllChildrenWithCleanup(true);
		this.anwser = null;
		this.keywords = null;
		this.playerAnwser = null;
		this.anwserLabels = null;
		this.keywordBtns = null;
		this.playerAnwser = null;
	},
	randomKeyword: function() {
		var index = Math.floor(Math.random() * this.keywords.length);

		return this.keywords.splice(index, 1)[0];
	},
	keywordSelect: function(tar) {
		// console.log("click");
		if (tar.anwserIndex === -1) { //tar.x === tar.initalPos.x && tar.y === tar.initalPos.y
			for (var i = 0, len = this.anwserLabels.length; i < len; i++) {
				if (this.anwserLabels[i].addKeywordBtn(tar)) {
					tar.anwserIndex = i;
					this.playerAnwser[i] = tar.keyword;
					return;
				}
			}
		} else {
			this.playerAnwser[tar.anwserIndex] = "";
			this.anwserLabels[tar.anwserIndex].clearKeywordBtn();
			// console.log("playerAnwser is: ", this.playerAnwser);
		}
	},
	check: function() {
		if (this.playerAnwser.join("") === this.anwser.join("")) {
			return 0;
		}
		var j = 0,
			l = this.playerAnwser.length;
		for (var i = 0; i < l; i++) {
			if (this.playerAnwser[i] === this.anwser[i]) {
				j++;
			}
		}
		return l - j;
	},
	reset: function(num) {
		this.playerAnwser = [];
		for (var i = 0; i < this.anwserLabels.length; i++) {
			this.anwserLabels[i].clearKeywordBtn();
		}
		if (typeof(num) === "number") {
			var anwser = this.anwser.join("");
			var length;
			while (num) {
				length = this.keywordBtns.length;
				if (length === this.anwser.length) {
					return false;
				};
				var index = Math.floor(Math.random() * length);
				if (!new RegExp(this.keywordBtns[index].keyword).test(anwser)) {
					var btn = this.keywordBtns.splice(index, 1)[0];
					btn.setEnabled(false);
					btn.remove();
					num--;
				}
			}
		}
	}
});