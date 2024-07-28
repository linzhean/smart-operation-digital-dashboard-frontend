//src\utils\jwtDecode.ts
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  sub: string;
  [key: string]: any;
}

export const decodeJwt = (token: string): DecodedToken => {
  return jwtDecode(token);
};
