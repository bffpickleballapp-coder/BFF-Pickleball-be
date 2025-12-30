import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import * as path from 'path';
import e from 'express';

export interface fileObject {
  name: string;
  type: string;
}
export interface uploadImgResponse {
  url: string;
  uploadUrl: string;
}
@Injectable()
export class uploadImgService {
  constructor(private prisma: PrismaService) {}

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
    tokenDiaflow?: string,
  ): Promise<uploadImgResponse> {
    this.renameFileUnique(file);
    if (!tokenDiaflow) {
      const token = await this.prisma.appSettings.findFirst({
        where: {
          key: 'Diaflow_Token',
        },
      });
      if (token?.description) {
        tokenDiaflow = token.description;
      } else {
        const token = await this.refreshToken();
        tokenDiaflow = token;
        await this.prisma.appSettings.update({
          where: {
            key: 'Diaflow_Token',
          },
          data: {
            description: token,
          },
        });
        tokenDiaflow = token;
      }
    }
    if (!folder) {
      folder = 'BFF-Pickleball';
    }
    const response = await this.registerFile(
      { name: file.originalname, type: file.mimetype },
      tokenDiaflow!,
      folder!,
    );
    if (!response.success && response.code === 401) {
      const token = await this.refreshToken();

      if (!token) {
        throw new Error('Failed to refresh token');
      }
      return await this.uploadImage(file, folder, token);
    } else if (response.success || response.code === 200) {
      const uploadFile = await this.uploadFile(
        response.response.uploadUrl,
        file.mimetype,
        file.buffer,
      );
      if (!uploadFile) {
        throw new Error('Failed to upload file');
      }
      return {
        url: response.response.url,
        uploadUrl: response.response.uploadUrl,
      };
    } else {
      throw new Error(response.message);
    }
  }

  //Đăng ký file
  private async registerFile(
    file: fileObject,
    token: string,
    folder: string,
  ): Promise<{
    message: string;
    success: boolean;
    code: number;
    response: any;
  }> {
    const response = await fetch(
      `https://api.diaflow.io/api/v1/drives/s3/presigned`,
      {
        method: 'POST',
        body: JSON.stringify({
          folder: folder,
          name: file.name,
          type: file.type,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    if (data.uploadUrl && data.url) {
      return {
        message: 'success',
        success: true,
        code: response.status,
        response: data,
      };
    }
    return {
      message: 'fail',
      success: false,
      code: response.status,
      response: data,
    };
  }

  //Upload file
  private async uploadFile(
    url: string,
    type: string,
    file_binary: any,
  ): Promise<boolean> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': type,
      },
      body: file_binary,
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  }

  //Đổi tên file nếu đã tồn tại
  private renameFileUnique(file: Express.Multer.File): void {
    const fileExt = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExt);

    // Format: time_random_filename.jpg (Đảm bảo không bao giờ trùng)
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1e4)}_${fileName}${fileExt}`;

    // Xử lý xóa khoảng trắng để tránh lỗi URL S3
    file.originalname = uniqueName.replace(/\s+/g, '_');
  }
  //Refresh token
  private async refreshToken(): Promise<string> {
    try {
      const password = process.env.DIAFLOW_PASSWORD;
      const email = process.env.DIAFLOW_EMAIL;
      const origin = process.env.ORIGIN_DIAFLOW;
      if (!password || !email || !origin) {
        throw new Error('Missing environment variables');
      }
      const body = {
        email: email,
        password: password,
      };
      console.log(body);
      const response = await fetch(`https://api.diaflow.io/api/v1/auth/login`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          origin: origin,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        if (data.accessToken) {
          await this.prisma.appSettings.update({
            where: {
              key: 'Diaflow_Token',
            },
            data: {
              description: data.accessToken,
            },
          });
        }
        return data?.accessToken;
      } else {
        return '';
      }
    } catch (error) {
      return error.message;
    }
  }
}
