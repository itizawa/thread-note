import { router } from "../init";
import { postRouter } from "./postRouter";
import { threadRouter } from "./threadRouter";
import { userRouter } from "./userRouter";

export const appRouter = router({
  thread: threadRouter,
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
