import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [message, duration, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 z-50 left-0 w-full  `}
      role="alert"
    >
      <div className={`flex justify-between items-center max-w-sm p-4 rounded-lg shadow-lg bg-red text-white`}>
        <div>
          <p>{message}</p>
        </div>
        <button
          className="ml-4 text-white hover:text-grey"
          onClick={() => {
            setVisible(false);
            onClose();
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
