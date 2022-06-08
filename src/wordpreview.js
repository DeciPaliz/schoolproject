var WordPreview = cc.Node.extend({
    ctor: function () {
        this._super();

        //TODO
        
        this.letter_buttons = [];
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

    positionLetters: function () {
        for (let i = 0; i < this.letter_buttons.length; i++) {
            let lb = this.letter_buttons[i];
            let letterSize = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize();
            lb.setPositionX(letterSize.width/2 - Math.floor((this.letter_buttons.length/2 - i) * letterSize.width));
        }
    },
});
