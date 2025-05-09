// import required decorators and libraries
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from 'src/guests/services/upload/upload.service';

@Controller('guests/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './guests-imports',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          callback(
            null,

            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.csv$/)) {
          return callback(
            new BadRequestException('Only .csv files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadCSV(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.uploadService.importCSV(file);
  }
}
