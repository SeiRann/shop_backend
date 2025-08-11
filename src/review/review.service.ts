import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma:PrismaService){}


  async create(createReviewDto: CreateReviewDto) {
    await this.prisma.review.create({
      data:{
        review_title:createReviewDto.review_title,
        review_score:createReviewDto.review_score,
        review_text:createReviewDto.review_text,
        product_id:createReviewDto.product_id,
        author_id:createReviewDto.author_id,
      }
    })

    return `Review has been created`
  }

  async findAll() {
    const reviews = await this.prisma.review.findMany()

    return reviews
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({where:{review_id:id}})

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    await this.prisma.review.update({
      where:{
        review_id:id
      },
      data:{
        review_title:updateReviewDto.review_title,
        review_score:updateReviewDto.review_score,
        review_text:updateReviewDto.review_text,
        product_id:updateReviewDto.product_id,
        author_id:updateReviewDto.author_id,
      }
    })

    return `Review has been updated`
  }

  async remove(id: number) {
    await this.prisma.review.delete({where:{review_id:id}})
    
    return `This action removes a #${id} review`;
  }
}
