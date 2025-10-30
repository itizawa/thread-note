import { Skeleton as MuiSkeleton } from "@mui/material";
import { HeroSectionLayout } from "./HeroSection.layout";

export const HeroSectionSkeleton = () => {
  return (
    <HeroSectionLayout>
      <MuiSkeleton
        variant="rectangular"
        width={180}
        height={40}
        sx={{ mx: "auto" }}
      />
    </HeroSectionLayout>
  );
};
