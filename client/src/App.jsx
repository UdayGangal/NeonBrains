import { useState } from "react";
import { createRoutesFromElements } from "react-router";
import { createBrowserRouter, Route, RouterProvider } from "react-router";
import Layout from "./Layout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Polaroid from "./pages/PolaroidGenerator/Polaroid.jsx";
import MorseCode from "./pages/MorseCode/MorseCode.jsx";
import MusicPlayer from "./pages/MusicPlayer/MusicPlayer.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<HomePage />} />
      <Route path="polaroid" element={<Polaroid />} />
      <Route path="morse" element={<MorseCode />} />
      <Route path="music" element={<MusicPlayer />} />
    </Route>
  )
);

function App() {
  return <h1>Start</h1>;
}

export default App;
