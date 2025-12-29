import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Controller({ path: 'venues', version: '1' })
export class VenuesController {
    constructor(private readonly venuesService: VenuesService) { }

    @Post()
    create(@Body() createVenueDto: CreateVenueDto) {
        return this.venuesService.createVenue(createVenueDto);
    }

}
