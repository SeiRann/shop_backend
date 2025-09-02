import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, author_id: string) {
    await this.prisma.review.create({
      data: {
        review_title: createReviewDto.review_title,
        review_score: Number(createReviewDto.review_score),
        review_text: createReviewDto.review_text,
        product_id: createReviewDto.product_id,
        author_id: author_id,
      },
    });

    return `Review has been created`;
  }

  async findAll() {
    const reviews = await this.prisma.review.findMany();

    return reviews;
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { review_id: id },
    });

    return review;
  }

  async findManyByProduct(id: string) {
    const review = await this.prisma.review.findMany({
      where: { product_id: id },
    });

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    await this.prisma.review.update({
      where: {
        review_id: id,
      },
      data: {
        review_title: updateReviewDto.review_title,
        review_score: Number(updateReviewDto.review_score),
        review_text: updateReviewDto.review_text,
      },
    });

    return `Review has been updated`;
  }

  async remove(id: string) {
    await this.prisma.review.delete({ where: { review_id: id } });

    return `This action removes a #${id} review`;
  }
}
