
export type TransactionType = 'SALE' | 'PURCHASE' | 'EXPENSE' | 'PAYMENT_RECEIVED';

export interface Transaction {
  type: TransactionType;
  label: string;
  amount: number;
  date?: string;
}

export interface Customer {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  due_amount: number;
  transactions: Transaction[];
}

export type LeadStatus = 'NAYA' | 'BAAT_CHAL_RAHI' | 'PAKKA';

export interface Lead {
  id: string;
  name: string;
  detail: string;
  amount?: string;
  status: LeadStatus;
  reminderDate?: string;
  assignedTo?: string;
}

export interface DiaryAnalysisResult {
  transactions: Transaction[];
  total_sale: number;
  total_purchase: number;
  total_expense: number;
  profit_loss: number;
  summary_hindi: string;
  action_steps_hindi: string[];
}

export type ActionType = 
  | 'ADD_CUSTOMER' 
  | 'GET_BALANCE' 
  | 'ADD_PAYMENT' 
  | 'CREATE_INVOICE' 
  | 'LOOKUP_CUSTOMER' 
  | 'ANALYZE_DAILY_TRANSACTIONS'
  | 'UNKNOWN';

export interface CrmAction {
  action: ActionType;
  parameters: any;
  reply: string;
  insights?: {
    summary_hindi: string;
    action_steps_hindi: string[];
  };
}
