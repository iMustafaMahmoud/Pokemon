"use client";

import { DehydratedState, HydrationBoundary } from "@tanstack/react-query";

interface HydrateProps {
  children: React.ReactNode;
  state: DehydratedState;
}

export function Hydrate({ children, state }: HydrateProps) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
