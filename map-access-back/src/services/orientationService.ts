import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrientationService {
  constructor() {}

  async findAll(req, res) {
    const queryParam = req.query

      let filter = {
          text: {
              startsWith: queryParam["text"]
          }
      }

      const answerId = queryParam["answer-id"]
      if (isNaN(answerId) === false) {
          filter["answer_id"] = Number(queryParam["answer-id"])
      }

      const query = {
          skip: queryParam["pg"] == null? 0 : ( Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) ),
          take: queryParam["qt"] == null? 100 : Number(queryParam["qt"]),
          where: filter
      }

    return prisma.orientation.findMany(query);
  }

  async findById(id) {
    return prisma.orientation.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByAnswer(answerId) {
    return prisma.orientation.findFirst({
      where: {
        answer_id: answerId,
      },
    });
  }

  async create(data) {
    return prisma.orientation.create({
      data: {
        text: data["text"],
        value: data["value"],
        answer: {
          connect: { id: data["answer_id"] },
        },
      },
    });
  }

  async update(req, res) {

    const data = {
      "id": res.locals.orientation["id"],
      "text": req.body["text"],
      "value": req.body["value"],
      "answer_id": req.body["answer_id"]
    }

    return prisma.orientation.update({
      where: {
        id: data["id"],
      },
      data: {
        text: data["text"],
        value: data["value"],
        answer: {
          connect: { id: data["answer_id"] },
        },
      },
    });
  }

  async deleteById(data) {
    return prisma.orientation.delete({
      where: {
        id: data["id"],
      },
    });
  }
}
