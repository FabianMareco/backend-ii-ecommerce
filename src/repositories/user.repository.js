// Repositorio de Usuarios (completo)

import { userDao } from '../dao/factory.js';
import UserDto from '../dtos/user.dto.js';

class UserRepository {
  async getUserById(id) {
    const user = await userDao.findById(id);
    return user ? new UserDto(user) : null;
  }
  
  async getUserByEmail(email) {
    const user = await userDao.findByEmail(email);
    return user ? new UserDto(user) : null;
  }
  
  async getUserByEmailWithPassword(email) {
    // Para login, necesitamos la contraseña
    return await userDao.findByEmail(email);
  }
  
  async getAllUsers() {
    const users = await userDao.findAll();
    return users.map(user => new UserDto(user));
  }
  
  async createUser(userData) {
    const user = await userDao.create(userData);
    return new UserDto(user);
  }
  
  async updateUser(id, updateData) {
    const user = await userDao.update(id, updateData);
    return user ? new UserDto(user) : null;
  }
  
  async deleteUser(id) {
    return await userDao.delete(id);
  }
  
  async updatePassword(email, hashedPassword) {
    return await userDao.updatePassword(email, hashedPassword);
  }
  
  async setResetToken(email, token, expires) {
    return await userDao.setResetToken(email, token, expires);
  }
  
  async findByResetToken(token) {
    const user = await userDao.findByResetToken(token);
    return user ? new UserDto(user) : null;
  }
}

export const userRepository = new UserRepository();