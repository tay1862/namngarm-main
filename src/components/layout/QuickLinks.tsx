'use client';

import { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

export default function QuickLinks() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  // Build quick links from settings
  const quickLinks = [
    ...(settings?.whatsapp ? [{
      id: 1,
      type: 'whatsapp' as const,
      label: 'WhatsApp',
      url: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`,
      color: '#25D366',
      icon: '💬',
    }] : []),
    ...(settings?.facebookPage ? [{
      id: 2,
      type: 'facebook' as const,
      label: 'Facebook',
      url: settings.facebookPage,
      color: '#1877F2',
      icon: '📘',
    }] : []),
    ...(settings?.lineId ? [{
      id: 3,
      type: 'line' as const,
      label: 'LINE',
      url: `https://line.me/ti/p/~${settings.lineId}`,
      color: '#00B900',
      icon: '💚',
    }] : []),
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 mb-3"
          >
            {quickLinks.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: link.color }}
                >
                  <span className="text-xl">{link.icon}</span>
                </div>
                <span className="pr-4 font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                  {link.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xl shadow-pink-500/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="animate-pulse-slow"
            >
              <MessageCircle size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
