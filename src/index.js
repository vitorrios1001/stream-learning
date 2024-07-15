const fs = require('fs');
const { Transform } = require('stream');
const { performance } = require('perf_hooks');

// Caminho para o arquivo de entrada e saída
const inputFile = 'large-input.txt';
const outputFile = 'large-output.txt';

// Cria um Readable Stream a partir do arquivo de entrada
const readableStream = fs.createReadStream(inputFile, { encoding: 'utf8' });

// Cria um Writable Stream para o arquivo de saída
const writableStream = fs.createWriteStream(outputFile);

// Variáveis para rastreamento de progresso
let totalSize = 0;
let processedSize = 0;
let lastLoggedProgress = 0;
const startTime = performance.now();
let lineCount = 0;
let processedLines = 0;

fs.stat(inputFile, (err, stats) => {
  if (err) {
    console.error('Erro ao obter informações do arquivo:', err);
    return;
  }
  totalSize = stats.size;

  // Pipe o Readable Stream para o Transform Stream e depois para o Writable Stream
  readableStream
    .pipe(
      new Transform({
        transform(chunk, encoding, callback) {
          processedSize += chunk.length;
          processedLines += chunk.toString().split('\n').length - 1;

          // Converte o chunk de dados para letras maiúsculas
          const upperCaseChunk = chunk.toString().toUpperCase();

          // Chama o callback com o chunk transformado
          callback(null, upperCaseChunk);

          // Log de progresso
          const progress = (processedSize / totalSize) * 100;

          if (progress >= lastLoggedProgress + 10) {
            console.log(
              `Progresso: ${Math.floor(
                progress
              )}%, Linhas processadas: ${processedLines}`
            );
            lastLoggedProgress = Math.floor(progress);
          }
        },
      })
    )
    .pipe(writableStream)
    .on('finish', () => {
      const endTime = performance.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      console.log('Transformação completa e arquivo salvo.');
      console.log(`Total de linhas processadas: ${processedLines}`);
      console.log(`Tempo total: ${timeTaken} segundos`);
    })
    .on('error', (err) => {
      console.error('Erro durante a transformação:', err);
    });
});
