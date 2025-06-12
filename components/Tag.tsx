import { useState } from 'react';

const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
];

export default function Tag({ tag, onClick, index }: { tag: string, onClick?: (e: any) => void, index: number }) {
  const [show, setShow] = useState(false);
  const color = tagColors[index % tagColors.length];
  return (
    <span
      className={`relative cursor-pointer px-2 py-0.5 rounded-full text-xs font-medium ${color} hover:shadow`}
      onClick={onClick}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
    >
      {tag}
      {show && (
        <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-black text-white text-xs rounded shadow">
          {tag}
        </span>
      )}
    </span>
  );
} 