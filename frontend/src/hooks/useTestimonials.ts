import { useState, useEffect, useCallback } from 'react';
import { getAllReviews } from '@/services/reviewService';
import { Review } from '@/types/Review';

interface UseTestimonialsReturn {
  testimonials: Review[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTestimonials = (page: number = 1, limit: number = 6): UseTestimonialsReturn => {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllReviews(page, limit);
      setTestimonials(data.reviews);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los testimonios';
      setError(errorMessage);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials,
  };
};
