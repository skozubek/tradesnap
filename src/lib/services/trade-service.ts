// src/lib/services/trade-service.ts
import { 
    TradeFormData,
    TradeApiData,
    tradeFormSchema
  } from '@/lib/validations/trade-schemas';
  import { withErrorHandling } from '@/lib/error-utils';
  
  const API_BASE = '/api/trades';
  
  async function makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  
    return response.json();
  }
  
  export const tradeService = {
    create: async (data: TradeFormData) => {
      return withErrorHandling(async () => {
        const validatedData = tradeFormSchema.parse(data);
        return makeRequest<TradeApiData>(API_BASE, {
          method: 'POST',
          body: JSON.stringify(validatedData),
        });
      });
    },
  
    update: async (id: string, data: TradeFormData) => {
      return withErrorHandling(async () => {
        const validatedData = tradeFormSchema.parse(data);
        return makeRequest<TradeApiData>(`${API_BASE}?id=${id}`, {
          method: 'PUT',
          body: JSON.stringify(validatedData),
        });
      });
    },
  
    delete: async (id: string) => {
      return withErrorHandling(async () => {
        return makeRequest(`${API_BASE}?id=${id}`, {
          method: 'DELETE',
        });
      });
    },
  };