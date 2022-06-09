var WordPreview = cc.Node.extend({
    ctor: function () {
        this._super();

        //TODO
        
        this.letter_buttons = [];
        
        this.letterSize = cc.spriteFrameCache.getSpriteFrame('letter_bg.png').getOriginalSize();
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
});
