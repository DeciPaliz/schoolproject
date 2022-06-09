var Scene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.game = new Game();

        this.lettersize = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize();

        this.addBackground();
        this.addBoardBackground();

        setTimeout(function () {
            this.addWordFrames();
            this.addLetterWheel();
            this.addWordPreview();
        }.bind(this), 1000);

    },

    addBackground: function() {
        this.background = new cc.Sprite(resources.background);
        this.background.setScale(Math.max(this.width / this.background.width, this.height / this.background.height));
        this.background.setPosition(this.width / 2, this.height / 2);
        this.background.setLocalZOrder(-2);
        this.addChild(this.background);
    },

    addBoardBackground: function () {
        this.board_bg = new ccui.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame('board_bg.png'), cc.rect(9, 5, 2, 2));
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

    addLetterWheel: function () {
        this.letter_wheel = new LetterWheel(this.game.letters, this.height/4 - this.lettersize.width);
        this.letter_wheel.setPosition(this.width/2, this.height/4);
        this.addChild(this.letter_wheel);

        this.letter_wheel.onSelectLetter = this.onLetterWheelSelectLetter.bind(this);
        this.letter_wheel.onDeselectLetter = this.onLetterWheelDeselectLetter.bind(this);
        this.letter_wheel.onSubmitWord = this.onLetterWheelSubmitWord.bind(this);
    },

    addWordPreview: function () {
        this.word_preview = new WordPreview();
        this.word_preview.setPosition(this.width/2, this.board_bg.y - this.board_bg.height + this.lettersize.height);
        this.addChild(this.word_preview);

    },

    onLetterWheelSelectLetter: function (letter) {
        this.word_preview.addLetter(letter);
    },

    onLetterWheelDeselectLetter: function (index) {
        this.word_preview.removeLetter(index);
    },

    onLetterWheelSubmitWord: function (letters) {
        let result = this.game.checkWord(letters);
        this.word_preview.removeAllLetters();
        if (result.flag === Game.WORD_FLAG.NONE) {
            //TODO: failure animation
        }
        else if (result.flag === Game.WORD_FLAG.SUCCESS) {
            //TODO: success animation
            this.wordframes[result.index].open();
        }
        else if (result.flag === Game.WORD_FLAG.POSSIBLE) {
            //TODO: possible word animation
        }
        else if (result.flag === Game.WORD_FLAG.ALREADY_SOLVED) {
            //TODO: already solved animation
        }
    },
});

Game.BOARD_BG_MARGIN_X = 50;
Game.BOARD_BG_MARGIN_Y = 50;

Game.MARGIN_X = 50;
Game.MARGIN_Y = 50;
