var Scene = cc.Scene.extend({
    ctor: function (game) {
        this._super();

        this.game = game;
        this.game.onFinish = this.onGameFinish.bind(this);
        this.game.onHint = this.onGameHint.bind(this);
        this.game.onSolve = this.onGameSolve.bind(this);
        this.game.onAlreadySolved = this.onGameAlreadySolved.bind(this);
        this.game.onPossible = this.onGamePossible.bind(this);
        this.game.onFailure = this.onGameFailure.bind(this);

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
        this.board_bg.setScaleX(0);
        this.addChild(this.board_bg);
        this.board_bg.runAction(new cc.ScaleTo(Scene.BOARD_BG_APPEARING_DURATION, 1, 1));
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
            wordframe.onFinishOpening = this.onWordFrameFinishOpening.bind(this);
            wordframe.setPosition(x, y);
            this.addChild(wordframe);
            this.wordframes[i] = wordframe;
        } 
    },

    addLetterWheel: function () {
        this.letter_wheel = new LetterWheel(this.game, this.height/4 - this.lettersize.width);
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
        
        this.word_preview.onFinishDisplaying = this.onWordPreviewFinishDisplaying.bind(this);
    },

    onLetterWheelSelectLetter: function (letter) {
        this.word_preview.addLetter(letter);
    },

    onLetterWheelDeselectLetter: function (index) {
        this.word_preview.removeLetter(index);
    },

    onLetterWheelSubmitWord: function (letters) {
        this.game.checkWord(letters);
    },

    onWordPreviewFinishDisplaying: function (word_index) {
        if (word_index !== -1) {
            this.wordframes[word_index].open();
        }
        this.letter_wheel.active = true;
    },

    onWordFrameFinishOpening: function () {
        this.letter_wheel.active = true;
    },

    onGameFinish: function () {
        setTimeout(function () {
            this.finishAnimation = sp.SkeletonAnimation.create(resources.victory_json, resources.game_atlas);
            this.finishAnimation.setAnimation(0, "open", false);
            this.finishAnimation.addAnimation(0, "idle", true);
            this.finishAnimation.setPosition(this.width/2, this.height/2);
            this.addChild(this.finishAnimation);
        }.bind(this), Scene.FINISH_ANIMATION_DELAY*1000);
    },

    onGameSolve: function (word_index) {
        //TODO: animation
        this.letter_wheel.active = false;
        this.word_preview.display("success", word_index);
    },

    onGameHint: function (hint) {
        
    },

    onGameAlreadySolved: function (word_index, possible_word_index) {
        this.letter_wheel.active = false;
        this.word_preview.display("failure");
    },

    onGamePossible: function (possible_word_index) {
        this.letter_wheel.active = false;
        this.word_preview.display("possible", -1);
    },

    onGameFailure: function () {
        this.letter_wheel.active = false;
        this.word_preview.display("failure", -1);
    },
});

Scene.BOARD_BG_MARGIN_X = 10;
Scene.BOARD_BG_MARGIN_Y = 10;

Scene.MARGIN_X = 20;
Scene.MARGIN_Y = 20;
Scene.OFFSET_Y = 80;

Scene.BOARD_BG_APPEARING_DURATION = 0.5;

Scene.FINISH_ANIMATION_DELAY = 1;
