import * as React from "react";

export interface SliderItem {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
}

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

interface InfiniteSliderProps {
  items: SliderItem[];
  compact?: boolean;
}

export function InfiniteSlider({ items, compact = false }: InfiniteSliderProps) {
  const [visibleRange, setVisibleRange] = React.useState({ min: -CONFIG.BUFFER_SIZE, max: CONFIG.BUFFER_SIZE });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0,
    minimapHeight: compact ? 180 : 250,
  });

  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  // Fix: Provide an initial value to useRef to resolve "Expected 1 arguments, but got 0" error.
  const requestRef = React.useRef<number | undefined>(undefined);
  const renderedRange = React.useRef({ min: -CONFIG.BUFFER_SIZE, max: CONFIG.BUFFER_SIZE });

  const getProjectData = (index: number) => {
    const i = ((Math.abs(index) % items.length) + items.length) % items.length;
    return items[i];
  };

  const getProjectNumber = (index: number) => {
    return (((Math.abs(index) % items.length) + items.length) % items.length + 1).toString().padStart(2, "0");
  };

  const updateParallax = (img: HTMLImageElement | null, scroll: number, index: number, height: number) => {
    if (!img) return;
    if (!img.dataset.parallaxCurrent) img.dataset.parallaxCurrent = "0";
    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.2;
    current = lerp(current, target, 0.1);
    if (Math.abs(current - target) > 0.01) {
      img.style.transform = `translateY(${current}px) scale(1.5)`;
      img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min((Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const projectHeight = s.projectHeight || 1;
    const current = Math.round(-s.targetY / projectHeight);
    const target = -current * projectHeight;
    s.isSnapping = true;
    s.snapStart = { time: Date.now(), y: s.targetY, target: target };
  };

  const updatePositions = () => {
    const s = state.current;
    const projectHeight = s.projectHeight || 1;
    const minimapY = (s.currentY * s.minimapHeight) / projectHeight;

    projectsRef.current.forEach((el, index) => {
      const y = index * projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, projectHeight);
    });

    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) updateParallax(img, minimapY, index, s.minimapHeight);
    });

    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  const animationLoop = () => {
    const s = state.current;
    const now = Date.now();
    const projectHeight = s.projectHeight || 1;
    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint = -Math.round(-s.targetY / projectHeight) * projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }
    if (s.isSnapping) updateSnap();
    if (!s.isDragging) s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    updatePositions();
    const currentIndex = Math.round(-s.targetY / projectHeight);
    const min = currentIndex - CONFIG.BUFFER_SIZE;
    const max = currentIndex + CONFIG.BUFFER_SIZE;
    if (min !== renderedRange.current.min || max !== renderedRange.current.max) {
      renderedRange.current = { min, max };
      setVisibleRange({ min, max });
    }
    requestRef.current = requestAnimationFrame(animationLoop);
  };

  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        state.current.projectHeight = containerRef.current.clientHeight;
      }
    };

    updateSize();

    const onWheel = (e: WheelEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      const s = state.current;
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY), -CONFIG.MAX_VELOCITY);
      s.targetY -= delta;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      const s = state.current;
      s.isDragging = true;
      s.isSnapping = false;
      s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
      s.lastScrollTime = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) return;
      const s = state.current;
      if (!s.isDragging) return;
      s.targetY = s.dragStart.scrollY + (e.touches[0].clientY - s.dragStart.y) * 1.5;
      s.lastScrollTime = Date.now();
    };

    const onTouchEnd = () => { state.current.isDragging = false; };
    const onResize = () => { updateSize(); };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);
    
    requestRef.current = requestAnimationFrame(animationLoop);
    
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [items]);

  const indices = [];
  for (let i = visibleRange.min; i <= visibleRange.max; i++) indices.push(i);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black select-none rounded-[40px] border border-white/10">
      <ul className="m-0 p-0 list-none h-full">
        {indices.map((i) => {
          const data = getProjectData(i);
          return (
            <div
              key={i}
              className="absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              <img src={data.image} alt={data.title} className="w-full h-[150%] object-cover absolute top-0 left-0" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
            </div>
          );
        })}
      </ul>

      {/* Info Overlay */}
      <div className={`absolute bottom-6 right-6 z-50 pointer-events-none ${compact ? 'w-64' : 'w-80'}`}>
        <div className="relative w-full h-[250px] overflow-hidden bg-[#121212]/40 backdrop-blur-2xl rounded-2xl border border-white/10 flex flex-col">
          <div className="relative flex-grow h-full overflow-hidden">
            {indices.map((i) => {
              const data = getProjectData(i);
              const num = getProjectNumber(i);
              return (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full p-6 flex flex-col justify-between"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="m-0 text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{num}</p>
                      <p className="m-0 text-[10px] font-bold uppercase tracking-widest text-white/40">{data.year}</p>
                    </div>
                    <h4 className="m-0 text-lg font-black uppercase tracking-tight text-white leading-none">{data.title}</h4>
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end border-t border-white/5 pt-4">
                      <p className="m-0 text-[9px] font-bold text-gray-500 uppercase tracking-widest">{data.category}</p>
                    </div>
                    <p className="m-0 text-[11px] text-gray-300 leading-relaxed font-medium italic">"{data.description}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-50">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white">Variant Engine Active</p>
        </div>
      </div>
    </div>
  );
}