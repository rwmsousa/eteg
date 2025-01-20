import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ClientData {
  name: string;
  email: string;
  cpf: string;
  color: string;
  annotations?: string;
}

interface ErrorResponse {
  error: string;
  status: number;
}

const registerClient = async (clientData: ClientData): Promise<ClientData | ErrorResponse> => {
  try {
    const response = await axios.post<ClientData>(`${API_URL}/clients`, clientData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      return {
        error: 'Erro no servidor. Tente mais tarde.',
        status: 404,
      };
    }
    return {
      error: (axiosError.response?.data as { message: string })?.message || 'Erro ao registrar cliente',
      status: axiosError.response?.status || 500,
    };
  }
};

export default registerClient;
