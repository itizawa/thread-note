import { router } from "../init";
import { ogpRouter } from "./ogpRouter";
import { postRouter } from "./postRouter";
import { threadRouter } from "./threadRouter";
import { userRouter } from "./userRouter";

export const appRouter = router({
  thread: threadRouter,
  post: postRouter,
  user: userRouter,
  ogp: ogpRouter,
});

export type AppRouter = typeof appRouter;
