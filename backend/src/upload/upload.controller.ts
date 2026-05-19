import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { put } from '@vercel/blob';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG, WebP y GIF');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo 5MB');
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    
    const blob = await put(fileName, file.buffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      filename: fileName,
    };
  }
}