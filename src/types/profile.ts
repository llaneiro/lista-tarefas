export interface UserProfile {
  id: number; // Sempre 1 (registro único)
  name: string;
  email: string;
  photoUri: string | null; // Caminho local da foto ou null se não houver
}

export interface SaveProfileInput {
  name: string;
  email: string;
  photoUri: string | null;
}