// src/components/modal/withModalProvider.tsx
import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export const withModalProvider = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <BottomSheetModalProvider>
      <Component {...props} />
    </BottomSheetModalProvider>
  );
};
