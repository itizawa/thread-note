"use client";

import { Button } from "@/shared/components/Button";
import { Stack } from "@/shared/components/Stack";
import { Typography } from "@/shared/components/Typography";
import { urls } from "@/shared/consts/urls";
import { generateMetadataObject } from "@/shared/lib/generateMetadataObject";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = generateMetadataObject({
  title: "Thread Note - Error",
});

export default function Page() {
  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="center"
      rowGap="24px"
      height="100dvh"
    >
      <Typography variant="h4" bold>
        エラーが発生しました
      </Typography>
      <Link href={urls.top}>
        <Button variant="contained" color="primary">
          トップへ戻る
        </Button>
      </Link>
    </Stack>
  );
}
