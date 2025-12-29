import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { BaseCRUDService } from '../../shared/services/base-crud.service';
import { MODEL_NAME } from '../../shared/constants/model.name.enum';
import { HttpResponse } from '../../shared/interfaces';

@Injectable()
export class VenuesService extends BaseCRUDService {
  constructor() {
    super({ model: MODEL_NAME.VENUES });
  }

  async createVenue(
    createVenueDto: CreateVenueDto,
    isSuggested: boolean = true,
  ): Promise<HttpResponse> {
    console.log(createVenueDto);
    const newVenue = await this.create({
      ...createVenueDto,
    });
    console.log(newVenue);
    return {
      code: 200,
      data: newVenue,
      message: 'Create venue successfully',
    };
  }
}
