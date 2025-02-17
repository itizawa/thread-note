import { router } from "../init";
import { postRouter } from "./postRouter";
import { threadRouter } from "./threadRouter";

export const appRouter = router({
  thread: threadRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
