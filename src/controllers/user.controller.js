// Controlador para usuarios (administración básica)

import { userRepository } from '../repositories/user.repository.js';
import UserDto from '../dtos/user.dto.js';

// ==============================================
// OBTENER TODOS LOS USUARIOS (solo admin)
// ==============================================
export const getAllUsers = async (req, res) => {
  try {
    // Verificar que sea admin (ya lo hace handlePolicies)
    const users = await userRepository.getAllUsers();
    const usersDto = users.map(user => new UserDto(user));
    res.json({ status: 'success', payload: usersDto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// OBTENER USUARIO POR ID
// ==============================================
export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userRepository.getUserById(uid);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ status: 'success', payload: new UserDto(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================================
// ACTUALIZAR USUARIO
// ==============================================
export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const updatedUser = await userRepository.updateUser(uid, req.body);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ status: 'success', payload: new UserDto(updatedUser) });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// ==============================================
// ELIMINAR USUARIO
// ==============================================
export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const deleted = await userRepository.deleteUser(uid);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};