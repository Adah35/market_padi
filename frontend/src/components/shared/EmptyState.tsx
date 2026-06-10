import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-gray-700 text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{description}</p>
    </motion.div>
  );
}
