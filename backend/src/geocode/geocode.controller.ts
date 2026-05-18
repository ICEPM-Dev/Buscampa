import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('geocode')
export class GeocodeController {
  @Get('search')
  async search(@Query('q') query: string, @Query('limit') limit = '5') {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            format: 'json',
            q: query,
            limit: parseInt(limit),
            countrycodes: 'ar',
          },
          headers: {
            'User-Agent': 'Buscampa/1.0',
          },
        },
      );

      return response.data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (error) {
      return [];
    }
  }

  @Get()
  async geocode(@Query('address') address: string) {
    if (!address) {
      return { error: 'Address is required' };
    }

    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            format: 'json',
            q: address,
            limit: 1,
            countrycodes: 'ar',
          },
          headers: {
            'User-Agent': 'Buscampa/1.0',
          },
        },
      );

      const data = response.data;

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name,
        };
      }

      return { error: 'Location not found' };
    } catch (error) {
      return { error: 'Failed to geocode address' };
    }
  }
}