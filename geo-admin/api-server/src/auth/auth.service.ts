import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    const adminUsername = process.env.ADMIN_EMAIL ?? "admin";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123456";

    if (username !== adminUsername || password !== adminPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const user = {
      sub: "seed-admin",
      username,
      roles: ["admin", "super_admin"]
    };

    return {
      accessToken: await this.jwtService.signAsync(user),
      user
    };
  }
}
