import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryCard from "@/components/CategoryCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { useCategory } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading: categoryLoading } = useCategory(id!);
  const { data: subcategories, isLoading: subcategoriesLoading } =
    useSubcategories(id!);

  const isLoading = categoryLoading || subcategoriesLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : category ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Breadcrumb items={[{ label: category.name_ar }]} />

            <div className="text-center mb-8">
              <h2 className="section-title text-3xl mb-2">{category.name_ar}</h2>
              {category.description && (
                <p className="text-muted-foreground mt-4">
                  {category.description}
                </p>
              )}
            </div>

            {subcategories && subcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategories.map((subcategory, index) => (
                  <CategoryCard
                    key={subcategory.id}
                    id={subcategory.id}
                    name={subcategory.name}
                    nameAr={subcategory.name_ar}
                    description={subcategory.description ?? undefined}
                    imageUrl={subcategory.image_url ?? undefined}
                    to={`/subcategory/${subcategory.id}`}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="لا توجد أقسام فرعية حالياً" />
            )}
          </motion.div>
        ) : (
          <EmptyState message="القسم غير موجود" />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Category;
