const fs = require('fs');
const readline = require('readline');

const INPUT_FILE_PATH = '1TB.txt';
const OUTPUT_FILE_PATH = 'sorted.txt';
const MAX_MEMORY = 500 * 1024 * 1024;

let fileStream = fs.createReadStream(INPUT_FILE_PATH);
let input = readline.createInterface({ input: fileStream });

let buffer = [];
let bufferSize = 0;

fs.writeFile(OUTPUT_FILE_PATH, '', (err) => {
    if (err) {
        console.error('Ошибка при очистке файла:', err);
    } else {
        console.log('Файл '+ OUTPUT_FILE_PATH +' очищен.');
    }
});

input.on('line', (line) => {
    let lineSize = Buffer.byteLength(line);
    if (bufferSize + lineSize <= MAX_MEMORY) {
        buffer.push(line);
        bufferSize += lineSize;
    } else {
        flushBuffer();
        buffer.push(line);
        bufferSize = lineSize;
    }
});

input.on('close', () => {
    flushBuffer();
    console.log('Файл ' + INPUT_FILE_PATH + ' отсортирован');
});

function flushBuffer() {
    buffer.sort();
    let output = fs.createWriteStream(OUTPUT_FILE_PATH, { flags: 'a' });
    buffer.forEach((line) => {
        output.write(line + '\n');
    });
    buffer = [];
    bufferSize = 0;
}