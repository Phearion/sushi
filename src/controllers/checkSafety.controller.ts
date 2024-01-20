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
                console.log(request);
                const process = spawn('python', [pythonScriptPath, request]);
                process.stdout.on('data', (data) => {
                    result += data.toString();
                });
                process.on('error', (error) => {
                    reject(error);
                });

                process.on('exit', () => {
                    console.log(`stdout: ${result}`);
                    //console.log(result.trim()[result.trim().length - 8]);
                });
            });

            if (result.trim()[result.trim().length - 8] > '5') {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'SQL Injection detected',
                });
            } else if (request.includes('existingRequest')) {
                res.status(HttpStatus.OK).json({
                    message: 'Request exists',
                });
            } else {
                res.status(HttpStatus.NOT_FOUND).json({
                    message: "Request doesn't exist",
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
