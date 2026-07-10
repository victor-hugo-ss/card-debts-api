import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createFriendByAdminBodySchema,
  friendParamsSchema,
  updateFriendBodySchema,
  type CreateFriendByAdminInput,
  type FriendParams,
  type UpdateFriendInput,
} from "./users.schema.js";
import { usersService } from "./users.service.js";

export const usersController = {
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

  async updateFriend(request: FastifyRequest, reply: FastifyReply) {
    const { id } = friendParamsSchema.parse(request.params) as FriendParams;
    const data = updateFriendBodySchema.parse(request.body) as UpdateFriendInput;

    const friend = await usersService.updateFriend(id, data);

    return reply.send(friend);
  },

  async deleteFriend(request: FastifyRequest, reply: FastifyReply) {
    const { id } = friendParamsSchema.parse(request.params) as FriendParams;

    await usersService.deactivateFriend(id);

    return reply.status(204).send();
  },
};
