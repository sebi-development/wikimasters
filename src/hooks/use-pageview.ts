import { incrementPageview } from "@/app/actions/pageviews";
import { useEffect, useState } from "react";

export function usePageview(articleId: number) {
  const [pageviews, setPageviews] = useState(0);

  useEffect(() => {
    async function fetchPageView() {
      const newCount = await incrementPageview(articleId);
      setPageviews(newCount ?? 0);
    }
    fetchPageView();
  }, [articleId]);

  return pageviews;
}
