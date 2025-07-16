// src/services/api.ts
import { User, ApiResponse, ApiError } from '../types';

// Utilisation du proxy Vite pour les appels API
const API_BASE_URL = '/api';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData): Promise<ApiResponse<{ user: User; token: string }>> => {
  return fetchApi('login', {
    method: 'POST',
    data
  });
};

// Type pour les options de fetchApi
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Fonction utilitaire pour récupérer le token du localStorage (utilisé par fetchApi)
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

interface FetchApiOptions extends Omit<RequestInit, 'method' | 'body'> {
    method?: HttpMethod;
    data?: unknown; // Peut être FormData ou un objet classique
}

export const fetchApi = async <T>(endpoint: string, options: FetchApiOptions = {}): Promise<ApiResponse<T>> => {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token = getAuthToken();

    const isForm = options.data instanceof FormData;

    const headers: HeadersInit = {
        'Accept': 'application/json',
        ...(isForm ? {} : { 'Content-Type': 'application/json' }), // ne pas fixer Content-Type pour FormData
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const requestInit: RequestInit = {
        ...options,
        method: options.method || 'GET',
        headers,
        body: options.data
            ? isForm
                ? (options.data as FormData)
                : JSON.stringify(options.data)
            : undefined,
    };

    try {
        const response = await fetch(url, requestInit);

        // Tenter de lire la réponse comme JSON quoi qu'il arrive
        let data: any;
        try {
            // Important: Si la réponse est vide (e.g., 204 No Content) ou non-JSON, response.json() échouera.
            // Vérifiez d'abord si le content-type est JSON et si le corps n'est pas vide.
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json") && response.status !== 204) {
                data = await response.json();
            } else {
                // Si ce n'est pas du JSON ou corps vide, traitez-le comme du texte ou vide.
                data = await response.text();
                if (data === "") data = {}; // Si la réponse est vide, considérez un objet vide
            }
        } catch (e) {
            // Si le parsing JSON échoue pour une raison quelconque (corps malformé, etc.)
            console.warn(`Could not parse JSON response from ${url}:`, e);
            // Tentez de lire comme texte brut si possible (pour debug)
            data = await response.text();
            throw new Error(`Failed to parse API response from ${url}. Response was: ${data}`, { cause: e });
        }

        if (!response.ok) {
            // Si la réponse n'est pas OK (statut 4xx ou 5xx)
            const errorData = data as ApiError;
            throw new Error(errorData.message || `HTTP error! status: ${response.status} for ${url}`, {
                cause: errorData
            });
        }

        return data as T; // Retourne les données JSON parsées

    } catch (error) {
        console.error('Erreur lors de l\'appel API (fetchApi):', error);
        throw error; // Relance l'erreur pour que le composant appelant la gère
    }
};

// ---------------------------------------------------------------------
// Par compatibilité : objet «api» avec méthodes REST courtes (get, post…)
// De nombreuses pages font : `import api from '../services/api';`
// On expose donc un export par défaut qui proxy vers fetchApi.

type Data = unknown;

interface RequestOptions extends Omit<FetchApiOptions, 'method' | 'data'> {}

const api = {
  get:    <T = any>(endpoint: string, options: RequestOptions = {}) => fetchApi<T>(trimEndpoint(endpoint), { ...options, method: 'GET' }),
  post:   <T = any>(endpoint: string, data?: Data, options: RequestOptions = {}) => fetchApi<T>(trimEndpoint(endpoint), { ...options, method: 'POST', data }),
  put:    <T = any>(endpoint: string, data?: Data, options: RequestOptions = {}) => fetchApi<T>(trimEndpoint(endpoint), { ...options, method: 'PUT', data }),
  patch:  <T = any>(endpoint: string, data?: Data, options: RequestOptions = {}) => fetchApi<T>(trimEndpoint(endpoint), { ...options, method: 'PATCH', data }),
  delete: <T = any>(endpoint: string, options: RequestOptions = {}) => fetchApi<T>(trimEndpoint(endpoint), { ...options, method: 'DELETE' }),
  // expose aussi login pour commodité
  login,
};

function trimEndpoint(endpoint: string) {
  return endpoint.replace(/^\/+/, ''); // retire éventuel leading slash
}

export default api;