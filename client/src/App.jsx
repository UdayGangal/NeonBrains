import { useState } from "react";
import { createRoutesFromElements } from "react-router";
import { createBrowserRouter, Route, RouterProvider } from "react-router";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import PolaroidGenerator from "./pages/PolaroidGenerator";
import MorseCode from "./pages/MorseCode";
import MusicPlayer from "./pages/MusicPlayer";
import "./App.css";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="" element={<HomePage />} />
        <Route path="polaroid" element={<PolaroidGenerator />} />
        <Route path="morse" element={<MorseCode />} />
        <Route path="music" element={<MusicPlayer />} />
      </Route>
    )
  );
  return <h1>Start</h1>;
}

export default App;
