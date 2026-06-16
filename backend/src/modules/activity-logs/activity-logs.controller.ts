import { Controller, Get } from '@nestjs/common';
import { CurrentUser, AuthUser } from '../../shared/decorators/current-user.decorator';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly logs: ActivityLogsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.logs.findAll(user.sub);
  }
}
