import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JournalDto } from './dto';
import { JournalService } from './journal.service';

@Controller('journal')
export class JournalController {
  constructor(private readonly journal: JournalService) {}

  @Get() findAll(@CurrentUser() user: AuthUser, @Query('search') search?: string) { return this.journal.findAll(user.sub, search); }
  @Post() create(@CurrentUser() user: AuthUser, @Body() dto: JournalDto) { return this.journal.create(user.sub, dto); }
  @Get(':id') findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.journal.findOne(user.sub, id); }
  @Patch(':id') update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: JournalDto) { return this.journal.update(user.sub, id, dto); }
  @Delete(':id') remove(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.journal.remove(user.sub, id); }
}
