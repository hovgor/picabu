import { UserRoles } from 'src/shared/types/roles';

export interface IJwtPayload {
  email: string;
  role: UserRoles;
  sub: string;
  ip: string;
  deviceId: string;
}
