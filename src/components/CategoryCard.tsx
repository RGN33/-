import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, ChevronLeft } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  imageUrl?: string;
  to: string;
  index: number;
}

const CategoryCard = ({
  id,
  name,
  nameAr,
  description,
  imageUrl,
  to,
  index,
}: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={to} className="block">
        <div className="retro-card overflow-hidden group cursor-pointer">
          {imageUrl ? (
            <div className="aspect-video w-full overflow-hidden border-b-2 border-border">
              <img
                src={imageUrl}
                alt={nameAr}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-muted flex items-center justify-center border-b-2 border-border">
              <Folder className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground truncate">
                  {nameAr}
                </h3>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
              <ChevronLeft className="w-5 h-5 text-primary flex-shrink-0 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
