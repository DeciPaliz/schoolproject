var WordPreview = cc.Node.extend({
    ctor: function () {
        this._super();

        this.onFinishDisplaying = function (word_index) {};

        this.letter_buttons = [];
        
        this.letterSize = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize();

        this.addWordMarkers();
    },

    addWordMarkers: function () {
        this.success_marker = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('word_right.png'));
        this.possible_marker = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('word_extra.png'));
        this.failure_marker = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('word_wrong.png'));
        this.success_marker.setOpacity(0);
        this.possible_marker.setOpacity(0);
        this.failure_marker.setOpacity(0);
        this.addChild(this.success_marker);
        this.addChild(this.possible_marker);
        this.addChild(this.failure_marker);
    },

    addLetter: function (letter) {
        let lb = new LetterButton(letter);
        this.letter_buttons.push(lb);
        this.addChild(lb);
        this.positionLetters();
    },

    removeLetter: function (index) {
        let new_arr = [];
        for (let i = 0; i < this.letter_buttons.length; i++) {
            if (i == index)
               this.removeChild(this.letter_buttons[i]);
            else
                new_arr.push(this.letter_buttons[i]);
        }
        this.letter_buttons = new_arr;
        this.positionLetters();
    },

    removeAllLetters: function () {
        for (let lb of this.letter_buttons)
            this.removeChild(lb);
        this.letter_buttons = [];
        this.positionLetters();
    },

    positionLetters: function () {
        for (let i = 0; i < this.letter_buttons.length; i++) {
            let lb = this.letter_buttons[i];
            lb.setPositionX(this.letterSize.width/2 - Math.floor((this.letter_buttons.length/2 - i) * this.letterSize.width));
        }
    },

    display: function (type, word_index) {
        let x = this.letter_buttons.length*this.letterSize.width/2 + this.success_marker.width;
        switch (type) {
            case "success":
                this.success_marker.setPositionX(x);
                this.success_marker.runAction(new cc.Sequence(
                    new cc.FadeIn(WordPreview.MARKER_FADE_DURATION),
                    new cc.DelayTime(2*WordPreview.MARKER_FADE_DURATION - WordPreview.LETTER_FADE_DELAY*this.letter_buttons.length),
                    new cc.FadeOut(WordPreview.MARKER_FADE_DURATION)
                ));
                break;
            case "possible":
                this.possible_marker.setPositionX(x);
                this.possible_marker.runAction(new cc.Sequence(
                    new cc.FadeIn(WordPreview.MARKER_FADE_DURATION),
                    new cc.DelayTime(2*WordPreview.MARKER_FADE_DURATION - WordPreview.LETTER_FADE_DELAY*this.letter_buttons.length),
                    new cc.FadeOut(WordPreview.MARKER_FADE_DURATION)
                ));
                break;
            case "failure":
                this.failure_marker.setPositionX(x);
                this.failure_marker.runAction(new cc.Sequence(
                    new cc.FadeIn(WordPreview.MARKER_FADE_DURATION),
                    new cc.DelayTime(WordPreview.LETTER_FADE_DELAY*this.letter_buttons.length),
                    new cc.FadeOut(WordPreview.MARKER_FADE_DURATION)
                ));
                break;
        }
        if (type === "success" || type === "possible") {
            for (let i = 0; i < this.letter_buttons.length; i++) {
                setTimeout(function () {
                    this.letter_buttons[i].runAction(new cc.MoveBy(WordPreview.LETTER_FADE_DELAY, 0, WordPreview.LETTER_Y_SHIFT));
                    this.letter_buttons[i].letter_bg.runAction(new cc.FadeOut(WordPreview.LETTER_FADE_DELAY));
                    this.letter_buttons[i].letter_sprite.runAction(new cc.FadeOut(WordPreview.LETTER_FADE_DELAY));
                }.bind(this), i*WordPreview.LETTER_FADE_DELAY*1000);
            }
            setTimeout(function () { this.removeAllLetters(); this.onFinishDisplaying(word_index); }.bind(this), this.letter_buttons.length*WordPreview.LETTER_FADE_DELAY*1000);
        } else if (type === "failure") {
            for (let lb of this.letter_buttons) {
                lb.runAction(new cc.Repeat(new cc.Sequence(
                    new cc.RotateBy(WordPreview.LETTER_SHAKE_DURATION, WordPreview.LETTER_SHAKE_ANGLE, WordPreview.LETTER_SHAKE_ANGLE),
                    new cc.RotateBy(WordPreview.LETTER_SHAKE_DURATION, -WordPreview.LETTER_SHAKE_ANGLE, -WordPreview.LETTER_SHAKE_ANGLE),
                    new cc.RotateBy(WordPreview.LETTER_SHAKE_DURATION, -WordPreview.LETTER_SHAKE_ANGLE, -WordPreview.LETTER_SHAKE_ANGLE),
                    new cc.RotateBy(WordPreview.LETTER_SHAKE_DURATION, WordPreview.LETTER_SHAKE_ANGLE, WordPreview.LETTER_SHAKE_ANGLE),
                ), 3));
                setTimeout(function () { 
                    lb.letter_bg.runAction(new cc.FadeOut(WordPreview.LETTER_FADE_DELAY));
                    lb.letter_sprite.runAction(new cc.FadeOut(WordPreview.LETTER_FADE_DELAY));
                }.bind(this), 12*WordPreview.LETTER_SHAKE_DURATION*1000);
            }
            setTimeout(function () { this.removeAllLetters(); this.onFinishDisplaying(-1); }.bind(this), (WordPreview.MARKER_FADE_DURATION + 12*WordPreview.LETTER_SHAKE_DURATION)*1000);
        }
    },
});

WordPreview.MARKER_FADE_DURATION = 0.2;
WordPreview.LETTER_FADE_DELAY = 0.1;
WordPreview.LETTER_Y_SHIFT = 10;
WordPreview.LETTER_SHAKE_ANGLE = 5;
WordPreview.LETTER_SHAKE_DURATION = 0.05;
