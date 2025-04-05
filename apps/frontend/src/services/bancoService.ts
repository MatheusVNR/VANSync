import axiosInstance from '../utils/axiosInstance';

const URL_CONTROLLER = "banco";

export const getBancos = async () => {
  const response = await axiosInstance.get(URL_CONTROLLER);
  return response.data;
};

export const createBanco = async (bancoData: any) => {
  const response = await axiosInstance.post(URL_CONTROLLER, bancoData);
  return response.data;
};

export const updateBanco = async (id: number, bancoData: any) => {
  const response = await axiosInstance.put(`${URL_CONTROLLER}/${id}`, bancoData);
  return response.data;
};

export const deleteBanco = async (id: number) => {
  const response = await axiosInstance.delete(`${URL_CONTROLLER}/${id}`);
  return response.data;
};