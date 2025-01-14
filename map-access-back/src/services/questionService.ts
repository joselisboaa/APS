import { PrismaClient, Question } from '@prisma/client';

const prisma = new PrismaClient();

export class QuestionService {
  async verifyEntityDependencies(req, res): Promise<Question | null> {
    const questionText = req.params["text"];

    const query = {
      where: { text: questionText },
      include: { answers: true }
    }

    return prisma.question.findFirst(query);
  }

  async verifyUniqueProperties(req): Promise<Question | null> {
    const body = req.body;

    const query = {
      where: {
        text: body["text"]
      }
    }

    return prisma.question.findFirst(query)
  }

  async getExecuteQuery(query) {
    return prisma.question.findMany(query);
  }

  async findAll(req, res) {
    const queryParam = req.query

      let filter = {
          text: {
              startsWith: queryParam["text"]
          }
      }

      const userGroupId = queryParam["user-group-id"]
      if (isNaN(userGroupId) === false) {
          filter["user_group_id"] = Number(queryParam["user-group-id"])
      }

      const query = {
          skip: queryParam["pg"] == null? 0 : ( Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) ),
          take: queryParam["qt"] == null? 100 : Number(queryParam["qt"]),
          where: filter
      }

    return prisma.question.findMany(query);
  }

  async findById(id) {
    return prisma.question.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data) {
    return prisma.question.create({
      data: {
        text: data["text"],
        user_group: {
          connect: { id: data["user_group_id"] },
        },
      },
    });
  }

  async update(req, res) {
    const data = {
      "id": res.locals.question["id"],
      "text": req.body["text"],
      "user_group_id": req.body["user_group_id"]
    }

    return prisma.question.update({
      where: {
        id: data["id"],
      },
      data: {
        text: data["text"],
        user_group: {
          connect: { id: data["user_group_id"] },
        },
      },
    });
  }

  async deleteById(data) {
    return prisma.question.delete({
      where: {
        id: data["id"],
      },
    });
  }
}
