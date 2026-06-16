import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CommentDto, CreateTaskDto, MoveTaskDto, SubtaskDto, UpdateTaskDto } from './dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.tasks.findAll(user.sub);
  }

  @Get('kanban')
  kanban(@CurrentUser() user: AuthUser) {
    return this.tasks.kanban(user.sub);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateTaskDto) {
    return this.tasks.create(user.sub, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.tasks.findOne(user.sub, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.tasks.remove(user.sub, id);
  }

  @Patch(':id/move')
  move(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: MoveTaskDto) {
    return this.tasks.move(user.sub, id, dto);
  }

  @Post(':id/subtasks')
  addSubtask(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: SubtaskDto) {
    return this.tasks.addSubtask(user.sub, id, dto);
  }

  @Patch(':id/subtasks/:subtaskId')
  updateSubtask(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('subtaskId') subtaskId: string, @Body() dto: SubtaskDto) {
    return this.tasks.updateSubtask(user.sub, id, subtaskId, dto);
  }

  @Delete(':id/subtasks/:subtaskId')
  deleteSubtask(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('subtaskId') subtaskId: string) {
    return this.tasks.deleteSubtask(user.sub, id, subtaskId);
  }

  @Post(':id/comments')
  addComment(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: CommentDto) {
    return this.tasks.addComment(user.sub, id, dto);
  }

  @Get(':id/comments')
  comments(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.tasks.comments(user.sub, id);
  }
}
