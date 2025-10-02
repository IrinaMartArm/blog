import { UserViewModel } from '../users/types/viewModel';
import { RefreshToken } from '../auth/types/authDbModel';

declare global {
  namespace Express {
    export interface Request {
      user?: UserViewModel;
      token?: RefreshToken;
    }
  }
}
export {};
