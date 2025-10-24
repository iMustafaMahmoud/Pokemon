"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import PaginationView from "../components/PaginationView";
import LoadMoreView from "../components/LoadMoreView";
import { ErrorBoundary } from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";

type ViewType = "pagination" | "loadmore";

export default function HomeClient() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const initialView: ViewType =
    viewParam === "loadmore" ? "loadmore" : "pagination";
  const [currentView, setCurrentView] = useState<ViewType>(initialView);

  // Sync state with URL when user navigates back/forward
  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="mb-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center space-x-8">
              <div className="flex items-center justify-center">
                <span className="text-white text-2xl mr-2">⚡</span>
                <h1 className="text-2xl font-bold">Pokédex</h1>
              </div>
              <p className="text-gray-600 text-center">
                Discover and explore Pokémon with pagination
              </p>
              <div className="flex space-x-1 rounded-lg p-1">
                <button
                  onClick={() => {
                    setCurrentView("pagination");
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("view"); // pagination is default
                    params.delete("page"); // reset page when switching views
                    const newUrl = params.toString()
                      ? `?${params.toString()}`
                      : "/";
                    window.history.pushState({}, "", newUrl);
                  }}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors cursor-pointer ${
                    currentView === "pagination"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:text-gray-900"
                  }`}
                >
                  Pagination
                </button>
                <button
                  onClick={() => {
                    setCurrentView("loadmore");
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("view", "loadmore");
                    params.delete("page"); // reset page when switching views
                    window.history.pushState({}, "", `?${params.toString()}`);
                  }}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors cursor-pointer ${
                    currentView === "loadmore"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:text-gray-900"
                  }`}
                >
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <ErrorBoundary
          key={currentView} // Reset ErrorBoundary when view changes
          fallback={({ error, resetError }) => (
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-600 text-2xl font-bold mb-4">
                  Failed to load Pokémon
                </div>
                <p className="text-red-500 text-center mb-4">
                  {error?.message || "Unable to fetch Pokémon data"}
                </p>
                <button
                  onClick={resetError}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <LoadingSpinner size="lg" />
                </div>
              </div>
            }
          >
            {currentView === "pagination" ? (
              <PaginationView />
            ) : (
              <LoadMoreView />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
