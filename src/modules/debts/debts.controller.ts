import type { FastifyReply, FastifyRequest } from "fastify";

import {
  friendDebtsParamsSchema,
  type FriendDebtsParams,
} from "./debts.schema.js";
import { debtsService } from "./debts.service.js";

export const debtsController = {
  async listByFriend(request: FastifyRequest, reply: FastifyReply) {
    const { friendId } = friendDebtsParamsSchema.parse(
      request.params,
    ) as FriendDebtsParams;

    const debts = await debtsService.listByFriend(friendId, request.user.sub);

    return reply.send(debts);
  },
};
