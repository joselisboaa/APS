import { PrismaClient, UserGroup } from '@prisma/client';

const prisma = new PrismaClient();

export class UserGroupService {
  async verifyEntityDependencies(req, res): Promise<UserGroup | null> {
    const userId = Number(req.params["id"]);

    const query = {
      where: { id: userId },
      include: { users: true, questions: true }
    }

    return prisma.userGroup.findFirst(query);
  }

  async findAll(req, res) {
    const queryParam = req.query

    let filter = {
        text: {
            startsWith: queryParam["text"]
        }
    }

    const query = {
        skip: queryParam["pg"] == null? 0 : ( Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) ),
        take: queryParam["qt"] == null? 100 : Number(queryParam["qt"]),
        where: filter
    }

    return prisma.userGroup.findMany(query);
  }

  async findById(id) {
    return prisma.userGroup.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data) {
    return prisma.userGroup.create({
      data: {
        text: data["text"],
      },
    });
  }

  async update(req, res) {
    const data = {
      "id": res.locals.userGroup["id"],
      "text": req.body["text"]
    }
    
    return prisma.userGroup.update({
      where: {
        id: data["id"],
      },
      data: {
        text: data["text"],
      },
    });
  }

  async deleteById(data) {
    return prisma.userGroup.delete({
      where: {
        id: data["id"],
      },
    });
  }
}
