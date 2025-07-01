import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import sidebarGroups from "@/lib/sidebarConfig";

const slides = sidebarGroups.flatMap(group => group.links.map(link => ({
  icon: link.icon,
  label: link.label,
  path: link.path
})));

export default function AppSlider() {
  const carouselRef = useRef<{ api?: { scrollNext: () => void } }>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current && carouselRef.current.api) {
        carouselRef.current.api.scrollNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 mb-8">
      <Carousel ref={carouselRef} className="relative rounded-xl overflow-hidden shadow-lg">
        <CarouselContent>
          {slides.map((slide, idx) => (
            <CarouselItem key={idx} className="h-40 md:h-56 flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 cursor-pointer" onClick={() => navigate(slide.path)} tabIndex={0} role="button" aria-label={slide.label} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(slide.path); }}>
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="mb-2">{slide.icon}</div>
                <div className="text-xl font-bold text-gray-800 dark:text-white mb-1">{slide.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">Go to {slide.label}</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <span key={idx} className="w-3 h-3 rounded-full bg-white/70 border border-white shadow-sm" />
          ))}
        </div>
      </Carousel>
    </div>
  );
} 