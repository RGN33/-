import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="border-t-2 border-border bg-card mt-auto"
    >
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} تقييمات الصف الأول الثانوي
          </p>
          <p className="text-muted-foreground text-sm">
            بوابة تعليمية للموارد والتقييمات
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
