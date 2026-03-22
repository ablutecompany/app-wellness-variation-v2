import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/measurements')
export class MeasurementController {
  constructor(private measurementService: MeasurementService) {}

  @Post('ingest')
  async ingest(@Body() body: any) {
    // In a real app, we'd get userId from JWT
    return this.measurementService.ingest(body.userId, body);
  }

  @Get('biomarkers/latest')
  async getLatest(@Body() body: any) {
    return this.measurementService.getLatestBiomarkers(body.userId);
  }
}
