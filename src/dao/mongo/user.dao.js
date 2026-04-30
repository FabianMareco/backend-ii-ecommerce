import User from '../../models/User.js';

class UserDaoMongo {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findAll() {
    return await User.find();
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async updatePassword(email, hashedPassword) {
    return await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
      { returnDocument: 'after' }
    );
  }

  async setResetToken(email, token, expires) {
    return await User.findOneAndUpdate(
      { email },
      { resetPasswordToken: token, resetPasswordExpires: expires },
      { returnDocument: 'after' }
    );
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  }
}

export default UserDaoMongo;
