const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const convertButton = document.getElementById('convertButton');

const chickenInput = document.getElementById('chickenInput');
const reverseOutput = document.getElementById('reverseOutput');
const reverseButton = document.getElementById('reverseButton');

const MORSE_MAP = {
    'A': '・ー', 'B': 'ー・・・', 'C': 'ー・ー・', 'D': 'ー・・', 'E': '・',
    'F': '・・ー・', 'G': 'ーー・', 'H': '・・・・', 'I': '・・', 'J': '・ーーー',
    'K': 'ー・ー', 'L': '・ー・・', 'M': 'ーー', 'N': 'ー・', 'O': 'ーーー',
    'P': '・ーー・', 'Q': 'ーー・ー', 'R': '・ー・', 'S': '・・・', 'T': 'ー',
    'U': '・・ー', 'V': '・・・ー', 'W': '・ーー', 'X': 'ー・・ー', 'Y': 'ー・ーー', 'Z': 'ーー・・',
    '1': '・ーーーー', '2': '・・ーーー', '3': '・・・ーー', '4': '・・・・ー', '5': '・・・・・',
    '6': 'ー・・・・', '7': 'ーー・・・', '8': 'ーーー・・', '9': 'ーーーー・', '0': 'ーーーーー',
    'ア': 'ーー・ーー', 'イ': '・ー・', 'ウ': '・・ー', 'エ': 'ーー・ー・', 'オ': '・ー・・ー',
    'カ': '・ーー・', 'キ': 'ー・ー・・', 'ク': '・・・ー', 'ケ': 'ーー・ー', 'コ': 'ーーーー',
    'サ': 'ー・ー・ー', 'シ': 'ーー・ー・', 'ス': 'ーーー・ー', 'セ': '・ーーー・', 'ソ': 'ーーー・',
    'タ': 'ー・', 'チ': '・・ー・', 'ツ': '・ーー・ー', 'テ': '・ー・ーー', 'ト': '・・ー・・',
    'ナ': '・ー・', 'ニ': 'ー・ー・', 'ヌ': '・・・・', 'ネ': 'ーー・ー', 'ノ': '・・ーー',
    'ハ': 'ーー・・・', 'ヒ': 'ーー・・ー', 'フ': 'ーー・・', 'ヘ': '・', 'ホ': 'ー・・',
    'マ': 'ー・・ー', 'ミ': '・・ー・ー', 'ム': 'ー', 'メ': 'ー・・・ー', 'モ': 'ー・・ー・',
    'ヤ': '・ーー', 'ユ': 'ー・・ーー', 'ヨ': 'ーー',
    'ラ': '・・・', 'リ': 'ーー・', 'ル': 'ー・ーー・', 'レ': 'ーーー', 'ロ': '・ー・・',
    'ワ': 'ー・', 'ヲ': '・ーーー', 'ン': '・ー・ー・',
    'ー': '・ーー・ー', '、': '・ー・ー・ー', '。': '・ー・ー・・',
    '゛': '・・', '゜': '・・ーー・'
};
// 逆引きテーブル一覧（同じモールスに複数の文字が割り当てられる）
const MORSE_TO_ALL = {};
for (const [char, morse] of Object.entries(MORSE_MAP)) {
    if (!MORSE_TO_ALL[morse]) MORSE_TO_ALL[morse] = [];
    MORSE_TO_ALL[morse].push(char);
}

// デフォルトで英数字優先のマップ（既存の互換性保持）
const MORSE_TO_CHAR = {};
for (const [morse, chars] of Object.entries(MORSE_TO_ALL)) {
    // 英数字があればそれを優先
    const ascii = chars.find(c => /^[A-Z0-9]$/.test(c));
    MORSE_TO_CHAR[morse] = ascii || chars[0];
}

// 日本語優先マップ（カタカナなど日本語文字を優先）
const MORSE_TO_CHAR_JP = {};
for (const [morse, chars] of Object.entries(MORSE_TO_ALL)) {
    const jp = chars.find(c => !/^[A-Z0-9]$/.test(c));
    MORSE_TO_CHAR_JP[morse] = jp || chars[0];
}

function textToMorseList(text) {
    const words = text.trim().split(' ').filter(Boolean);

    const convertWord = (word) => {
        let normalized = word.toUpperCase();
        normalized = normalized.replace(/[\u3041-\u3096]/g, match => 
            String.fromCharCode(match.charCodeAt(0) + 0x60)
        );
        normalized = normalized.normalize('NFD');

        const morseChars = [];
        for (const char of normalized) {
            if (MORSE_MAP[char]) {
                morseChars.push(MORSE_MAP[char]);
            } else {
                morseChars.push(char);
            }
        }
        return morseChars.join(' ');
    };

    return words.map(convertWord);
}

function randomChoice(txt) {
    return txt[Math.floor(Math.random() * txt.length)];
}

function morseToChicken(morseList) {
    const chickenList = [];
    for (const morseWord of morseList) {
        const letters = morseWord.split(' ').filter(Boolean);
        for (const symbol of letters) {
            // symbol は "・ー" のような複数文字列になるので、各文字ごとに処理する
            for (const char of symbol) {
                if (char === '・') {
                    chickenList.push(randomChoice(['コ', 'ケ', 'ケッw']));
                } else if (char === 'ー') {
                    chickenList.push(randomChoice(['コー', 'ケー', 'ケーッw']));
                } else {
                    chickenList.push(char);
                }
            }
            // 各文字（モールス1文字分）の終わりに小文字のッを挿入して区切る
            chickenList.push('ッ');
        }
        // 単語の終わりは半角スペースで区切る
        chickenList.push(' ');
    }
    return chickenList.join('');
}

function convertString(value) {
    const morseList = textToMorseList(value);
    return morseToChicken(morseList);
}

function morseListToText(morseList, mode = 'en') {
    const table = mode === 'jp' ? MORSE_TO_CHAR_JP : MORSE_TO_CHAR;
    const words = morseList.map(morseWord => {
        const letters = morseWord.split(' ').filter(Boolean);
        const chars = letters.map(sym => table[sym] || sym);
        return chars.join('');
    });
    return words.join(' ');
}

function chickenToMorse(chicken) {
    if (!chicken) return [];
    // 単語の区切りは半角スペースで判定する
    const words = chicken.trim().split(' ').filter(Boolean);
    const morseWords = words.map(w => {
        const morseChars = [];
        let currentLetter = '';
        for (let i = 0; i < w.length; i++) {
            const ch = w[i];
            if (ch === 'w' || ch === ' ') continue;
            if (ch === 'ッ') {
                // トークン内の "ケッw" のようなパターンでは最初の 'ッ' は内部文字なのでスキップする
                if (i + 1 < w.length && w[i + 1] === 'w') {
                    // 'ッ' と続く 'w' を消費してトークン継続
                    i++; // skip the 'w'
                    continue;
                }
                if (currentLetter) {
                    morseChars.push(currentLetter);
                    currentLetter = '';
                }
                continue;
            }
            // 伸ばし棒が文字として現れる場合（まれ）
            if (ch === 'ー') {
                currentLetter += 'ー';
                continue;
            }
            // カタカナまたは英数字はドットまたはダッシュのトークン
            if (/[\u30A0-\u30FFA-Za-z0-9]/.test(ch)) {
                // 次の文字が伸ばし棒ならこのトークンはダッシュ相当
                if (i + 1 < w.length && w[i + 1] === 'ー') {
                    currentLetter += 'ー';
                    i++; // 伸ばし棒をスキップ
                } else {
                    currentLetter += '・';
                }
            }
        }
        if (currentLetter) morseChars.push(currentLetter);
        return morseChars.join(' ');
    });
    return morseWords;
}

function applyConversion() {
    outputText.value = convertString(inputText.value);
}

function applyReverseConversion(mode = 'en') {
    const morseList = chickenToMorse(chickenInput.value);
    reverseOutput.value = morseListToText(morseList, mode);
}

convertButton.addEventListener('click', applyConversion);
const reverseButtonJP = document.getElementById('reverseButtonJP');
const reverseButtonEN = document.getElementById('reverseButtonEN');

reverseButtonJP.addEventListener('click', () => applyReverseConversion('jp'));
reverseButtonEN.addEventListener('click', () => applyReverseConversion('en'));
