import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE_URL });

export const captionImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/api/caption', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const evaluateCaption = async (reference, candidate) => {
  const form = new FormData();
  form.append('reference', reference);
  form.append('candidate', candidate);
  const { data } = await api.post('/api/evaluate', form);
  return data;
};

export const saveFeedback = async (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => form.append(k, v));
  const { data } = await api.post('/api/feedback', form);
  return data;
};

export const getFeedback = async () => {
  const { data } = await api.get('/api/feedback');
  return data;
};

export const clearFeedback = async () => {
  const { data } = await api.delete('/api/feedback');
  return data;
};

export const filterImage = async (file, params) => {
  const form = new FormData();
  form.append('file', file);
  Object.entries(params).forEach(([k, v]) => form.append(k, v));
  const { data } = await api.post('/api/filter', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
