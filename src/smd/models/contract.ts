import { Target } from './target';

export interface Contract {
  id: string;
  cboId: string;
  iPackageId: string;
  start: string;
  end: string;
  isCurrent: boolean;
  packageName: string;
  totalAmount: number;
  targets: Target[];
}
