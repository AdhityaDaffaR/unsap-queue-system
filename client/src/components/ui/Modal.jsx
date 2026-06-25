import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, children, showCloseButton = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={showCloseButton ? onClose : undefined}
          />
          
          <motion.div 
            className="w-full max-w-sm relative z-10"
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          >
            <Card className="border border-border-default bg-bg-surface shadow-[--shadow-modal] rounded-[--radius-lg] relative flex flex-col space-y-4" size="md">
              {title && (
                <div className="text-center pr-6 pl-6">
                  <h3 className="text-h4 text-text-main tracking-tight">{title}</h3>
                </div>
              )}

              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </Button>
              )}

              <div className="w-full text-left">
                {children}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
