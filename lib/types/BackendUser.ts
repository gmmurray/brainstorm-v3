import { Claims } from '@auth0/nextjs-auth0';

export interface BackendUser extends Claims {
  sub: string;
}
