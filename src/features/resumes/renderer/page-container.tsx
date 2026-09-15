"use client";

import * as React from "react";
import { PageSize } from "@resumeai/shared";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface PageContainerProps {
  pageSize: PageSize;
  children: React.ReactNode;
}

export function PageContainer({ pageSize, children }: PageContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState<number>(100);
  const [isAutoFit, setIsAutoFit] = React.useState<boolean>(true);

  // A4: 210mm x 297mm (~794px x 1123px at 96 DPI)
  // Letter: 8.5in x 11in (~816px x 1056px at 96 DPI)
  const isA4 = pageSize === "a4";
  const baseWidth = isA4 ? 794 : 816;
  const baseHeight = isA4 ? 1123 : 1056;
  const pageHeightPx = baseHeight;

  // Calculate zoom percentage to fit the container width
  const calcFitZoom = React.useCallback(() => {
    if (!containerRef.current) return 100;
    const availableWidth = containerRef.current.clientWidth - 48; // padding (24px each side)
    if (availableWidth <= 0) return 100;
    const calculated = Math.floor((availableWidth / baseWidth) * 100);
    return Math.min(100, Math.max(35, calculated));
  }, [baseWidth]);

  // Responsive auto-fit on mount and container resize
  React.useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      if (isAutoFit) {
        const fit = calcFitZoom();
        setZoom(fit);
      }
    };

    // Initial calculation
    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isAutoFit, calcFitZoom]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.max(prev - 10, 35));
  };

  const handleResetZoom = () => {
    setIsAutoFit(false);
    setZoom(100);
  };

  const handleFitWidth = () => {
    setIsAutoFit(true);
    setZoom(calcFitZoom());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Zoom / Page Info Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-neutral-200 bg-neutral-50/90 text-xs text-neutral-600 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-neutral-700 text-[11px]">
            {pageSize === "a4" ? "A4 (210×297mm)" : "US Letter (8.5×11in)"}
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-neutral-500 hidden sm:inline">Page Canvas</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 bg-white border border-neutral-200 rounded-md p-0.5 shadow-sm">
          {/* Fit to Width Button */}
          <button
            type="button"
            onClick={handleFitWidth}
            className={`px-1.5 py-0.5 text-[11px] font-medium rounded transition-colors ${
              isAutoFit
                ? "bg-primary/10 text-primary font-semibold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
            title="Auto-fit page to window width"
          >
            Fit
          </button>

          <div className="w-[1px] h-3.5 bg-neutral-200" />

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 35}
            className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded disabled:opacity-40 disabled:hover:bg-transparent"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Current Zoom */}
          <span className="px-1 font-mono text-[11px] font-medium text-neutral-700 min-w-9 text-center">
            {zoom}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 150}
            className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded disabled:opacity-40 disabled:hover:bg-transparent"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-neutral-200" />

          {/* 100% Reset Button */}
          <button
            type="button"
            onClick={handleResetZoom}
            className={`px-1.5 py-0.5 text-[11px] font-medium rounded transition-colors ${
              !isAutoFit && zoom === 100
                ? "bg-primary/10 text-primary font-semibold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
            title="Reset Zoom to 100%"
          >
            100%
          </button>
        </div>
      </div>

      {/* Viewport Scroll Canvas: flex-col with mx-auto on content to eliminate left-coordinate clipping */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-neutral-200/60 p-3 sm:p-6"
      >
        <div className="min-w-fit min-h-fit mx-auto flex flex-col items-center">
          {/* Explicit outer box with exact scaled layout dimensions */}
          <div
            style={{
              width: `${Math.round(baseWidth * (zoom / 100))}px`,
              height: `${Math.round(baseHeight * (zoom / 100))}px`,
              position: "relative",
              transition: "width 120ms ease-out, height 120ms ease-out",
            }}
          >
            {/* Printable Sheet (anchored top-left, scaled uniformly) */}
            <div
              style={{
                width: `${baseWidth}px`,
                minHeight: `${baseHeight}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top left",
                transition: "transform 120ms ease-out",
              }}
              className="absolute top-0 left-0 bg-white shadow-xl border border-neutral-300 origin-top-left"
            >
              {/* Multi-page Cutoff Guideline */}
              <div
                style={{ top: `${pageHeightPx}px` }}
                className="absolute left-0 right-0 pointer-events-none border-b-2 border-dashed border-red-300 z-10 print:hidden opacity-70 hover:opacity-100 transition-opacity"
              >
                <span className="absolute -top-3 right-4 bg-red-100 text-red-700 border border-red-200 text-[10px] font-medium px-2 py-0.5 rounded shadow-sm">
                  Page 1 Break Line ({pageHeightPx}px)
                </span>
              </div>

              {/* Resume Content */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
