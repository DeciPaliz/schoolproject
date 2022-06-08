var LetterWheel = cc.Node.extend({
    ctor: function (letters, radius) {
        this._super();

        this.letters = letters;
        this.radius = radius;
        this.letterbuttons = new Array(this.letters.length).fill();
        for (let i = 0; i < this.letters.length; i++)
            this.letterbuttons[i] = new LetterButton(this.letters[i]);
        for (let lb of this.letterbuttons)
            this.addChild(lb);
        this.setCirclePosition();
    },

    setCirclePosition: function () {
        let angle = 2*Math.PI/this.letters.length;
        for (let i = 0; i < this.letters.length; i++) {
            let lb = this.letterbuttons[i];
            lb.setPosition(this.x + Math.floor(this.radius*(Math.sin(i*angle))), this.y + Math.floor(this.radius*(Math.cos(i*angle))));
        }
    },
});
