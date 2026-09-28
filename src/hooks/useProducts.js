import { PRODUCTS as LOCAL_PRODUCTS } from '../data/productsData';

/**
 * Hook to provide curated ASKMEBAG products catalog.
 * Uses the clean, multi-angle verified products dataset directly
 * to eliminate all network fluctuations, loading flickers, and discrepancies.
 */
export const useProducts = () => {
  return { products: LOCAL_PRODUCTS, loading: false };
};
