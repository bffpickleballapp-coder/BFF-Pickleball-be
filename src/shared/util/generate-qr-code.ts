export class GenerateQrCode {
  bankCode: string;
  accountNumber: string;
  amount: number;
  addInfo: string;
  accountName: string;
}
export const generateQrCode = (obj: GenerateQrCode): string => {
  const accountName = obj.accountName.replace(' ', '%20');
  const qrCode = `https://img.vietqr.io/image/${obj.bankCode}-${obj.accountNumber}-compact.png?amount=${obj.amount}&addInfo=${obj.addInfo}&accountName=${accountName}`;

  return qrCode;
};
