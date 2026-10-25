import { useCallback, useEffect, useState } from "react";
import { products as initialProducts } from "../data/products";
import { fetchCatalog } from "../lib/catalog";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";
export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(() => [
    ...initialProducts,
  ]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    if (!supabase) return;
    const controller = new AbortController();
    fetchCatalog(false, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(data);
          setError("");
          setLoading(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(
            "Não foi possível atualizar o catálogo. Tente novamente ou fale com a TOP3D.",
          );
          setLoading(false);
        }
      });
    const onFocus = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onFocus);
    const interval = setInterval(onFocus, 60000);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [revision, refresh]);
  return { products, loading, error, refresh };
}
