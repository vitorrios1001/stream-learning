# Stream Data Processing Example

This project demonstrates the use of Node.js streams to process large amounts of data efficiently. It includes an example of reading a large text file, transforming its contents, and writing the transformed data to a new file.

## Table of Contents

- [Stream Data Processing Example](#stream-data-processing-example)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Generating Test Data](#generating-test-data)
  - [Running the Example](#running-the-example)
  - [How It Works](#how-it-works)
  - [Benefits of Using Streams](#benefits-of-using-streams)
  - [Article](#article)

## Introduction

Streams in Node.js allow for efficient data processing by handling data in chunks rather than loading the entire data set into memory. This project showcases the benefits of using streams for large file transformations.

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Python (for generating test data)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/vitorrios1001/stream-learning.git
   cd stream-learning
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Generating Test Data

Before running the example, you need to generate a large text file. You can use the provided Python script to create a 10GB file.

1. Run the Python script:

   ```bash
   python3 generator.py
   ```

   This will create a file named `large-input.txt` in the project directory.

## Running the Example

Once you have generated the test data, you can run the Node.js script to process the file.

1. Run the Node.js script:

  ```bash
  node src/index.js
  ```

   This script reads the `large-input.txt` file, converts its contents to uppercase, and writes the transformed data to `large-output.txt`.

## How It Works

The Node.js script uses the following components:

- **Readable Stream**: Reads data from the input file in chunks.
- **Transform Stream**: Converts each chunk of data to uppercase.
- **Writable Stream**: Writes the transformed data to the output file.

The script also tracks the progress of the transformation, logging updates every 10% and displaying the total time taken at the end.

```javascript
// src/index.js

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
              `Progresso: ${Math.floor(progress)}%, Linhas processadas: ${processedLines}`
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
```

## Benefits of Using Streams

1. **Memory Efficiency**: Streams process data in chunks, which avoids loading the entire file into memory. This is crucial for large files, preventing memory overflow and improving performance.
2. **Real-Time Data Processing**: Streams allow continuous data processing, starting to process the first chunks of data while still receiving the next ones. This reduces the total processing time.
3. **Maintaining Responsiveness**: By not blocking the Node.js Event Loop, streams help keep the application responsive even during intensive I/O operations.

## Article

To more details, take a look on [article](https://dev.to/vitorrios1001/beneficios-do-uso-de-streams-em-nodejs-3o50)

