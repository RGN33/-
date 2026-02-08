import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Evaluation {
  id: string;
  subcategory_id: string;
  title: string;
  title_ar: string;
  description: string | null;
  image_url: string | null;
  download_url: string;
  sort_order: number;
}

export const useEvaluations = (subcategoryId: string) => {
  return useQuery({
    queryKey: ["evaluations", subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evaluations")
        .select("*")
        .eq("subcategory_id", subcategoryId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Evaluation[];
    },
    enabled: !!subcategoryId,
  });
};
