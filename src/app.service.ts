import { Injectable } from '@nestjs/common';
import { HttpResponse } from 'src/shared/interfaces';
import { uploadImgService } from './shared/util/upload-img';

@Injectable()
export class AppService extends uploadImgService {
  checkApp(): HttpResponse {
    return {
      success: true,
      code: 200,
      data: {},
    };
  }

  async uploadImg(file: Express.Multer.File): Promise<HttpResponse> {
    const result = await this.uploadImage(file, 'common');
    if (result.url) {
      return {
        success: true,
        code: 200,
        data: result,
      };
    } else {
      return {
        success: false,
        code: 400,
        data: {
          message: 'Failed to upload image',
        },
      };
    }
  }
}
