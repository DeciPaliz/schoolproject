var Scene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.game = new Game();

        this.addBackground();
    },

    addBackground: function() {
        let background = new cc.Sprite(resources["level_bg" + Math.ceil(Math.random() * Scene.BACKGROUNDS_AMOUNT)]);
        background.setScale(Math.max(this.width / background.width, this.height / background.height));
        background.setPosition(this.width / 2, this.height / 2);
        background.setLocalZOrder(-1);
        this.addChild(background);
    },

});

Scene.BACKGROUNDS_AMOUNT = 3;
