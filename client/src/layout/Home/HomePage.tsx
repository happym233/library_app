import Carousel from "./components/Carousel";
import ExploreTopBooks from "./components/ExploreTopBooks";
import Heros from "./components/Heros";
import LibraryServices from "./components/LibraryServices";

export default function HomePage() {
  return (
    <>
      <ExploreTopBooks />
      <Carousel />
      <Heros />
      <LibraryServices />
    </>
  );
}
