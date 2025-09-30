import { UserViewModel } from '../users/types/viewModel';

declare global {
  namespace Express {
    export interface Request {
      user?: UserViewModel;
    }
  }
}
export {};
