import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { appConfiguration } from 'config/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ErrorHandler } from 'src/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfiguration().jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.uId },
      select: { role: { select: { id: true, title: true } } },
    });

    if (!user) return ErrorHandler(403);

    return {
      userId: payload.uId,
      email: payload.eId,
      role: { id: user.role.id, title: user.role.title },
    };
  }
}
