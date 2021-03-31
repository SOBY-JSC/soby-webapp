import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import { Container } from './receive-invoice.styles';
import { useParams } from 'react-router-dom';
import { ReactComponent as Extra } from 'shared/assets/extra.svg';
import {
  ACCEPT_INVOICE,
  GET_DETAILED_INVOICE_BY_ID,
  GET_DETAILED_INVOICE_FOR_INDIVIDUAL,
} from 'graphQL/repository/invoice.repository';
import Spinner from 'components/ui/spinner/spinner.component';
import { timestampToDate } from 'shared/utils/getDate';
import { currencyFormatter } from 'shared/utils/formatCurrency';
import InvoiceProductList from 'components/invoice-product-list/invoice-product-list.component';
import SobyModal from 'components/ui/modal/modal.component';
import ShippingInfo from 'components/shipping-info/shipping-info.component';

const ReceiveInvoice = ({ history, hideCheckout }) => {
  const { invoiceId } = useParams();
  const [open, setOpen] = useState(false);
  const [shopData, setShopData] = useState({
    name: '',
    shippingType: '',
    expiredAt: '',
    price: '',
    items: [],
    shop: { logoUrl: '', name: '' },
  });

  const [
    loadDetailInvoice,
    { loading, error, data: invoiceData },
  ] = useLazyQuery(GET_DETAILED_INVOICE_BY_ID, {
    variables: {
      id: invoiceId,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [
    acceptInvoice,
    { data: acceptInvoiceData, error: acceptErrors, loading: acceptLoading },
  ] = useMutation(ACCEPT_INVOICE, {
    errorPolicy: 'all',
    variables: {
      cmd: {
        invoiceId,
      },
    },
  });

  useEffect(() => {
    loadDetailInvoice();
  }, []);

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
      setShopData({ name, shippingType, expiredAt, price, items, shop });
    }
  }, [invoiceData?.getAggregatedInvoice?.data]);

  useEffect(() => {
    if (acceptInvoiceData?.acceptInvoice?.data) {
      setOpen(true);
    }
  }, [acceptInvoiceData?.acceptInvoice?.data]);

  if (loading || acceptLoading) return <Spinner />;
  if (error || acceptErrors) return `Error! ${error}`;

  if (!!acceptErrors) {
    acceptErrors?.graphQLErrors?.map((x) => {
      if (x?.extensions?.code === 401) {
        history.push(`/phone-signin/${invoiceId}`);
      }
      return null;
    });
  }

  const handleNavigate = () => {
    acceptInvoice();
  };

  return (
    <React.Fragment>
      <Container>
        <div className="main-content">
          <div className="content-left">
            <div className="box-top">
              <div className="header-group">
                <div className="shop-name">
                  <img src={shopData.shop.logoUrl} alt="" />
                  <p className="h2">{shopData.shop.name}</p>
                </div>
                <Extra />
              </div>

              <p>
                <b>{shopData.name}</b>
              </p>
              <div className="item-wrapper">
                <p>Expriration date</p>
                <p>{timestampToDate(shopData.expiredAt)}</p>
              </div>

              <div className="item-wrapper">
                <p className="auto-fit">Hình thức giao hàng</p>
                <div>
                  <div className="option-chip">
                    {shopData.shippingType === 'BY_SOBY'
                      ? 'Soby ship'
                      : 'Seller ship'}
                  </div>
                </div>
              </div>

              <div className="box-tag">
                <div>Check out</div>
                <div className="last"></div>
                <div>
                  <b>{currencyFormatter(shopData.price)}</b>
                </div>
              </div>

              <div className="circle"></div>
            </div>

            <InvoiceProductList items={shopData.items} />
            {hideCheckout ? null : (
              <button onClick={handleNavigate}>Check out</button>
            )}
          </div>
        </div>
      </Container>
      <SobyModal open={open} setOpen={setOpen}>
        <ShippingInfo
          invoiceIndividualId={acceptInvoiceData?.acceptInvoice?.data?.id}
        />
      </SobyModal>
      )
    </React.Fragment>
  );
};

export default ReceiveInvoice;

// <div className="item-wrapper">
//               <p>Status</p>
//               <div className="status">
//                 <Clock />
//                 <p>Waiting</p>
//               </div>
//             </div>
