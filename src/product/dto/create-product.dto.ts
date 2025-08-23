export class CreateProductDto {
  file: Express.Multer.File;
  description: string;
  title: string;
  stock: number;
  sizes: string;
}
