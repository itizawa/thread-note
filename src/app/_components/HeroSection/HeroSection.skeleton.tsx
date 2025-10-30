import { Skeleton } from "@/shared/components/Skeleton";
import { HeroSectionLayout } from "./HeroSection.layout";

export const HeroSectionSkeleton = () => {
  return (
    <HeroSectionLayout>
      <Skeleton
        variant="rectangular"
        width={180}
        height={40}
        sx={{ mx: "auto" }}
      />
    </HeroSectionLayout>
  );
};
