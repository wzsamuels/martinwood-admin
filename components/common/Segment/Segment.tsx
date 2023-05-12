import React, { ReactNode, useRef, useEffect } from 'react';

interface SegmentProps {
  segmentType: string;
  setSegmentType: (segmentType: string) => void;
  items: Array<{ type: string; label?: string; children?: ReactNode }>;
}

const Segment: React.FC<SegmentProps> = ({ segmentType, setSegmentType, items }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  const generateClassName = (type: string) =>
    `hover:opacity-80 flex-1 p-2 md:p-4 relative ${segmentType === type ? 'active' : ''}`;

  const updateLinePosition = () => {
    const activeButton = document.querySelector<HTMLButtonElement>(
      `.segment-button.active`
    );

    if (lineRef.current && activeButton) {
      lineRef.current.style.left = `${activeButton.offsetLeft}px`;
      lineRef.current.style.width = `${activeButton.offsetWidth}px`;
    }
  };

  useEffect(() => {
    updateLinePosition();
  }, [segmentType]);

  useEffect(() => {
    const handleResize = () => {
      updateLinePosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = (type: string) => {
    setSegmentType(type);
  };

  return (
    <div className="w-full flex justify-between h-full relative max-w-4xl mx-auto">
      {items.map((item) => (
        <button
          key={item.type}
          className={`segment-button ${generateClassName(item.type)}`}
          onClick={() => handleClick(item.type)}
          data-type={item.type}
        >
          {item.children ? item.children : item.label}
        </button>
      ))}
      <div
        ref={lineRef}
        className="absolute bottom-0 h-0.5 bg-red transition-all duration-300"
      ></div>
    </div>
  );
};

export default Segment;
