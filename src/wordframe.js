var WordFrame = cc.Node.extend({
    ctor: function (word) {
        this._super();

        this.opened = Array(word.length).fill().map(function () { return false; });
        this.cells = Array(word.length).fill();
        this.letters = Array(word.length).fill();
        this.word_letters = word.split("");
        this.cellSize = cc.spriteFrameCache.getSpriteFrame('cell.png').getOriginalSize();
        for (let i = 0; i < this.letters.length; i++) {
            this.addCell(this.x + i*this.cellSize.width);
        }
    },

    addCell: function (x) {
        let cell = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('cell.png'));
        cell.setPositionX(x);
        cell.setScale(0);
        this.addChild(cell);
        this.cells.push(cell);
        cell.runAction(new cc.ScaleTo(WordFrame.APPEARING_DURATION, 1));
    },

    addLetter: function (i) {
        //TODO: animation
        let letter = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(resources.letters_dict[this.word_letters[i]]));
        let letter_bg = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('letter_bg.png'));
        letter.setLocalZOrder(2);
        letter_bg.setLocalZOrder(1);
        letter_bg.setPositionX(letter_bg.x + i*this.cellSize.width);
        letter.setPositionX(letter.x + i*this.cellSize.width);
        this.addChild(letter_bg);
        this.addChild(letter);
    },

    open: function () {
        //TODO: opening animation
        for (let i = 0; i < this.opened.length; i++) {
            if (!this.opened[i]) {
                this.opened[i] = true;
                this.addLetter(i);
            }
        }
    }
});

WordFrame.APPEARING_DURATION = 0.5;
