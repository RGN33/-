import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="retro-header sticky top-0 z-50"
    >
      <div className="container py-4">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <div className="p-2 bg-primary rounded-md">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              تقييمات الصف الأول الثانوي
            </h1>
            <p className="text-sm text-muted-foreground">
              Secondary School Evaluations
            </p>
          </div>
        </Link>
      </div>
    </motion.header>
  );
};

export default Header;
