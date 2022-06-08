var LetterButton = cc.Node.extend({
    ctor: function (letter) {
        this._super();
        
        this.letter = letter;
        this.letter_sprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(resources.letters_dict[this.letter]));
        this.letter_bg = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('letter_bg.png'));
        this.letter_sprite.setLocalZOrder(2);
        this.letter_bg.setLocalZOrder(1);
        this.addChild(this.letter_sprite);
        this.addChild(this.letter_bg);
    },
});
