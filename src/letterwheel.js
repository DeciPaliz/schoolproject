var LetterWheel = cc.Node.extend({
    ctor: function (letters, radius) {
        this._super();

        this.onSelectLetter = function (letter) {};
        this.onDeselectLetter = function (index) {};
        this.onSubmitWord = function (letters) {};
        this.active = true;

        this.letters = letters;
        this.radius = radius;

        this.selectedLetters = [];

        this.letterbuttons = new Array(this.letters.length).fill();
        for (let i = 0; i < this.letters.length; i++) {
            this.letterbuttons[i] = new LetterButton(this.letters[i]);
            this.letterbuttons[i].onClick = this.onLetterButtonClick.bind(this, i);
            this.letterbuttons[i].setVisible(false);
            this.addChild(this.letterbuttons[i]);
            setTimeout(function () { this.letterbuttons[i].setVisible(true); }.bind(this), i*LetterWheel.APPEARING_DURATION);
        }
        this.setCirclePosition();

        this.submitButton = new ccui.Button('#button_blue.png', '#button_blue_on.png', '#button_blue.png', ccui.Widget.PLIST_TEXTURE);
        this.submitButtonIcon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('submit_icon.png'));
        this.submitButton.setScale9Enabled(true);
        this.submitButton.setCapInsets(cc.rect(this.submitButton.width/2 - 1, this.submitButton.height/2 - 1, 2, 2));
        this.submitButton.setContentSize(this.submitButtonIcon.width + 30, this.submitButtonIcon.height + 20);
        this.submitButton.setEnabled(false);
        this.submitButton.setOpacity(0);
        this.submitButtonIcon.setOpacity(0);
        this.addChild(this.submitButton);
        this.addChild(this.submitButtonIcon);

        this.submitButton.addClickEventListener(function () {
            this.submitWord();
        }.bind(this));

        this.shuffleButton = new ccui.Button('#shuffle.png', '#shuffle_on.png', '#shuffle.png', ccui.Widget.PLIST_TEXTURE);
        this.shuffleButton.setVisible(false);
        this.addChild(this.shuffleButton);
        setTimeout(function () { this.shuffleButton.setVisible(true); }.bind(this), (this.letterbuttons.length+1)*LetterWheel.APPEARING_DURATION);

        this.shuffleButton.addClickEventListener(function () {
            this.shuffle();
        }.bind(this));
    },

    submitWord: function () {
        if (!this.active) return;
        let letters = Array(this.selectedLetters.length).fill().map(function (_, i) {
            return this.letters[this.selectedLetters[i]];
        }.bind(this));
        this.onSubmitWord(letters);
        for (let sl of this.selectedLetters)
            this.letterbuttons[sl].runAction(new cc.ScaleTo(LetterWheel.BUTTON_SCALE_DURATION, 1));
        this.selectedLetters = [];
        for (let lb of this.letterbuttons)
            lb.selectionBox.setVisible(false);
        //TODO: animation
        this.submitButton.runAction(new cc.FadeOut(LetterWheel.FADE_DURATION));
        this.submitButtonIcon.runAction(new cc.FadeOut(LetterWheel.FADE_DURATION));
        this.submitButton.setEnabled(false);
        setTimeout(function () { this.shuffleButton.runAction(new cc.FadeIn(LetterWheel.FADE_DURATION)); this.shuffleButton.setEnabled(true); }.bind(this), LetterWheel.FADE_DURATION*1000);
    },

    setCirclePosition: function () {
        let angle = 2*Math.PI/this.letters.length;
        for (let i = 0; i < this.letters.length; i++) {
            let lb = this.letterbuttons[i];
            lb.setPosition(Math.floor(this.radius*(Math.sin(i*angle))), Math.floor(this.radius*(Math.cos(i*angle))));
        }
    },

    shuffle: function () {
        if (!this.active) return;
        this.active = false;
        let new_pos_arr = new Array(this.letterbuttons.length).fill(undefined);
        for (let i = 0; i < this.letterbuttons.length; i++) {
            let j = Math.floor(Math.random() * new_pos_arr.length);
            while (new_pos_arr[j] !== undefined) j = Math.floor(Math.random() * new_pos_arr.length);
            new_pos_arr[j] = i;
        }
        let angle = 2*Math.PI/this.letters.length;
        let new_arr = new Array(this.letterbuttons.length).fill();
        for (let i = 0; i < this.letterbuttons.length; i++) {
            let j = new_pos_arr[i];
            let lb = this.letterbuttons[i];
            let new_pos = {x: Math.floor(this.radius*(Math.sin(j*angle))), y: Math.floor(this.radius*(Math.cos(j*angle)))};
            lb.runAction(new cc.MoveTo(LetterWheel.MOVE_DURATION, new_pos.x, new_pos.y));
            new_arr[j] = lb;
        }
        setTimeout(function () { this.active = true; }.bind(this), LetterWheel.MOVE_DURATION*1000);
    },

    onLetterButtonClick: function (index) {
        if (!this.active) return;
        this.letterbuttons[index].selectionBox.setVisible(!this.letterbuttons[index].selectionBox.isVisible());
        if (this.letterbuttons[index].selectionBox.isVisible()) {
            this.onSelectLetter(this.letters[index]);
            this.selectedLetters.push(index);
            this.letterbuttons[index].runAction(new cc.ScaleTo(LetterWheel.BUTTON_SCALE_DURATION, LetterWheel.BUTTON_SCALE));
        }
        else {
            this.onDeselectLetter(this.selectedLetters.indexOf(index));
            this.selectedLetters = this.selectedLetters.filter(function (val) { return val != index; });
            this.letterbuttons[index].runAction(new cc.ScaleTo(LetterWheel.BUTTON_SCALE_DURATION, 1));
        }
        let selectedCount = this.selectedLetters.length;
        if (selectedCount > 0) {
            //TODO: animation
            this.shuffleButton.runAction(new cc.FadeOut(LetterWheel.FADE_DURATION));
            this.shuffleButton.setEnabled(false);
        }
        else {
            //TODO: animation
            this.shuffleButton.runAction(new cc.FadeIn(LetterWheel.FADE_DURATION));
            this.shuffleButton.setEnabled(true);
        }
        if (selectedCount >= 3) {
            //TODO: animation
            this.submitButton.runAction(new cc.FadeIn(LetterWheel.FADE_DURATION));
            this.submitButtonIcon.runAction(new cc.FadeIn(LetterWheel.FADE_DURATION));
            this.submitButton.setEnabled(true);
        }
        else {
            this.submitButton.runAction(new cc.FadeOut(LetterWheel.FADE_DURATION));
            this.submitButtonIcon.runAction(new cc.FadeOut(LetterWheel.FADE_DURATION));
            this.submitButton.setEnabled(false);
        }
    },
});

LetterWheel.MOVE_DURATION = 0.2;
LetterWheel.BUTTON_SCALE = 1.1;
LetterWheel.BUTTON_SCALE_DURATION = 0.04;
LetterWheel.APPEARING_DURATION = 100;

LetterWheel.FADE_DURATION = 0.1;
