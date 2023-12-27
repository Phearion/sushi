// create a script that moves the model folder to dist/

const fs = require('fs-extra');
const path = require('path');

const moveModel = () => {
    fs.copySync(
        path.resolve(__dirname, './src/model'),
        path.resolve(__dirname, './dist/model'),
    );
};

moveModel();
