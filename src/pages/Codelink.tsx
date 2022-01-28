import { LayoutMain } from "@/layouts/Main";

export default function App(): JSX.Element {
  const scale = "scale(1)";
  document.body.style.transform = scale;
  return <LayoutMain />;
}
