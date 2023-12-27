const fs = require('fs');
const path = require('path');

// Path to the file
const filePath = path.join(
    'node_modules',
    '@gradio',
    'client',
    'dist',
    'index.js',
);

fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    // Replace the target string
    const result = data.replace(
        /new EventSource\(url\)/g,
        'new EventSource(url.toString())',
    );

    fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('File updated successfully.');
    });
});
