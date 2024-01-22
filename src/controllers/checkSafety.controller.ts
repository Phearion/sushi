import {
    Controller,
    Res,
    HttpStatus,
    HttpException,
    Post,
    Body,
} from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Controller('checkRequest')
export class CheckSafetyController {
    @Post()
    async checkRequest(
        @Body('data') data: Record<string, string>,
        @Res() res,
    ): Promise<void> {
        const request = data.request;
        //console.log(request);
        try {
            const pythonScriptPath = path.resolve(
                __dirname,
                '../model/sql_injection_detector.py',
            );

            const result = await new Promise<string>((resolve, reject) => {
                let result = '';
                console.log("Requête en cours d'analyse:", request);
                const process = spawn('python', [pythonScriptPath, request]);
                process.stdout.on('data', (data) => {
                    let output = data.toString();
                    if (output.includes('Prediction:')) {
                        output = output.match(/\[(.*)\]/)[0];
                        result += output;
                    }
                });
                process.on('error', (error) => {
                    reject(error);
                });

                process.on('exit', () => {
                    console.log(`stdout: ${result}`);
                    resolve(result);
                });

                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(`Python script exited with code ${code}`);
                    } else {
                        console.log(`stdout: ${result}`);
                        resolve(result);
                    }
                });
            });

            // try to convert the array string to an array
            let resultArray = [];
            try {
                resultArray = JSON.parse(result.trim());
            } catch (error) {
                console.error('Error parsing result:', error);
                new HttpException(
                    'Error processing the request',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            if (resultArray[0] > 0.5) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'SQL Injection detected',
                });
            } else {
                res.status(HttpStatus.OK).json({
                    message: 'All good',
                });
            }
        } catch (error) {
            console.error('Error checking request:', error);
            throw new HttpException(
                'Error processing the request',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
