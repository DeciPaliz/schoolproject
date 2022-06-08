var LetterButton = cc.Node.extend({
    ctor: function (letter) {
        this._super();

        this.onClick = function () {};
        
        this.letter = letter;
        this.letter_sprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(resources.letters_dict[this.letter]));
//        this.letter_bg = new ccui.Button(cc.spriteFrameCache.getSpriteFrame('letter_bg.png'));
        this.letter_bg = new ccui.Button('#letter_bg.png', null, null, ccui.Widget.PLIST_TEXTURE);
        this.letter_sprite.setLocalZOrder(2);
        this.letter_bg.setLocalZOrder(1);
        this.letter_bg.setZoomScale(0);
        this.addChild(this.letter_sprite);
        this.addChild(this.letter_bg);

        this.selectionBox = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('letter_bg_glow.png'));
        this.selectionBox.setVisible(false);
        this.addChild(this.selectionBox);

        this.letter_bg.addClickEventListener(function () {
            this.onClick();
        }.bind(this));
    },
});
