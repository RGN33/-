import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "لا توجد عناصر حالياً" }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="retro-card p-12 text-center"
    >
      <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground text-lg">{message}</p>
    </motion.div>
  );
};

export default EmptyState;
