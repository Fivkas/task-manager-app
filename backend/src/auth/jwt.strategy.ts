import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Here we tell passport where to look for the token (in Header: Authorization Bearer ...)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // If it expires, throw an error
      secretOrKey: 'SUPER_SECRET_KEY', // ATTENTION: It must be the same as the one in AuthModule!
    });
  }

  // This runs AFTER the token is verified
  async validate(payload: any) {
    // We return the elements we want to be available in the Request
    return { userId: payload.sub, email: payload.email };
  }
}
