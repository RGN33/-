import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCategories, Category } from "@/hooks/useCategories";
import { Subcategory } from "@/hooks/useSubcategories";
import { Evaluation } from "@/hooks/useEvaluations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";

type ActiveTab = "categories" | "subcategories" | "evaluations";

interface FormData {
  name: string;
  name_ar: string;
  description: string;
  image_url: string;
  download_url?: string;
  category_id?: string;
  subcategory_id?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<ActiveTab>("categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    name_ar: "",
    description: "",
    image_url: "",
    download_url: "",
  });

  // Data states
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      fetchEvaluations(selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const fetchSubcategories = async (categoryId: string) => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order");
    setSubcategories(data || []);
  };

  const fetchEvaluations = async (subcategoryId: string) => {
    const { data } = await supabase
      .from("evaluations")
      .select("*")
      .eq("subcategory_id", subcategoryId)
      .order("sort_order");
    setEvaluations(data || []);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || item.title || "",
        name_ar: item.name_ar || item.title_ar || "",
        description: item.description || "",
        image_url: item.image_url || "",
        download_url: item.download_url || "",
        category_id: item.category_id || selectedCategory,
        subcategory_id: item.subcategory_id || selectedSubcategory,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        name_ar: "",
        description: "",
        image_url: "",
        download_url: "",
        category_id: selectedCategory,
        subcategory_id: selectedSubcategory,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      name_ar: "",
      description: "",
      image_url: "",
      download_url: "",
    });
  };

  const handleSave = async () => {
    try {
      if (activeTab === "categories") {
        const payload = {
          name: formData.name,
          name_ar: formData.name_ar,
          description: formData.description || null,
          image_url: formData.image_url || null,
        };

        if (editingItem) {
          await supabase
            .from("categories")
            .update(payload)
            .eq("id", editingItem.id);
        } else {
          await supabase.from("categories").insert(payload);
        }
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else if (activeTab === "subcategories") {
        const payload = {
          name: formData.name,
          name_ar: formData.name_ar,
          description: formData.description || null,
          image_url: formData.image_url || null,
          category_id: selectedCategory,
        };

        if (editingItem) {
          await supabase
            .from("subcategories")
            .update(payload)
            .eq("id", editingItem.id);
        } else {
          await supabase.from("subcategories").insert(payload);
        }
        fetchSubcategories(selectedCategory);
      } else if (activeTab === "evaluations") {
        const payload = {
          title: formData.name,
          title_ar: formData.name_ar,
          description: formData.description || null,
          image_url: formData.image_url || null,
          download_url: formData.download_url || "",
          subcategory_id: selectedSubcategory,
        };

        if (editingItem) {
          await supabase
            .from("evaluations")
            .update(payload)
            .eq("id", editingItem.id);
        } else {
          await supabase.from("evaluations").insert(payload);
        }
        fetchEvaluations(selectedSubcategory);
      }

      toast({
        title: "تم الحفظ بنجاح",
        description: editingItem ? "تم تحديث العنصر" : "تم إضافة العنصر",
      });
      closeModal();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;

    try {
      if (activeTab === "categories") {
        await supabase.from("categories").delete().eq("id", id);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else if (activeTab === "subcategories") {
        await supabase.from("subcategories").delete().eq("id", id);
        fetchSubcategories(selectedCategory);
      } else if (activeTab === "evaluations") {
        await supabase.from("evaluations").delete().eq("id", id);
        fetchEvaluations(selectedSubcategory);
      }

      toast({
        title: "تم الحذف بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="retro-header">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">لوحة التحكم</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      <main className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
              activeTab === "categories"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>الأقسام الرئيسية</span>
          </button>
          <button
            onClick={() => setActiveTab("subcategories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
              activeTab === "subcategories"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>الأقسام الفرعية</span>
          </button>
          <button
            onClick={() => setActiveTab("evaluations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-colors ${
              activeTab === "evaluations"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>التقييمات</span>
          </button>
        </div>

        {/* Category/Subcategory Selection */}
        {(activeTab === "subcategories" || activeTab === "evaluations") && (
          <div className="retro-card p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">
                  اختر القسم الرئيسي
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                  }}
                  className="w-full p-2 border-2 border-border rounded-md bg-background"
                >
                  <option value="">-- اختر --</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === "evaluations" && selectedCategory && (
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-2">
                    اختر القسم الفرعي
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full p-2 border-2 border-border rounded-md bg-background"
                  >
                    <option value="">-- اختر --</option>
                    {subcategories?.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {activeTab === "categories" && "الأقسام الرئيسية"}
            {activeTab === "subcategories" && "الأقسام الفرعية"}
            {activeTab === "evaluations" && "التقييمات"}
          </h2>
          <button
            onClick={() => openModal()}
            disabled={
              (activeTab === "subcategories" && !selectedCategory) ||
              (activeTab === "evaluations" && !selectedSubcategory)
            }
            className="retro-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة جديد</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="retro-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-right p-4 font-semibold">الاسم</th>
                  <th className="text-right p-4 font-semibold">الوصف</th>
                  <th className="text-right p-4 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "categories" &&
                  (categoriesLoading ? (
                    <tr>
                      <td colSpan={3} className="p-8">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : categories?.length ? (
                    categories.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-border hover:bg-muted/50"
                      >
                        <td className="p-4 font-medium">{item.name_ar}</td>
                        <td className="p-4 text-muted-foreground">
                          {item.description || "-"}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(item)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-muted-foreground"
                      >
                        لا توجد أقسام
                      </td>
                    </tr>
                  ))}

                {activeTab === "subcategories" &&
                  (selectedCategory ? (
                    subcategories.length ? (
                      subcategories.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-border hover:bg-muted/50"
                        >
                          <td className="p-4 font-medium">{item.name_ar}</td>
                          <td className="p-4 text-muted-foreground">
                            {item.description || "-"}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(item)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-muted-foreground"
                        >
                          لا توجد أقسام فرعية
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-muted-foreground"
                      >
                        اختر قسماً رئيسياً أولاً
                      </td>
                    </tr>
                  ))}

                {activeTab === "evaluations" &&
                  (selectedSubcategory ? (
                    evaluations.length ? (
                      evaluations.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-border hover:bg-muted/50"
                        >
                          <td className="p-4 font-medium">{item.title_ar}</td>
                          <td className="p-4 text-muted-foreground">
                            {item.description || "-"}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(item)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-muted-foreground"
                        >
                          لا توجد تقييمات
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-muted-foreground"
                      >
                        اختر قسماً فرعياً أولاً
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="retro-card w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingItem ? "تعديل" : "إضافة جديد"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الاسم (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border-2 border-border rounded-md bg-background focus:border-primary focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الاسم (عربي)
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ar: e.target.value })
                    }
                    className="w-full p-3 border-2 border-border rounded-md bg-background focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-3 border-2 border-border rounded-md bg-background focus:border-primary focus:outline-none resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full p-3 border-2 border-border rounded-md bg-background focus:border-primary focus:outline-none"
                    dir="ltr"
                    placeholder="https://..."
                  />
                </div>

                {activeTab === "evaluations" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      رابط التحميل
                    </label>
                    <input
                      type="url"
                      value={formData.download_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          download_url: e.target.value,
                        })
                      }
                      className="w-full p-3 border-2 border-border rounded-md bg-background focus:border-primary focus:outline-none"
                      dir="ltr"
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="retro-button flex-1">
                  <Save className="w-4 h-4 inline-block ml-2" />
                  حفظ
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border-2 border-border rounded-md hover:bg-muted transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
