import Spline from "@splinetool/react-spline";

export default function KuberSpline({ onLoad, onSplineMouseDown }: any) {
  return (
    <div className="w-full h-[58rem]">
      <Spline
        scene="https://prod.spline.design/HNQOi2tyEdTQtCL0/scene.splinecode"
        onLoad={onLoad}
        onSplineMouseDown={onSplineMouseDown}
      />
    </div>
  );
}
