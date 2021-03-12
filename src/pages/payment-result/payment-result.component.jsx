import React from 'react';
import {
  TransactionContainer,
  CardWrapper,
  Container,
  FormContainer,
} from './payment-result.styles';
import CustomButton from '../../components/custom-button/custom-button.component';
import {currencyFormatter} from '../../utils/formatCurrency';

const PaymentResult = () => {
  const url = new URL(
    'https://soby.vn/transaction/%7Bid?vnp_Amount=102000000&vnp_BankCode=NCB&vnp_BankTranNo=20210309145628&vnp_CardType=ATM&vnp_OrderInfo=Payment+on+Soby&vnp_PayDate=20210309145612&vnp_ResponseCode=00&vnp_TmnCode=SOBY0001&vnp_TransactionNo=13471791&vnp_TxnRef=f1b48c72-0e49-4310-b0d1-2493bf750269&vnp_SecureHashType=SHA256&vnp_SecureHash=89b73a4002f88b280d71fa24f3ab1e96922223f5be99a22a90dbc9dd14cbe0a4'
  );
  const params = new URLSearchParams(url.search);
  const vnp_BankCode = params.get('vnp_BankCode');
  const vnp_BankTranNo = params.get('vnp_BankTranNo');
  const vnp_CardType = params.get('vnp_CardType');
  const vnp_OrderInfo = params.get('vnp_OrderInfo');
  const vnp_PayDate = params.get('vnp_PayDate');
  const vnp_ResponseCode = params.get('vnp_ResponseCode');
  const vnp_Amount = currencyFormatter(+params.get('vnp_Amount'));

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  return (
    <Container>
      <CardWrapper>
        <TransactionContainer>
          <div className="soby-title">Transaction Result</div>
          <FormContainer>
            <form onSubmit={handleSubmit}>
              <div className="second-col">
                <div className="form-label">Tên giao dịch VNPAY:</div>
                <div className="info">{vnp_OrderInfo}</div>
              </div>
              <div className="second-col">
                <div className="form-label">Mã ngân hàng:</div>
                <div className="info">{vnp_BankCode}</div>
              </div>
              <div className="second-col">
                <div className="form-label">Mã giao dịch:</div>
                <div className="info">{vnp_BankTranNo}</div>
              </div>
              <div className="second-col">
                <div className="form-label">Loại thẻ:</div>
                <div className="info">{vnp_CardType}</div>
              </div>
              <div className="second-col">
                <div className="form-label">Số tiền:</div>
                <div className="info">{vnp_Amount}</div>
              </div>
              <div className="second-col">
                <div className="form-label">Ngày giao dịch:</div>
                <div className="info">{vnp_PayDate}</div>
              </div>
              <div className="second-col">
                <div className="form-label">Trạng thái:</div>
                <div className="info">
                  {vnp_ResponseCode ? 'Thành công' : ''}
                </div>
              </div>
              <CustomButton type="submit" id="back-btn">
                Trở về
              </CustomButton>
            </form>
          </FormContainer>
        </TransactionContainer>
      </CardWrapper>
    </Container>
  );
};

export default PaymentResult;