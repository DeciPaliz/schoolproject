var WordFrame = cc.Node.extend({
    ctor: function (word) {
        this._super();

        this.opened = Array(word.length).fill().map(function () { return false; });
        this.letters = word.split("");
        let cellSize = cc.spriteFrameCache.getSpriteFrame('cell.png').getOriginalSize();
        for (let i = 0; i < this.letters.length; i++) {
            this.addCell(this.x + i*cellSize.width);
        }
    },

    addCell: function (x) {
        let cell = new cc.Sprite(resources.cell);
        cell.setPositionX(x);
        this.addChild(cell);
    },

    open: function () {
        for (let i = 0; i < this.opened.length; i++) {
            if (!this.opened[i]) {
                this.opened[i] = true;

            }
        }
    }
});
