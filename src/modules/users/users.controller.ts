import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createUserBodySchema,
  createFriendByAdminBodySchema,
  type CreateFriendByAdminInput,
} from "./users.schema.js";
import { usersService } from "./users.service.js";

export const usersController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createUserBodySchema.parse(request.body);

    const user = await usersService.create(body);

    return reply.status(201).send(user);
  },

  async me(request: FastifyRequest, reply: FastifyReply) {
    const user = await usersService.getProfile(request.user.sub);

    return reply.send(user);
  },

  async listFriends(_request: FastifyRequest, reply: FastifyReply) {
    const friends = await usersService.listFriends();

    return reply.send(friends);
  },

  async createFriendByAdmin(request: FastifyRequest, reply: FastifyReply) {
    const data = createFriendByAdminBodySchema.parse(
      request.body,
    ) as CreateFriendByAdminInput;

    const friend = await usersService.createFriendByAdmin(data);

    return reply.status(201).send(friend);
  },
};
