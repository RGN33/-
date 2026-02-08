import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  name_ar: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export const useSubcategories = (categoryId: string) => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", categoryId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: !!categoryId,
  });
};

export const useSubcategory = (id: string) => {
  return useQuery({
    queryKey: ["subcategory", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*, categories(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Subcategory & { categories: { id: string; name_ar: string } };
    },
    enabled: !!id,
  });
};
