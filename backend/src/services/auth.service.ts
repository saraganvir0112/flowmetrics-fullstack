import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { AuthResponseData, SafeUser } from '../types/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthService {
  /**
   * Authenticates user via email and password.
   * Uses generic error to prevent user enumeration.
   * Returns safe user information and signed JWT.
   */
  public static async login(email: string, password: string): Promise<AuthResponseData> {
    // Explicitly query passwordHash because it is marked select: false on the schema
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const safeUser: SafeUser = user.toSafeJSON();

    return {
      user: safeUser,
      token,
    };
  }
}
