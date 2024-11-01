// import Spline from "@splinetool/react-spline";

// export default function KuberLogo() {
//   return (
//     <div>
//       <Spline scene="https://prod.spline.design/HNQOi2tyEdTQtCL0/scene.splinecode" />
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url?: string;
          onSplineMouseDown?: (e: any) => void;
          onLoad?: (spline: any) => void;
        },
        HTMLElement
      >;
    }
  }
}

const SplineViewer = ({ onSplineMouseDown, onLoad }: any) => {
  useEffect(() => {
    // Dynamically import the Spline viewer script
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.35/build/spline-viewer.js";
    script.type = "module";
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <spline-viewer
      url="https://prod.spline.design/HNQOi2tyEdTQtCL0/scene.splinecode"
      className="w-full h-[500px]"
      onSplineMouseDown={onSplineMouseDown}
      onLoad={onLoad}
    />
  );
};

export default SplineViewer;
