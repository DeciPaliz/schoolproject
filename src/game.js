var Game = function (difficulty) {
    this.generate(4, 5, 4);

    this.onFinish = function () {};
};

Game.prototype.generate = function (words_amount, letters_amount, max_len) {
    cc.loader.loadTxt(resources.words_popular, function (err, txt) {
        if (err) { console.log("unable to load " + resources.words_popular); console.log(err); return; }
        let word_list = txt.split("\n");

        /*let initial_word_index = Math.floor(Math.random() * (Game.WORDS_POPULAR_BOUNDS[initial_word_len][1] - Game.WORDS_POPULAR_BOUNDS[initial_word_len][0]) + Game.WORDS_POPULAR_BOUNDS[initial_word_len][0]);
        let initial_word = word_list[initial_word_index];
        let letters = initial_word.split("");
        let words = [];
        let diff_words = Array(initial_word_len+1).fill().map(function () { return []; }); // здесь несколько массивов, индекс соответствует количеству различных букв
        for (let i = initial_word_len; i > 1; i++) {
            for (let j = Game.WORDS_POPULAR_BOUNDS[i][0]; j < Game.WORDS_POPULAR_BOUNDS[i][1]; j++) {
                if (j == initial_word_index) continue;
                diff_words[this.getWordsDiff(initial_word, word_list[j]).length].push(word_list[j]);
            }
            if (diff_words[0].length >= words) {
                
            }
        }*/

        let letters = [];
        let words = [];
        for (;;) {
            letters = [];
            words = [];
            for (let i = 0; i < letters_amount; i++) {
                //let random_letter = Game.LETTERS[Math.floor(Math.random() * Game.LETTERS.length)];
                let random_letter = this.getRandomLetter();
                letters.push(random_letter);
            }

            for (let i = Game.WORDS_POPULAR_BOUNDS[letters_amount][1]; i >= Game.WORDS_POPULAR_BOUNDS[3][0]; i--) {
                let word = word_list[i];
                if (this.doesWordConsistOf(word, letters))
                    words.push(word);
            }

            if (words.length >= words_amount) {
                this.words = new Array(words_amount).fill();
                let i = 0;
                for (let word of words) {
                    if (i >= words_amount) break;
                    if (word.length <= max_len) {
                        this.words[i] = word;
                        i++;
                    }
                }
                if (i >= words_amount) {
                    this.possible_words = words.filter(function (val) { return this.words.indexOf(val) == -1; }.bind(this));
                    break;
                }
            }
        }
        this.letters = Array(letters_amount).fill().map(function (_, i) { return letters[i]; });
        console.log(this.words);
        console.log(this.possible_words);
        console.log(this.letters);

        this.solved = [];
    }.bind(this));
};

Game.prototype.getRandomLetter = function () {
    let i = Math.floor(Math.random() * Game.LETTERS_PROBABILITIES_SUM);
    for (let j = 0; j < Game.LETTERS_PROBABILITIES.length; j++) {
        if (i < Game.LETTERS_PROBABILITIES[j]) return Game.LETTERS[j];
    }
}

// данная функция возвращает true если данное слово можно составить из этих букв
Game.prototype.doesWordConsistOf = function (word, letters) {
    letters_arr = Array(letters.length).fill().map(function (_, i) { return letters[i]; });
    word_arr = word.split("");
    for (let letter of word_arr) {
        if (letters_arr.indexOf(letter) == -1) return false;
        delete letters_arr[letters_arr.indexOf(letter)];
    }
    return true;
};

Game.WORD_FLAG = {
    NONE: 0,
    SUCCESS: 1,
    POSSIBLE: 2,
    ALREADY_SOLVED: 3
};

Game.prototype.checkWord = function (letters) {
    let word = letters.reduce(function (total, l) { return total + l; }, '');
    if (this.solved.indexOf(word) != -1) {
        console.log("already solved: " + word);
        return {flag: Game.ALREADY_SOLVED}
    }
    else if (this.words.indexOf(word) != -1) {
        console.log("success: " + word);
        this.solved.push(word);
        if (this.words.reduce(function (flag, val) { 
            if (!flag) return false;
            if (this.solved.indexOf(val) === -1) return false;
            return true;
        }.bind(this), true))
            this.onFinish();
        return {flag: Game.WORD_FLAG.SUCCESS, index: this.words.indexOf(word)};
    }
    else if (this.possible_words.indexOf(word) != -1) {
        console.log("possible: " + word);
        return {flag: Game.WORD_FLAG.POSSIBLE, index: this.possible_words.indexOf(word)};
    }
    else {
        console.log("failure: " + word);
        return {flag: Game.WORD_FLAG.NONE};
    }
}

// здесь индекс соответствует количеству букв в слове, массив - границы возможных значений индекса в списке слов
Game.WORDS_POPULAR_BOUNDS = [
    [-1, -1],
    [-1, -1],
    [0, 53],
    [53, 283],
    [283, 1042],
    [1042, 2446],
    [2446, 4168],
    [4168, 6095],
    [6095, 8086],
    [8086, 9824],
    [9824, 9829],
    [9829, 9832]
];

// массив букв русского алфавита
Game.LETTERS = [ 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я' ];

// чарт вероятности букв
// взято на основе слов в ru_popular.txt
Game.LETTERS_PROBABILITIES = [
    7043,
    8368,
    10320,
    11500,
    13309,
    18385,
    18594,
    19196,
    20470,
    25345,
    25689,
    29689,
    32702,
    34460,
    38516,
    44428,
    46721,
    51144,
    54310,
    58268,
    60019,
    60488,
    60962,
    61640,
    62375,
    62971,
    63235,
    63258,
    63739,
    64948,
    65113,
    65327,
    66339
];
Game.LETTERS_PROBABILITIES_SUM = 66339;
