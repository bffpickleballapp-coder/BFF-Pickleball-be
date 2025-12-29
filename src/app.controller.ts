import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpResponse } from './shared/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { sendMailAsync } from './shared/util/send-mail';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('check-app')
  public async checkApp(): Promise<HttpResponse> {
    return this.appService.checkApp();
  }

  @Post('upload-img')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImg(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<HttpResponse> {
    return this.appService.uploadImg(file);
  }

  @Post('send-mail')
  public async sendMail(
    @Body() body: { to: string; subject: string; text: string },
  ): Promise<HttpResponse> {
    return await sendMailAsync(body.to, body.subject, body.text);
  }
}
