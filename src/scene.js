var Scene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.game = new Game();

        this.addBackground();
        this.addBoardBackground();

        setTimeout(this.addWordFrames.bind(this), 1000);
    },

    addBackground: function() {
        this.background = new cc.Sprite(resources.background);
        this.background.setScale(Math.max(this.width / this.background.width, this.height / this.background.height));
        this.background.setPosition(this.width / 2, this.height / 2);
        this.background.setLocalZOrder(-2);
        this.addChild(this.background);
    },

    addBoardBackground: function () {
        this.board_bg = new ccui.Scale9Sprite(resources.board_bg, cc.rect(9, 5, 2, 2));
        this.board_bg.setContentSize(this.width - Game.BOARD_BG_MARGIN_X*2, this.height/2);
        this.board_bg.setAnchorPoint(0, 1);
        this.board_bg.setPosition(Game.BOARD_BG_MARGIN_X, this.height - Game.BOARD_BG_MARGIN_X);
        this.board_bg.setLocalZOrder(-1);
        this.addChild(this.board_bg);
    },

    addWordFrames: function() {
        let cellSize = cc.spriteFrameCache.getSpriteFrame('cell.png').getOriginalSize();
        //let x = Game.BOARD_BG_MARGIN_X + Game.MARGIN_X;
        //let y = this.height - Game.BOARD_BG_MARGIN_Y - Game.MARGIN_Y;
        //for (let word of this.game.words) {
        //    let wordframe = new WordFrame(word);
        //    wordframe.setPosition(x, y);
        //    this.addChild(wordframe);
        //    x += cellSize.width*word.length + Game.MARGIN_X;
        //    if (x > this.width - Game.MARGIN_X*5) {
        //        y -= Game.MARGIN_Y*2;
        //        x = Game.MARGIN_X;
        //    }
        //}
        let x = this.width/2 - cellSize.width*this.game.words[0].length - Game.MARGIN_X;
        let y = (this.board_bg.y - this.board_bg.height/2) + cellSize.height*this.game.words.length/2;
        this.wordframes = new Array(this.game.words.length).fill();
        for (let i = 0; i < this.game.words.length; i++) {
            let wordframe = new WordFrame(this.game.words[i]);
            wordframe.setPosition(x, y);
            if (i % 2 == 1) {
                x = this.width/2 - cellSize.width*this.game.words[0].length - Game.MARGIN_X;
                y -= cellSize.height + Game.MARGIN_Y;
            } else {
                x += cellSize.width*this.game.words[0].length + Game.MARGIN_X;
            }
            this.addChild(wordframe);
            this.wordframes[i] = wordframe;
        } 
    },

});

Game.BOARD_BG_MARGIN_X = 50;
Game.BOARD_BG_MARGIN_Y = 50;

Game.MARGIN_X = 50;
Game.MARGIN_Y = 50;
