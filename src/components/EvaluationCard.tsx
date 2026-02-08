import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

interface EvaluationCardProps {
  id: string;
  title: string;
  titleAr: string;
  description?: string;
  imageUrl?: string;
  downloadUrl: string;
  index: number;
}

const EvaluationCard = ({
  id,
  title,
  titleAr,
  description,
  imageUrl,
  downloadUrl,
  index,
}: EvaluationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="retro-card overflow-hidden"
    >
      {imageUrl ? (
        <div className="aspect-video w-full overflow-hidden border-b-2 border-border">
          <img
            src={imageUrl}
            alt={titleAr}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center border-b-2 border-border">
          <FileText className="w-16 h-16 text-muted-foreground" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-2">{titleAr}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
        )}
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="download-button inline-flex items-center gap-2 w-full justify-center"
        >
          <Download className="w-4 h-4" />
          <span>تحميل</span>
        </a>
      </div>
    </motion.div>
  );
};

export default EvaluationCard;
