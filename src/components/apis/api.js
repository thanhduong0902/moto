import { axiosBase, axiosInstance } from "./axios";

export const getListError = async () => {
  const response = await axiosBase.get(`/error/getAll`);
  return response;
};

export const getDetailError = async (id) => {
  const response = await axiosBase.get(`/error/get/${id}`);
  return response;
};

export const getDetailErrorType = async (id) => {
  const response = await axiosBase.get(`/errortype/get/${id}`);
  return response;
};

export const getListSymptomType = async () => {
  const response = await axiosInstance.get(`/symptomtype/getAll`);
  return response;
};

export const getDetailSymptomType = async (id) => {
  const response = await axiosBase.get(`/symptomtype/get/${id}`);
  return response;
};

export const addForward = async (data) =>
  axiosInstance.post(`/forward/get`, data);

export const getSearchSymptoms = async (data) => {
  const response = await axiosInstance.get(`/symptom/search/${data}`);
  return response;
};
export const getNoneInteraction = async (data) =>
  axiosInstance.post(`/forward/getNoneInterRaction`, data);
