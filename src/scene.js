var Scene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.game = new Game();
        this.game.onFinish = this.onGameFinish.bind(this);

        this.lettersize = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize();
        this.cellSize = cc.spriteFrameCache.getSpriteFrame('cell.png').getOriginalSize();

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
        this.board_bg.setContentSize(this.width - Scene.BOARD_BG_MARGIN_X*2, this.height/2 - Scene.BOARD_BG_MARGIN_Y*2);
        this.board_bg.setPosition(this.width/2, this.height*3/4);
        this.board_bg.setLocalZOrder(-1);
        this.addChild(this.board_bg);
    },

    addWordFrames: function() {
        let x = 0;
        let y = this.height - Scene.BOARD_BG_MARGIN_Y - Scene.OFFSET_Y + this.cellSize.height + Scene.MARGIN_Y;
        this.wordframes = new Array(this.game.words.length).fill();
        for (let i = 0; i < this.game.words.length; i++) {
            if (i % 2 == 0) {
                let width = 0;
                if (i+1 < this.game.words.length)
                    width = this.game.words[i].length*this.cellSize.width + Scene.MARGIN_X + this.game.words[i+1].length*this.cellSize.width;
                else
                    width = this.game.words[i].length*this.cellSize.width;
                x = this.width/2 - width/2 + this.cellSize.width/2;
                y -= this.cellSize.height + Scene.MARGIN_Y;
            } else {
                x += this.cellSize.width*this.game.words[i-1].length + Scene.MARGIN_X;
            }
            let wordframe = new WordFrame(this.game.words[i]);
            wordframe.setPosition(x, y);
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
        this.word_preview.setPosition(this.width/2, this.height/2 + this.lettersize.height/2 + Scene.OFFSET_Y);
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

    onGameFinish: function () {
        console.log("congrats!!!");
        this.letter_wheel.active = false;
    },
});

Scene.BOARD_BG_MARGIN_X = 10;
Scene.BOARD_BG_MARGIN_Y = 10;

Scene.MARGIN_X = 20;
Scene.MARGIN_Y = 20;
Scene.OFFSET_Y = 80;
