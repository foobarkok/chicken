const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const convertButton = document.getElementById('convertButton');

function textToMorseList(text) {
    // 1. モールス符号のマッピング辞書（欧文・和文・数字）
    const morseMap = {
        // アルファベット (A-Z)
        'A': '・ー', 'B': 'ー・・・', 'C': 'ー・ー・', 'D': 'ー・・', 'E': '・', 
        'F': '・・ー・', 'G': 'ーー・', 'H': '・・・・', 'I': '・・', 'J': '・ーーー', 
        'K': 'ー・ー', 'L': '・ー・・', 'M': 'ーー', 'N': 'ー・', 'O': 'ーーー', 
        'P': '・ーー・', 'Q': 'ーー・ー', 'R': '・ー・', 'S': '・・・', 'T': 'ー', 
        'U': '・・ー', 'V': '・・・ー', 'W': '・ーー', 'X': 'ー・・ー', 'Y': 'ー・ーー', 'Z': 'ーー・・',
        
        // 数字 (0-9)
        '1': '・ーーーー', '2': '・・ーーー', '3': '・・・ーー', '4': '・・・・ー', '5': '・・・・・',
        '6': 'ー・・・・', '7': 'ーー・・・', '8': 'ーーー・・', '9': 'ーーーー・', '0': 'ーーーーー',

        // 和文カタカナ（あ行〜わ行）
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
        
        // 和文記号
        'ー': '・ーー・ー', '、': '・ー・ー・ー', '。': '・ー・ー・・',
        '゛': '・・', '゜': '・・ーー・' // 濁点・半濁点
    };

    // 2. 文字列を半角・全角スペースで分割（連続するスペースは1つにまとめる）
    // filter(Boolean) で空の要素（連続スペースによるもの）を除外します
    const words = text.split(/[\s\u3000]+/).filter(Boolean);

    // 3. 各単語をモールス信号に変換する内部関数
    const convertWord = (word) => {
        // アルファベットを大文字に、ひらがなをカタカナに変換
        let normalized = word.toUpperCase();
        normalized = normalized.replace(/[\u3041-\u3096]/g, match => 
            String.fromCharCode(match.charCodeAt(0) + 0x60)
        );
        // 濁点・半濁点を「カ＋゛」のように分離独立させる
        normalized = normalized.normalize('NFD');

        const morseChars = [];
        for (const char of normalized) {
            if (morseMap[char]) {
                morseChars.push(morseMap[char]);
            } else {
                // 辞書にない文字（記号など）はそのまま残す
                morseChars.push(char);
            }
        }
        // 1つの単語内は、文字ごとに半角スペース1つで区切る（一般的なモールスの表記規則）
        return morseChars.join(' ');
    };

    // 4. 分割されたすべての単語を変換して配列で返す
    return words.map(convertWord);
}

function randomChoice(txt) {
    return txt[Math.floor(Math.random() * txt.length)];
}

function morseToChicken(morseList) {
    let chickenList = [];
    morseList = morseList.forEach(morse => {
        for (const char of morse) {
            if (char === '・') {
                chickenList.push(randomChoice(['コ', 'ケ', 'ケッw']));
            }else if (char === 'ー') {
                chickenList.push(randomChoice(['コー', 'ケー', 'ケーッw']));
            }
        }
        if(chickenList[chickenList.length - 1].endsWith('w')) {
            chickenList.push('  ');
        }else{
            chickenList.push('ッ  ');
        }
    });
    return chickenList.join('');
}

function convertString(value) {
	const morseList = textToMorseList(value);
    return morseToChicken(morseList);
}

function applyConversion() {
	outputText.value = convertString(inputText.value);
}

convertButton.addEventListener('click', applyConversion);
