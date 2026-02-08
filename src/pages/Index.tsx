import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { useCategories } from "@/hooks/useCategories";

const Index = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="section-title text-3xl mb-2">الأقسام الرئيسية</h2>
            <p className="text-muted-foreground mt-4">
              اختر القسم المطلوب للوصول إلى التقييمات والمذكرات
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  nameAr={category.name_ar}
                  description={category.description ?? undefined}
                  imageUrl={category.image_url ?? undefined}
                  to={`/category/${category.id}`}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="لا توجد أقسام حالياً" />
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
