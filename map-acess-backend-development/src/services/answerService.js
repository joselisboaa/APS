import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnswerService {
  async findAll(req, res) {
    const queryParam = req.query

      let filter = {
          text: {
              startsWith: queryParam["text"]
          }
      }

      const questionId = queryParam["question-id"]
      if (isNaN(questionId) === false) {
          filter["question_id"] = Number(queryParam["question-id"])
      }

      const query = {
          skip: queryParam["pg"] == null? 0 : ( Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) ),
          take: queryParam["qt"] == null? 100 : Number(queryParam["qt"]),
          where: filter
      }

    return prisma.answer.findMany(query);
  }

  async findById(id) {
    return prisma.answer.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data) {
    return prisma.answer.create({
      data: {
        text: data["text"],
        other: data["other"],
        question: {
          connect: { id: data["question_id"] },
        },
      },
    });
  }

  async update(data) {
    return prisma.answer.update({
      where: {
        id: data["id"],
      },
      data: {
        text: data["text"],
        other: data["other"],
        question: {
          connect: { id: data["question_id"] },
        },
      },
    });
  }

  async deleteById(data) {
    return prisma.answer.delete({
      where: {
        id: data["id"],
      },
    });
  }
}
