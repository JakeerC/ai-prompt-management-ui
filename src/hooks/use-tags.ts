import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "@/lib/api/tags";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => tagsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}
