import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import "./Modal.css";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showClose = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  footer = null,
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlay &&
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  return (
    <div
      className="lumora-modal"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={`lumora-modal__dialog lumora-modal__dialog--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "lumora-modal-title" : undefined}
      >
        {(title || showClose) && (
          <header className="lumora-modal__header">
            {title && (
              <h2
                id="lumora-modal-title"
                className="lumora-modal__title"
              >
                {title}
              </h2>
            )}

            {showClose && (
              <button
                type="button"
                className="lumora-modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes size={16} />
              </button>
            )}
          </header>
        )}

        <div className="lumora-modal__body">
          {children}
        </div>

        {footer && (
          <footer className="lumora-modal__footer">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export default Modal;