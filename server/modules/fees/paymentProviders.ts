import { BadRequestError } from '../../core/errors/AppError.js';

export interface PaymentDetails {
  invoiceId?: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  referenceNo?: string;
  metadata?: any;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  gatewayReference: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  processedAt: Date;
  providerName: string;
}

export interface IPaymentProvider {
  processPayment(details: PaymentDetails): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount: number, reason: string): Promise<{ success: boolean; refundReference: string }>;
}

export class CashPaymentProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-cash-${Date.now()}`,
      gatewayReference: details.referenceNo || `CASH-REC-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'Cash Counter'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-CASH-${Date.now()}` };
  }
}

export class BankTransferProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-bank-${Date.now()}`,
      gatewayReference: details.referenceNo || `WIRE-${Date.now()}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'Bank Wire Direct'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-BANK-${Date.now()}` };
  }
}

export class ChequeProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-cheque-${Date.now()}`,
      gatewayReference: details.referenceNo || `CHQ-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'Bank Cheque Clearance'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-CHQ-${Date.now()}` };
  }
}

export class CardPaymentProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-card-${Date.now()}`,
      gatewayReference: details.referenceNo || `POS-CARD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'POS Card Terminal'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-CARD-${Date.now()}` };
  }
}

export class JazzCashProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-jc-${Date.now()}`,
      gatewayReference: details.referenceNo || `JC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'JazzCash Mobile Wallet'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-JC-${Date.now()}` };
  }
}

export class EasypaisaProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-ep-${Date.now()}`,
      gatewayReference: details.referenceNo || `EP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'Easypaisa Mobile Wallet'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-EP-${Date.now()}` };
  }
}

export class RaastProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-raast-${Date.now()}`,
      gatewayReference: details.referenceNo || `RAAST-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'RAAST Instant Payment System'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-RAAST-${Date.now()}` };
  }
}

export class OnlineGatewayProvider implements IPaymentProvider {
  public async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `tx-online-${Date.now()}`,
      gatewayReference: details.referenceNo || `GW-STRIPE-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'COMPLETED',
      processedAt: new Date(),
      providerName: 'Online Payment Gateway (3DS)'
    };
  }

  public async refundPayment(transactionId: string, amount: number, reason: string) {
    return { success: true, refundReference: `REF-GW-${Date.now()}` };
  }
}

export class PaymentProviderFactory {
  public static getProvider(method: string): IPaymentProvider {
    const normalized = (method || 'CASH').toUpperCase();
    switch (normalized) {
      case 'CASH': return new CashPaymentProvider();
      case 'BANK_TRANSFER': return new BankTransferProvider();
      case 'CHEQUE': return new ChequeProvider();
      case 'CARD': return new CardPaymentProvider();
      case 'JAZZCASH': return new JazzCashProvider();
      case 'EASYPAISA': return new EasypaisaProvider();
      case 'RAAST': return new RaastProvider();
      case 'ONLINE_GATEWAY': return new OnlineGatewayProvider();
      default:
        return new CashPaymentProvider();
    }
  }
}
