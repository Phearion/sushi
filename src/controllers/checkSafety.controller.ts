import {
    Controller,
    Res,
    HttpStatus,
    HttpException,
    Post,
    Body,
} from '@nestjs/common';
import { execSync } from 'child_process';
import * as path from 'path';

@Controller('checkRequest')
export class CheckSafetyController {
    @Post()
    async checkRequest(
        @Body('data') data: Record<string, string>,
        @Res() res,
    ): Promise<void> {
        const request = data.request;
        console.log(request);
        try {
            const modelPath = path.join(
                __dirname,
                '../model/sql_injection_model.pickle',
            );
            const pythonScriptPath = path.join(
                __dirname,
                '../model/sql_injection_detector.py',
            );

            const result = execSync(
                `python "${pythonScriptPath}" "${modelPath}" "${request}"`,
            ).toString();

            if (result.trim() === '1') {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'SQL Injection detected',
                });
            } else if (request.includes('existingRequest')) {
                res.status(HttpStatus.OK).json({ message: 'Request exists' });
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
