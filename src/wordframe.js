var WordFrame = cc.Node.extend({
    ctor: function (word) {
        this._super();

        this.opened = Array(word.length).fill().map(function () { return false; });
        this.cells = Array(word.length).fill();
        this.letters = Array(word.length).fill();
        this.word_letters = word.split("");
        let cellSize = cc.spriteFrameCache.getSpriteFrame('cell.png').getOriginalSize();
        for (let i = 0; i < this.letters.length; i++) {
            this.addCell(this.x + i*cellSize.width);
        }
    },

    addCell: function (x) {
        let cell = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('cell.png'));
        cell.setPositionX(x);
        this.addChild(cell);
        this.cells.push(cell);
    },

    addLetter: function (i) {
        let cellSize = cc.spriteFrameCache.getSpriteFrame('cell.png').getOriginalSize();
        let letter = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('rus/' + resources.letters_dict[this.word_letters[i]] + '.png'));
        let letter_bg = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('letter_bg.png'));
        letter.setLocalZOrder(2);
        letter_bg.setLocalZOrder(1);
        letter_bg.setPositionX(letter_bg.x + i*cellSize.width);
        letter.setPositionX(letter.x + i*cellSize.width);
        this.addChild(letter_bg);
        this.addChild(letter);
    },

    open: function () {
        for (let i = 0; i < this.opened.length; i++) {
            if (!this.opened[i]) {
                this.opened[i] = true;
                this.addLetter(i);
            }
        }
    }
});
