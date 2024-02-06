import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { ConfigService } from '@nestjs/config';
import { TOKEN_TYPE } from '../../shared/types';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { CryptService } from '../crypt/crypt.service';
import {
  USER_NEED_CONFIRM_EMAIL,
  USER_ALREADY_REGISTER,
  EMAIL_INVALID,
  TOKEN_INVALID,
} from '../../shared/const';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly cryptService: CryptService,
  ) {}

  /**
   * Registers a new user with the provided email, password, and name.
   * If the user already exists, it throws an error based on the email confirmation status.
   *
   * @param {string} email - The email of the new user.
   * @param {string} password - The password of the new user.
   * @param {string} name - The name of the new user.
   * @throws {BadRequestException} - If the user already exists and email is confirmed or needs confirmation.
   * @returns {Promise<void>}
   */
  async register(email: string, password: string, name: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      if (user.isEmailConfirmed) {
        throw new BadRequestException(USER_ALREADY_REGISTER);
      } else {
        throw new BadRequestException(USER_NEED_CONFIRM_EMAIL);
      }
    }

    const hashedPassword = await this.cryptService.hashPassword(password);
    const newUser = await this.userService.create(email, hashedPassword, name);
    const token = await this.tokenService.generateUserToken(
      email,
      newUser,
      TOKEN_TYPE.EMAIL_CONFIRMATION,
    );
    await this.mailService.sendRegisterTokenEmail(newUser, token);
  }

  /**
   * Confirms the user's registration by validating the provided token.
   *
   * @param {string} token - The token for email confirmation.
   * @throws {BadRequestException} - If the token is invalid or not found.
   * @returns {Promise<void>}
   */
  async confirmRegister(token: string): Promise<void> {
    const user = await this.tokenService.findUserByToken(
      token,
      TOKEN_TYPE.EMAIL_CONFIRMATION,
    );
    if (!user) {
      throw new BadRequestException(TOKEN_INVALID);
    }

    user.isEmailConfirmed = true;
    await this.userService.save(user);
    await this.tokenService.removeTokenByUser(
      user,
      TOKEN_TYPE.EMAIL_CONFIRMATION,
    );
  }

  /**
   * Initiates the password reset process by generating a reset token for the user with the given email.
   *
   * @param {string} email - The email of the user who wants to reset their password.
   * @throws {BadRequestException} - If the email is not found in the system.
   * @returns {Promise<void>}
   */
  async resetPassword(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(EMAIL_INVALID);
    }

    const token = await this.tokenService.generateUserToken(
      email,
      user,
      TOKEN_TYPE.PASSWORD_RESET,
    );
    await this.mailService.sendResetPasswordToken(user, token);
  }

  /**
   * Confirms the user's password reset by validating the provided token and setting the new password.
   *
   * @param {string} token - The password reset token.
   * @param {string} newPassword - The new password to be set for the user.
   * @throws {BadRequestException} - If the token is invalid or not found.
   * @returns {Promise<void>}
   */
  async confirmResetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.tokenService.findUserByToken(
      token,
      TOKEN_TYPE.PASSWORD_RESET,
    );
    if (!user) {
      throw new BadRequestException(TOKEN_INVALID);
    }

    user.password = await this.cryptService.hashPassword(newPassword);
    await this.userService.save(user);
    await this.tokenService.removeTokenByUser(user, TOKEN_TYPE.PASSWORD_RESET);
  }
}
