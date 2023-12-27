import * as fs from 'fs';
import * as path from 'path';

export const getFiles = async (
    prediction: string,
): Promise<{ name: string; data: string }[] | string> => {
    // Extract the first JSON object from the prediction string
    console.log(prediction);
    const start = prediction.indexOf('{');
    const end = prediction.indexOf('}') + 1;
    const jsonStr = prediction.slice(start, end);

    // Parse the JSON string to an object
    const jsonObj = JSON.parse(jsonStr);

    // Extract the "subject" and "topic" keys
    const subject = jsonObj['subject'];
    const topic = jsonObj['topic'];
    console.log(subject, topic);

    // Construct the path to the directory
    const dirPath = path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'aero1Sources',
        subject,
        'fiche',
        topic,
    );
    console.log(dirPath);

    // Check if the directory exists
    if (!fs.existsSync(dirPath)) {
        return 'No resources found for this';
    }

    // Get an array of filenames in the directory
    const fileNames = fs.readdirSync(dirPath);

    // Read each file and convert it to a base64 string
    const files = fileNames.map((fileName) => {
        const filePath = path.join(dirPath, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const fileBase64 = fileBuffer.toString('base64');
        return { name: fileName, data: fileBase64 };
    });

    // Return the array of file objects
    return files;
};
