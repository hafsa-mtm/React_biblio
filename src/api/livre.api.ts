import  { apiLivre } from './axios';
import { Book } from '../types/Book';

export const LivreAPI = {
  getAll: async (): Promise<Book[]> => {
    const response = await apiLivre.get('/v1/livres');
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await apiLivre.get(`/v1/livres/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await apiLivre.post('/v1/livres', data);
    return response.data;
  },

  search: async (params: any): Promise<Book[]> => {
    const response = await apiLivre.get('/v1/livres/search', { params });
    return response.data;
  },
  update: (id: number, data: FormData) =>
  apiLivre.put(`/v1/livres/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  delete: async (id: number): Promise<void> => {
  await apiLivre.delete(`/v1/livres/${id}`);
},

};