import { router } from "../init";
import { fileRouter } from "./fileRouter";
import { ogpRouter } from "./ogpRouter";
import { postRouter } from "./postRouter";
import { tagRouter } from "./tagRouter";
import { threadRouter } from "./threadRouter";
import { tokenRouter } from "./tokenRouter";
import { userRouter } from "./userRouter";

export const appRouter = router({
  thread: threadRouter,
  post: postRouter,
  user: userRouter,
  ogp: ogpRouter,
  file: fileRouter,
  token: tokenRouter,
  tag: tagRouter,
});

export type AppRouter = typeof appRouter;
