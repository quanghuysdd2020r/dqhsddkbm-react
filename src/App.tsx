import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/HomePage";
import Study from "./pages/StudyPage";
import Blogs from "./pages/BlogsPage";
import About from "./pages/AboutPage";
import Shop from "./pages/ShopPage";
import ComingSoon from "./pages/ComingSoonPage";
import Focus from "./pages/FocusPage";
import Notes from "./pages/NotesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/study" element={<Study />} />
        <Route path="/study/notes" element={<Notes />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/sign-in" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
}
