import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}

  @Get()
  events(@CurrentUser() user: AuthUser, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (!startDate || !endDate) throw new BadRequestException('startDate and endDate are required');
    return this.calendar.events(user.sub, startDate, endDate);
  }
}
