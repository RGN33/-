import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import EvaluationCard from "@/components/EvaluationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { useSubcategory } from "@/hooks/useSubcategories";
import { useEvaluations } from "@/hooks/useEvaluations";

const Subcategory = () => {
  const { id } = useParams<{ id: string }>();
  const { data: subcategory, isLoading: subcategoryLoading } = useSubcategory(
    id!
  );
  const { data: evaluations, isLoading: evaluationsLoading } = useEvaluations(
    id!
  );

  const isLoading = subcategoryLoading || evaluationsLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : subcategory ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Breadcrumb
              items={[
                {
                  label: subcategory.categories.name_ar,
                  to: `/category/${subcategory.category_id}`,
                },
                { label: subcategory.name_ar },
              ]}
            />

            <div className="text-center mb-8">
              <h2 className="section-title text-3xl mb-2">
                {subcategory.name_ar}
              </h2>
              {subcategory.description && (
                <p className="text-muted-foreground mt-4">
                  {subcategory.description}
                </p>
              )}
            </div>

            {evaluations && evaluations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {evaluations.map((evaluation, index) => (
                  <EvaluationCard
                    key={evaluation.id}
                    id={evaluation.id}
                    title={evaluation.title}
                    titleAr={evaluation.title_ar}
                    description={evaluation.description ?? undefined}
                    imageUrl={evaluation.image_url ?? undefined}
                    downloadUrl={evaluation.download_url}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="لا توجد تقييمات حالياً" />
            )}
          </motion.div>
        ) : (
          <EmptyState message="القسم الفرعي غير موجود" />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Subcategory;
