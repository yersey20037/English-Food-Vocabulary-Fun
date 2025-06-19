
import React, { useEffect, useRef } from 'react';
import { FEEDBACK_DELAY_MS } from '../constants'; // Using the constant

interface FeedbackToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
  body: React.ReactNode;
  isCorrect: boolean | null;
  delay?: number;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play().catch(e => console.warn("Sound play promise rejected:", e));
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const FeedbackToast: React.FC<FeedbackToastProps> = ({
  show,
  onClose,
  title,
  body,
  isCorrect,
  delay = FEEDBACK_DELAY_MS,
}) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const bsToastRef = useRef<any>(null); // To store bootstrap.Toast instance

  useEffect(() => {
    if (toastRef.current) {
      if (show) {
        // Ensure any previous instance is disposed if it exists, before creating a new one
        if (bsToastRef.current) {
          bsToastRef.current.dispose();
        }
        const toastInstance = new (window as any).bootstrap.Toast(toastRef.current, {
          autohide: true,
          delay: delay,
        });
        bsToastRef.current = toastInstance;

        toastRef.current.addEventListener('hidden.bs.toast', onClose);
        toastInstance.show();
      } else {
        if (bsToastRef.current) {
          bsToastRef.current.hide(); 
          // Bootstrap's hide will trigger 'hidden.bs.toast' which calls onClose.
          // We might not need to dispose here immediately if we reuse the element.
          // However, if props change and we re-init, disposing old is good.
        }
      }
    }
    
    // Cleanup event listener and dispose toast instance when component unmounts or `show` becomes false and it's hidden
    return () => {
      if (toastRef.current) {
        toastRef.current.removeEventListener('hidden.bs.toast', onClose);
      }
      if (bsToastRef.current) {
        // Check if it's already disposed or in the process of hiding
        // Calling dispose might be too aggressive if Bootstrap is managing its lifecycle post-hide
        // For simplicity, let's rely on re-init logic or Bootstrap's own cleanup
        // bsToastRef.current.dispose(); // This can cause issues if called mid-hide
      }
    };
  }, [show, onClose, delay, title, body]); // Re-run if key props change, to re-initialize if needed

  const handleCloseButtonClick = () => {
    playUISound('https://geasacperu.com/imagenes/click.aac'); // Sound for manual close
    onClose(); // This will set `show` to false, triggering useEffect to hide
  };
  
  const headerClass = isCorrect === true ? 'bg-success text-white' : 
                      isCorrect === false ? 'bg-danger text-white' : 'bg-secondary text-white';

  // We only render the div if show is true, to allow bootstrap to find it.
  // Or, always render and control visibility with d-none/d-block in useEffect.
  // For simplicity with useEffect managing show/hide, we render if show is true or let bootstrap handle hiding.
  // The key is to have the element in DOM for bootstrap to initialize.
  // Let's always render the structure and let `show` prop in useEffect handle .show()/.hide()
  
  return (
    <div
      ref={toastRef}
      className={`toast ${show ? '' : 'hide'}`} // 'hide' class might be used by Bootstrap initially
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`toast-header ${headerClass}`}>
        <strong className="me-auto">{title}</strong>
        <small>{/* Optional: time ago */}</small>
        <button
          type="button"
          className={`btn-close ${isCorrect === null || isCorrect === undefined ? '' : 'btn-close-white'}`}
          onClick={handleCloseButtonClick}
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">
        {body}
      </div>
    </div>
  );
};

export default FeedbackToast;
