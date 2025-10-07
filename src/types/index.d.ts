import { UserViewModel } from '../users/types/viewModel';
import { RefreshTokenDbModel } from '../auth/types/authDbModel';

declare global {
  namespace Express {
    export interface Request {
      user?: UserViewModel;
      token?: RefreshTokenDbModel;
    }
  }
}
export {};
