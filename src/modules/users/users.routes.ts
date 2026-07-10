import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { usersController } from "./users.controller.js";
import {
  createFriendByAdminSchema,
  deleteFriendSchema,
  getProfileSchema,
  listFriendsSchema,
  updateFriendSchema,
} from "./users.schema.js";

export async function usersRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/me",
    {
      preHandler: [authMiddleware],
      schema: getProfileSchema,
    },
    usersController.me,
  );

  typedApp.get(
    "/users/friends",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: listFriendsSchema,
    },
    usersController.listFriends,
  );

  typedApp.post(
    "/admin/friends",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: createFriendByAdminSchema,
    },
    usersController.createFriendByAdmin,
  );

  typedApp.patch(
    "/admin/friends/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: updateFriendSchema,
    },
    usersController.updateFriend,
  );

  typedApp.delete(
    "/admin/friends/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: deleteFriendSchema,
    },
    usersController.deleteFriend,
  );
}
