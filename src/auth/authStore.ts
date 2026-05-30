import { api } from '../services/api'

export interface User {
  id: string
  email: string
  role: 'admin' | 'client'
  name: string
  status: 'active' | 'pending' | 'rejected'
  createdAt: string
}

// Connecter un utilisateur via API
export const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; message: string }> => {
  try {
    const data = await api.login(email, password)
    return { success: true, user: data.user, message: data.message }
  } catch (error: any) {
    return { success: false, message: error.message || 'Erreur de connexion' }
  }
}

// Inscrire un nouveau client via API
export const registerClient = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
  try {
    await api.register(name, email, password, 'client')
    return { success: true, message: 'Inscription réussie ! En attente d\'approbation par l\'administrateur.' }
  } catch (error: any) {
    return { success: false, message: error.message || 'Erreur d\'inscription' }
  }
}

// Déconnecter
export const logout = () => {
  api.clearToken()
}

// Récupérer l'utilisateur connecté depuis l'API
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await api.getCurrentUser()
    return data.user
  } catch {
    return null
  }
}

// Admin : Récupérer les clients en attente
export const getPendingClients = async (): Promise<User[]> => {
  try {
    const data = await api.getPendingUsers()
    return data.users
  } catch {
    return []
  }
}

// Admin : Accepter un client
export const approveClient = async (clientId: string): Promise<boolean> => {
  try {
    await api.approveUser(parseInt(clientId))
    return true
  } catch {
    return false
  }
}

// Admin : Rejeter un client
export const rejectClient = async (clientId: string): Promise<boolean> => {
  try {
    await api.rejectUser(parseInt(clientId))
    return true
  } catch {
    return false
  }
}

// Admin : Récupérer tous les clients
export const getAllClients = async (): Promise<User[]> => {
  try {
    const data = await api.getUsers()
    return data.users.filter((u: User) => u.role === 'client')
  } catch {
    return []
  }
}
