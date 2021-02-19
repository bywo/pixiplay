import React, { Suspense } from "react";
const Stage = React.lazy(() => import("../components/Stage"));

export default function Home() {
  if (typeof window === "object") {
    return (
      <Suspense fallback={<div>loading...</div>}>
        <Stage />
      </Suspense>
    );
  } else {
    return null;
  }
}
