import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from 'src/guests/types/guest.entity';
import { Repository } from 'typeorm';
import { ImportedGuest } from 'src/guests/types/guest-import.interface';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}
  async importCSV(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const requiredHeaders = ['id', 'room', 'guest_name'];

    const filePath = file.path;

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath).pipe(csv());

      stream.once('headers', (headers: string[]) => {
        const hasAllHeaders = requiredHeaders.every((header) =>
          headers.includes(header),
        );
        const noExtraHeaders = headers.every((header) =>
          requiredHeaders.includes(header),
        );

        if (!hasAllHeaders || !noExtraHeaders) {
          stream.destroy();

          return reject(
            new BadRequestException(
              `CSV must contain exactly these headers: ${requiredHeaders.join(', ')}`,
            ),
          );
        }
      });

      stream.on('data', (row: ImportedGuest) => {
        stream.pause();

        void (async () => {
          try {
            const existing = await this.guestRepository.findOne({
              where: { externalId: +row.id },
              withDeleted: true,
            });

            if (existing) {
              await this.guestRepository.save({
                ...existing,
                name: row.guest_name,
                room: row.room,
              });
            } else {
              await this.guestRepository.save({
                externalId: +row.id,
                name: row.guest_name,
                room: row.room,
              });
            }
          } catch (error) {
            console.error('Manual upsert failed:', error);
          } finally {
            stream.resume();
          }
        })();
      });

      stream.on('end', () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(
              new InternalServerErrorException(`Failed to process CSV cleanup`),
            );
          } else {
            resolve('CSV file uploaded and validated successfully.');
          }
        });
      });

      stream.on('error', (err) => {
        reject(
          new BadRequestException(`Failed to process CSV: ${err.message}`),
        );
      });
    });
  }
}
