import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGuestDTO } from 'src/guests/types/create-guest.dto';
import { Guest, SerializedGuest } from 'src/guests/types/guest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
  ) {}

  async create(createGuestDTO: CreateGuestDTO): Promise<SerializedGuest> {
    const newGuest = this.guestsRepository.create(createGuestDTO);

    // const guest = await this.guestsRepository.findOneBy({
    //   externalId: newGuest.externalId,
    // });

    return this.guestsRepository.save(new SerializedGuest(newGuest));
  }
}
