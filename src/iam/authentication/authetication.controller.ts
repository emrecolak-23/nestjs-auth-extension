import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
// import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { Response } from 'express';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';

@Auth(AuthType.None)
@Controller('authentication')
export class AutheticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    // @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.signIn(signInDto);
    // response.cookie('access_token', accessToken, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshToken(
    // @Res({ passthrough: true }) response: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.authService.refreshTokens(refreshTokenDto);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      activeUser.email,
    );
    await this.otpAuthService.enableTfaForUser(activeUser.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
