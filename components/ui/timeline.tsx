"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans overflow-hidden"
      style={{ backgroundColor: '#1A1A1A' }}
      ref={containerRef}
    >
      <div className="w-full py-20 px-4 md:px-8 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg md:text-4xl mb-4 text-secondary max-w-4xl font-black">
            Our Journey
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-sm">
            Learn about our mission, vision, and the history that shaped LaMa Convenience.
          </p>
        </div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 px-4 md:px-8 lg:px-10 overflow-hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="h-4 w-4 rounded-full border-2 p-2" style={{ backgroundColor: '#FF6B35', borderColor: '#FF6B35' }} />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-black text-white">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-black text-white">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 bottom-0 w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-white/20 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] pointer-events-none"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: 'linear-gradient(to top, #FF6B35 0%, #FF6B35 10%, transparent 100%)',
            }}
            className="absolute inset-x-0 top-0  w-[2px] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
