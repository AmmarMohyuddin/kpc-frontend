// src/common/LoaderOverlay.tsx
import { createPortal } from 'react-dom';
import Loader from './Loader';

const LoaderOverlay = () => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Loader />
    </div>,
    document.body, // 👈 Always render on body
  );
};

export default LoaderOverlay;
