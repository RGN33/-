import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 text-sm mb-6 flex-wrap"
    >
      <Link
        to="/"
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>الرئيسية</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          {item.to ? (
            <Link
              to={item.to}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;
