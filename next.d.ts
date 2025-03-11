import "next";

declare module "next" {
  export type NextSegmentPage<
    Props extends {
      params?: Record<string, string | string[]>;
    } = object
  > = React.FC<{
    params: Promise<Props["params"]>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }>;
}
