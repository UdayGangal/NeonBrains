import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import RetroBackground from "./components/RetroBackground";
import Header from "./components/Header";
import ImageUpload from "./components/ImageUpload";
import ImageEditor from "./components/ImageEditor";
import PolaroidGenerator from "./components/PolaroidGenerator.jsx";
import Gallery from "./components/Gallery";

import {
  Camera,
  Edit,
  DollarSign as PolaroidIcon,
  GalleryVertical as GalleryIcon,
} from "lucide-react";

// interface ImageFilters {
//   brightness: number;
//   contrast: number;
//   saturation: number;
//   hue: number;
//   sepia: number;
//   blur: number;
//   grayscale: number;
// }

function Polaroid() {
  const [currentStep, setCurrentStep] = useState("upload");
  const [capturedImage, setCapturedImage] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [imageFilters, setImageFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    sepia: 0,
    blur: 0,
    grayscale: 0,
  });

  const handleImageCapture = (imageSrc) => {
    setCapturedImage(imageSrc);
    setEditedImage(imageSrc);
    setCurrentStep("edit");
  };

  const handleImageEdit = (editedImageSrc, filters) => {
    setEditedImage(editedImageSrc);
    setImageFilters(filters);
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case "upload":
        return <ImageUpload onImageCapture={handleImageCapture} />;
      case "edit":
        return (
          <ImageEditor imageSrc={capturedImage} onImageEdit={handleImageEdit} />
        );
      case "generate":
        return (
          <PolaroidGenerator imageSrc={editedImage} filters={imageFilters} />
        );
      case "gallery":
        return <Gallery />;
      default:
        return <ImageUpload onImageCapture={handleImageCapture} />;
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case "upload":
        return Camera;
      case "edit":
        return Edit;
      case "generate":
        return PolaroidIcon;
      case "gallery":
        return GalleryIcon;
      default:
        return Camera;
    }
  };

  const isStepAccessible = (step) => {
    switch (step) {
      case "upload":
        return true;
      case "edit":
        return capturedImage !== "";
      case "generate":
        return editedImage !== "";
      case "gallery":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen relative">
      <RetroBackground />

      <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30">
              {[
                { key: "upload", label: "CAPTURE" },
                { key: "edit", label: "EDIT" },
                { key: "generate", label: "GENERATE" },
                { key: "gallery", label: "GALLERY" },
              ].map(({ key, label }) => {
                const Icon = getStepIcon(key);
                const isActive = currentStep === key;
                const isAccessible = isStepAccessible(key);

                return (
                  <button
                    key={key}
                    onClick={() => isAccessible && setCurrentStep(key)}
                    disabled={!isAccessible}
                    className={`retro-button px-4 py-3 rounded-lg font-bold pixel-font transition-all duration-300 flex items-center space-x-2 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white transform scale-105"
                        : isAccessible
                        ? "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 hover:text-white"
                        : "bg-gray-800 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Step Component */}
          <div className="max-w-4xl mx-auto">{getCurrentStepComponent()}</div>

          {/* Progress Indicator */}
          {currentStep !== "gallery" && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
                {["upload", "edit", "generate"].map((step, index) => {
                  const isComplete =
                    (step === "upload" && capturedImage) ||
                    (step === "edit" && editedImage) ||
                    step === "generate";
                  const isCurrent = currentStep === step;

                  return (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold pixel-font text-sm ${
                          isComplete
                            ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black"
                            : isCurrent
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black animate-pulse"
                            : "bg-gray-600 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {index < 2 && (
                        <div
                          className={`w-12 h-1 mx-2 ${
                            isComplete
                              ? "bg-gradient-to-r from-green-400 to-cyan-400"
                              : "bg-gray-600"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default Polaroid;
