// CREATE LARGE FILE
// echo "This is a line in the large file." > largefile.txt
// for i in {1..1000000}; do echo "This is another line in the large file." >> largefile.txt; done

// processFile.mjs or processFile.js (if package.json is set to "type": "module")
// npm init && npm install stream
import fs from 'fs';
import { Transform } from 'stream';

// Create a readable stream from the input file
const readStream = fs.createReadStream('largefile.txt', { encoding: 'utf8' });

// Create a writable stream to the output file
const writeStream = fs.createWriteStream('processedfile.txt');

// Create a transform stream to process the data
const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        // Convert chunk to string (if it's not already)
        const chunkString = chunk.toString();

        // Process the chunk of data
        const processedChunk = chunkString.toUpperCase(); // Convert to uppercase

        // Pass the processed data to the next stream
        callback(null, processedChunk);
    }
});

// Handle errors
readStream.on('error', (error) => {
    console.error('Error reading the file:', error);
});

writeStream.on('error', (error) => {
    console.error('Error writing the file:', error);
});

transformStream.on('error', (error) => {
    console.error('Error transforming the data:', error);
});

// Pipe the read stream into the transform stream and then into the write stream
readStream.pipe(transformStream).pipe(writeStream);

// Handle the end of the process
writeStream.on('finish', () => {
    console.log('File processing completed successfully.');
});
