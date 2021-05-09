import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from 'shared/assets/close-action.svg';
import { ReactComponent as AcceptIcon } from 'shared/assets/accept-action.svg';
import { borderColor } from 'shared/css-variable/variable';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  ACCEPT_INVOICE,
  GET_AGGREGATED_INVOICE_ORDER_FOR_INDIVIDUAL,
  GET_DETAILED_INVOICE_BY_ID,
  MARK_SATISFIED_WITH_INVOICE,
  UPDATE_RETURN_SHIPPING_INFO,
} from 'graphQL/repository/invoice.repository';
import Spinner from 'components/ui/spinner/spinner.component';
import { currencyFormatter } from 'shared/utils/formatCurrency';
import SobyModal from 'components/ui/modal/modal.component';
import ErrorPopup from 'components/ui/error-popup/error-popup.component';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 26px;
  background-color: #ffffff;
  margin-top: 38px;
`;

const Box = styled.div`
  background-color: #fff;
  text-align: left;

  &.main-box {
    display: flex;
    justify-content: space-between;
  }

  h4 {
    color: ${(prop) => prop.theme.primary};
  }

  .row {
    display: flex;
    margin-top: 20px;
  }

  .sub {
    margin-top: 5px;
    font-size: 14px;
    color: ${(prop) => prop.theme.stoke};
  }
  .bold {
    font-weight: 600;
    margin-top: 5px;
  }

  .phone {
    width: 100%;
    padding: 7px 0;
    border-radius: 0;
    border: 0;
    outline: 0;
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 50% 1fr 1fr 1fr;

  :first-child,
  :last-child {
    border-bottom: 1px solid ${borderColor};
  }

  .last-child {
    justify-self: right;
    flex: 1;
  }

  h3 {
    text-align: left;
  }

  .title-info {
    min-height: 60px;
    display: flex;
    align-items: center;
  }
`;


const Product = styled.div`
  display: flex;
  text-align: left;

  div {
    margin-left: 15px;
    padding: 5px;

    p {
      &:last-child {
        margin-top: 5px;
        font-size: 14px;
        color: ${(prop) => prop.theme.stoke};
      }
    }
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  position: relative;
  top: -15px;

  .action {
    display: flex;
    flex-direction: column;

    p {
      text-align: center;
    }

    & + .action {
      margin-left: 40px;
    }
  }
`;

export const InfoBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 30px;
  background: #ffffff;

  .info-box {
    border: 1px solid ${borderColor};
    height: 100px;
    padding: 16px 24px;
    .invoice-info {
      color: #828282;
    }
  }
`;

export const FooterBox = styled.div`
  display: grid;
  grid-template-columns: 50% 1fr 1fr;
`;

const BreakLine = styled.hr`
  border-top: 1px solid ${borderColor};
  margin-bottom: 24px;
`;

const ProductContainer = styled.div`
  display: grid;
  grid-row-gap: 24px;
`;

const Invoice = () => {
  const { invoiceId } = useParams();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    name: '',
    shippingType: '',
    expiredAt: '',
    price: '',
    items: [],
    shop: { logoUrl: '', name: '' },
    status: '',
    shippingFee: 0,
    shippingLocation: {
      addressLine: '',
      district: '',
      province: '',
      ward: '',
    },
    individualTrackingUrl: '',
    totalPrice: '',
    orderFee: '',
    escrowFee: '',
    createdAt: '',
    description: '',
    id: '',
    invoiceId: '',
    invoiceVersion: '',
    totalWeight: '',
    assess: {assessType: ''}
  });
  const [productMargin, setProductMargin] = useState(0);
  const [formError, setFormError] = useState('');
  const { shop } = invoiceData;

  const [
    loadDetailInvoice,
    { loading, data: detailInvoiceData, error: loadDetailInvoiceError },
  ] = useLazyQuery(GET_DETAILED_INVOICE_BY_ID, {
    variables: {
      id: invoiceId,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [
    getAggregatedInvoiceOrderForIndividual,
    {
      loading: getAggregatedInvoiceOrderForIndividualLoading,
      error: getAggregatedInvoiceOrderForIndividualError,
      data: getAggregatedInvoiceOrderForIndividualData,
    },
  ] = useLazyQuery(GET_AGGREGATED_INVOICE_ORDER_FOR_INDIVIDUAL, {
    variables: {
      id: invoiceId,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [
    acceptInvoice,
    {
      data: acceptInvoiceData,
      loading: acceptLoading,
      error: acceptInvoiceError,
    },
  ] = useMutation(ACCEPT_INVOICE, {
    errorPolicy: 'all',
    variables: {
      cmd: {
        invoiceId,
      },
    },
  });

  // useEffect(() => {
  //   if (invoiceId) {
  //     loadDetailInvoice();
  //   }
  // }, [invoiceId]);

  useEffect(() => {
    if (invoiceId) {
      getAggregatedInvoiceOrderForIndividual();
    }
  }, [invoiceId]);

  useEffect(() => {
    if (invoiceData?.getAggregatedInvoice?.data) {
      const {
        name,
        shippingType,
        expiredAt,
        price,
        items,
        shop,
      } = invoiceData?.getAggregatedInvoice?.data;
      setInvoiceData({ name, shippingType, expiredAt, price, items, shop });
    }
  }, [invoiceData?.getAggregatedInvoice?.data]);

  useEffect(() => {
    const invoiceData =
      getAggregatedInvoiceOrderForIndividualData
        ?.getAggregatedInvoiceOrderForIndividual?.data;
    if (invoiceData) {
      const {
        id,
        invoice,
        individualId,
        shippingPartner,
        shippingLocation,
        shippingFee,
        individualTrackingUrl,
        orderFee,
        status,
        reason,
        totalPrice,
        createdAt,
        updatedAt,
        assess,
        paymentMethod,
      } = invoiceData;
      const {
        invoiceId,
        invoiceVersion,
        name,
        description,
        shop,
        shippingType,
        escrowFee,
        items,
        price,
        totalWeight,
      } = invoice;
      setInvoiceData({
        name,
        shippingType,
        price,
        items,
        shop,
        status,
        shippingFee,
        shippingLocation,
        individualTrackingUrl,
        totalPrice,
        orderFee,
        escrowFee,
        assess
      });
    }
  }, [
    getAggregatedInvoiceOrderForIndividualData
      ?.getAggregatedInvoiceOrderForIndividual?.data,
  ]);

  useEffect(() => {
    if (acceptInvoiceData?.acceptInvoice?.data) {
      setOpen(true);
    }
  }, [acceptInvoiceData?.acceptInvoice?.data]);

  // MARK_SATISFIED_WITH_INVOICE
  const [
    markSatisfiedWithInvoice,
    {
      data: markSatisfiedWithInvoiceData,
      loading: markSatisfiedWithInvoiceLoading,
      error: markSatisfiedWithInvoiceError,
    },
  ] = useMutation(MARK_SATISFIED_WITH_INVOICE, {
    errorPolicy: 'all',
    variables: {
      cmd: {
        invoiceId,
      },
    },
  });

  useEffect(() => {
    if (markSatisfiedWithInvoiceData?.markSatisfiedWithInvoice?.success) {
    }
  }, [markSatisfiedWithInvoiceData?.markSatisfiedWithInvoice?.success]);

  // UPDATE_RETURN_SHIPPING_INFO
  const [
    updateReturnShippingInfo,
    {
      data: updateReturnShippingInfoData,
      loading: updateReturnShippingInfoLoading,
      error: updateReturnShippingInfoError,
    },
  ] = useMutation(UPDATE_RETURN_SHIPPING_INFO, {
    errorPolicy: 'all',
    variables: {
      cmd: {
        assessId: '',
        shippingType: '', //BY_USER BY_SOBY
        shippingLocationId: '',
        returnFeePaidBy: '', //INDIVIDUAL SHOP
        bankCode: '', // ABBANK
        accountType: '', // ATM_CARD BANK_ACCOUNT
        accountNumber: '',
        accountOwner: '',
        accountIssuedOn: '',
        bankBranch: '',
      },
    },
  });

  // Error handle
  useEffect(() => {
    if (
      markSatisfiedWithInvoiceError?.message ||
      loadDetailInvoiceError?.message ||
      getAggregatedInvoiceOrderForIndividualError?.message ||
      acceptInvoiceError?.message ||
      updateReturnShippingInfoError?.message
    ) {
      setFormError(
        markSatisfiedWithInvoiceError?.message ??
          loadDetailInvoiceError?.message ??
          getAggregatedInvoiceOrderForIndividualError?.message ??
          acceptInvoiceError?.message ??
          updateReturnShippingInfoError?.message
      );
    }
  }, [
    markSatisfiedWithInvoiceError?.message,
    loadDetailInvoiceError?.message,
    getAggregatedInvoiceOrderForIndividualError?.message,
    acceptInvoiceError?.message,
    updateReturnShippingInfoError?.message,
  ]);

  const handleCheckout = () => {
    invoiceId ? setOpen(true) : acceptInvoice();
  };

  return loading ||
    acceptLoading ||
    getAggregatedInvoiceOrderForIndividualLoading ||
    updateReturnShippingInfoLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Page>
        <Box className="main-box">
          <div>
            <h2>{invoiceData.name}</h2>
            <h4 style={{ textTransform: 'capitalize' }}>
              {invoiceData.status?.toLocaleLowerCase()}
            </h4>
          </div>
          {invoiceData.assess?.assessType === 'PROCESSING' ? (
            <ActionContainer>
              <Link className="action" to={`/return-request/${invoiceId}`}>
                <CloseIcon />
                <p>Reject</p>
              </Link>
              <div className="action">
                <AcceptIcon />
                <p>Accept</p>
              </div>
            </ActionContainer>
          ) : null}
        </Box>

        <InfoBox>
          <div className="info-box">
            <p>
              <b>Invoice from</b>
            </p>
            <p className="invoice-info">{shop.name}</p>
          </div>
          <div className="info-box">
            <p>
              <b>Shipping address</b>
            </p>
            <p className="invoice-info">
              {`${invoiceData?.shippingLocation?.addressLine}, ${invoiceData?.shippingLocation?.ward}, ${invoiceData?.shippingLocation?.district}, ${invoiceData?.shippingLocation?.province}`}
            </p>
          </div>
          <div className="info-box">
            <p>
              <b>Tracking code</b>
            </p>
            <p className="invoice-info">{invoiceData.individualTrackingUrl}</p>
          </div>
        </InfoBox>

        <Grid>
          <p className="title-info">
            <b>Products list</b>
          </p>
          <p className="title-info">
            <b>Subtotal</b>
          </p>
          <p className="title-info">
            <b>Qty</b>
          </p>
          <p className="title-info last-child">
            <b>Total</b>
          </p>
        </Grid>
        <BreakLine />

        <ProductContainer>
          {invoiceData.items.map((x) => {
            const {
              id: itemId,
              price: totalPrice,
              product: {
                name: productName,
                id,
                imageUrls: [imageUrl],
              },
              sku: { properties, currentPrice },
              quantity: productQuantity,
            } = x;
            return (
              <Grid key={itemId}>
                <Product className="title-info">
                  <img src={imageUrl} alt="" />
                  <div>
                    <p>{productName}</p>
                    <p>Blue bird shop</p>
                  </div>
                </Product>
                <p className="title-info">{currencyFormatter(currentPrice)}</p>
                <p className="title-info">{productQuantity}</p>
                <p className="title-info last-child">
                  {currencyFormatter(totalPrice)}
                </p>
              </Grid>
            );
          })}
        </ProductContainer>
        <BreakLine />
        <FooterBox>
          <div></div>
          <p>Subtotal</p>
          <p className="text-right">{currencyFormatter(invoiceData.price)}</p>
        </FooterBox>
        <FooterBox>
          <div></div>
          <p>Safebuy fee</p>
          <p className="text-right">
            {currencyFormatter(invoiceData.escrowFee)}
          </p>
        </FooterBox>
        <FooterBox>
          <div></div>
          <p>Shipping fee</p>
          <p className="text-right">
            {currencyFormatter(invoiceData.shippingFee)}
          </p>
        </FooterBox>
        <FooterBox>
          <div></div>
          <p>
            <b>Total</b>
          </p>
          <p className="text-right">
            <b>{currencyFormatter(invoiceData.totalPrice)}</b>
          </p>
        </FooterBox>
      </Page>

      <SobyModal open={openError} setOpen={setOpenError}>
      {formError ? (
        <ErrorPopup content={formError} setOpen={setOpenError} />
      ) : null}
    </SobyModal>
    </React.Fragment>
  );
};

export default Invoice;
