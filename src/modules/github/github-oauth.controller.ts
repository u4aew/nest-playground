import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtService } from '@nestjs/jwt';
import { GithubOauthGuard } from './github-oauth.guard';

@Controller('auth/github')
export class GithubOauthController {
  constructor(private jwtAuthService: JwtService) {}

  @Get()
  @UseGuards(GithubOauthGuard)
  async githubAuth() {
    // With `@UseGuards(GithubOauthGuard)` we are using an AuthGuard that @nestjs/passport
    // automatically provisioned for us when we extended the passport-github strategy.
    // The Guard initiates the passport-github flow.
  }

  @Get('callback')
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Passport automatically creates a `user` object, based on the return value of our
    // GithubOauthStrategy#validate() method, and assigns it to the Request object as `req.user`

    const user = req.user;

    // TODO delete
    console.log(
      `${this.githubAuthCallback.name}(): req.user = ${JSON.stringify(
        user,
        null,
        4,
      )}`,
    );

    console.log('test 1233333');
    // @ts-ignore
    const token = this.jwtAuthService.sign({ sub: user.id, email: user.email });
    console.log(`test ${token}`);
    return { access_token: token };
  }
}
