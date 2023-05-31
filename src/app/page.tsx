import dynamic from "next/dynamic";

const CanvasComponent = dynamic(() => import("./components/Canvas"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <CanvasComponent />
    </main>
  );
}
