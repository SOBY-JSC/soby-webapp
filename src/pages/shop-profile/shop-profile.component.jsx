/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import { GET_AGGREGATED_SHOP } from 'graphQL/repository/shop.repository';
import { SEARCH_PRODUCT } from 'graphQL/repository/product.repository';

import Spinner from 'components/ui/spinner/spinner.component';
import SobyModal from 'components/ui/modal/modal.component';
import ErrorPopup from 'components/ui/error-popup/error-popup.component';
import facebookImg from 'shared/assets/facebook.svg';
import instagramImg from 'shared/assets/instagram.svg';
import locationImg from 'shared/assets/location.svg';
import mailImg from 'shared/assets/mail-black.svg';
import tickImg from 'shared/assets/tick.svg';
import wallpaperImg from 'shared/assets/wallpaper.svg';
import shareImg from 'shared/assets/share.svg';
import phoneImg from 'shared/assets/phone-circle.svg';
import heedImg from 'shared/assets/heed.svg';
import greenmarkImg from 'shared/assets/greenmark.svg';
import id1Img from 'shared/assets/id-1.svg';
import id2Img from 'shared/assets/id-2.svg';
import shopeeImg from 'shared/assets/shopee.svg';
import networkImg from 'shared/assets/network.svg';
import buildAddressString from 'shared/utils/buildAddressString';
import { borderColor, mainColor } from 'shared/css-variable/variable';

const Container = styled.div`
  margin: auto;
  .container-1 {
    background-color: white;
    height: 5.2rem;
    padding: 1.2rem;
    margin-bottom: 1.2rem;
  }

  .btn-rank {
    display: flex;
  }

  .heed-icon {
    margin-left: 0.2665rem;
    width: 0.6665rem;
    height: 0.6665rem;
  }

  .btn-point {
    display: flex;
  }

  .mean {
    margin-left: 0.4rem;
    color: #4f4f4f;
    font-size: 1rem;
  }

  .rank-info {
    display: flex;
    justify-content: space-between;
  }

  .btn-number {
    color: #bdbdbd;
    font-size: 0.6rem;
  }
`;

const Description = styled.p`
  color: #4f4f4f;
`;

const PromotionBox = styled.div`
  display: flex;
  img {
    width: 5.4rem;
    height: 5.4rem;
    margin-right: 1.15rem;
  }
`;

const Date = styled.p`
  font-size: 0.7rem;
  color: #f53535;
`;

const Row = styled.div`
  background-color: white;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  .row-header {
    display: flex;
    justify-content: space-between;
  }
`;

const NewProductBox = styled(Link)`
  img {
    width: 8.6rem;
    height: 8.6rem;
    margin-bottom: 13.6.4rem;
  }
`;

const PromotionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18.4rem, 18.4rem));
  grid-gap: 1.2rem;
  margin-top: 0.8rem;
  justify-content: center;
  @media screen and (max-width: 785px) {
    grid-template-columns: 1fr;
    justify-content: center;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8.6rem, 8.6rem));
  grid-gap: 1.2rem;
  margin-top: 0.8rem;
  @media screen and (max-width: 500px) {
    justify-content: center;
  }
`;

const HeadPromotion = styled.div`
  height: 10rem;
  background-image: url(${wallpaperImg});
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  position: relative;
  img.share-icon {
    width: 2.2rem;
    height: 2.2rem;
    margin: 0.8rem 0.8rem 0 0;
  }
  img.avatar {
    width: 6rem;
    height: 6rem;
    position: absolute;
    bottom: -3rem;
    left: 1.35rem;
  }
`;

const HeadRow = styled.div`
  background-color: white;
  margin-bottom: 1.2rem;
`;

const NewHeadPromotion = styled.div`
  background-color: white;
  height: 4.2rem;
  display: flex;
  justify-content: space-between;
  h3 {
    padding: 1.85rem 0 0 8.55rem;
  }
  display: flex;
  .phone-container {
    height: 2rem;
    background: ${mainColor};
    padding: 0.2rem 0.6rem;
    display: flex;
    align-items: center;
    color: white;
    border-radius: 3px;
    img.phone-icon {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.5rem;
    }
    .btn-click {
      font-size: 0.7rem;
      margin-left: 1.2rem;
      text-transform: uppercase;
    }
    margin: 1rem 1.25rem 0 0;
    @media screen and (max-width: 500px) {
      .btn-click {
        display: none;
      }
    }
  }
`;

const InfoContainer = styled.div`
  background: #ffffff;
  padding: 1.2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.2rem;
  margin-bottom: 1.2rem;
  justify-content: center;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StatusContainer = styled.div`
  background-color: ${borderColor};
  border-radius: 100px;
  .status-bar {
    display: flex;
    width: ${(props) => (props?.percent ? `${props?.percent}%` : '0%')};
    height: 0.5rem;
    justify-content: flex-end;
    background-color: #73cf11;
    img {
      width: 1.25rem;
      height: 1.25rem;
      margin: -0.3rem -0.15rem 0 0;
    }
  }
`;

const NewInfoBox = styled.div`
  .info-header {
    font-size: 0.8rem;
  }
`;

const TagIcon = styled.div`
  display: flex;
`;

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  margin-top: 1.5rem;
  margin-right: 0.4rem;
  background: #f2f2f2;
  border-radius: 0.15rem;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  img.tick {
    width: 0.5rem;
    height: 0.5rem;
    position: absolute;
    top: 0;
    right: 0;
  }
`;

const Categories = styled.div`
  margin-top: 0.8rem;
`;

const Option = styled.div`
  background: #f2f2f2;
  border-radius: 0.15rem;
  padding: 0.5rem 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.8rem;
  .option-info {
    color: #4f4f4f;
    font-size: 0.8rem;
  }
`;

const TagOption = styled.div`
  margin-top: 0.4rem;
  display: flex;
`;

const ContactGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1.2rem;
  grid-gap: 1.4rem;

  .contact-item {
    display: flex;

    img {
      width: 24px;
      height: 24px;
      margin-right: 0.6rem;
    }
  }
`;

const ShopProfile = () => {
  //   enum ConfirmationStatus {
  //     NOT_CONFIRMED
  //     CONFIRMED
  //     COMPLETED
  // }
  const { shopId } = useParams();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [shopInfo, setShopInfo] = useState({
    name: '',
    phoneCountryCode: '',
    phoneNumber: '',
    description: '',
    logoUrl: '',
    categories: [],
    shopUrls: [],
    kyb: { status: null },
    records: [],
    email: '',
    coverUrl: '',
    shippingLocation: {
      addressLine: '',
      country: '',
      district: '',
      province: '',
      ward: '',
    },
    shopRank: {
      items: [],
      rank: {},
    },
  });

  const [
    getAggregatedShop,
    {
      loading: getAggregatedShopLoading,
      error: getAggregatedShopError,
      data: getAggregatedShopData,
    },
  ] = useLazyQuery(GET_AGGREGATED_SHOP);
  const [
    searchProduct,
    { loading: productLoading, error: productError, data: productData },
  ] = useLazyQuery(SEARCH_PRODUCT);

  useEffect(() => {
    if (shopId) {
      getAggregatedShop({
        variables: { id: shopId },
      });
    }
  }, [shopId]);

  useEffect(() => {
    if (getAggregatedShopError?.message || productError?.message) {
      setFormError(getAggregatedShopError?.message || productError?.message);
      setOpen(true);
    }
  }, [getAggregatedShopError, productError]);

  useEffect(() => {
    if (getAggregatedShopData?.getAggregatedShop?.data) {
      const {
        name,
        phoneCountryCode,
        phoneNumber,
        description,
        logoUrl,
        categories,
        shopUrls,
        kyb,
        email,
        coverUrl,
        shippingLocations,
        shopRank,
      } = getAggregatedShopData?.getAggregatedShop?.data;
      const [shippingLocation] = shippingLocations;

      setShopInfo({
        ...shopInfo,
        name,
        phoneCountryCode,
        phoneNumber,
        description,
        logoUrl,
        categories,
        shopUrls,
        kyb,
        email,
        coverUrl,
        shippingLocation,
        shopRank,
      });

      searchProduct({
        variables: {
          searchInput: {
            page: 0,
            pageSize: 5,
            filters: null,
            queries: `shopId:${shopId}`,
            sorts: null,
          },
        },
      });
    }
  }, [getAggregatedShopData?.getAggregatedShop?.data]);

  useEffect(() => {
    if (productData?.searchProduct?.data?.records?.length) {
      setShopInfo({
        ...shopInfo,
        records: productData?.searchProduct?.data?.records,
      });
    }
  }, [productData?.searchProduct?.data]);

  return getAggregatedShopLoading || productLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Container>
        <div class="container">
          <HeadRow>
            <HeadPromotion
              style={{ backgroundImage: shopInfo.coverUrl || wallpaperImg }}
            >
              <img className="share-icon" src={shareImg} alt="" />
              <img className="avatar" src={shopInfo.logoUrl} alt="" />
            </HeadPromotion>
            <NewHeadPromotion>
              <h3>{shopInfo.name}</h3>
              <div className="phone-container">
                <img className="phone-icon" src={phoneImg} alt="" />
                <p>{`${shopInfo.phoneCountryCode} ${shopInfo.phoneNumber}`}</p>
                <p className="btn-click">Click to show</p>
              </div>
            </NewHeadPromotion>
          </HeadRow>
          <InfoContainer>
            <div>
              <div className="rank-info">
                <div className="btn-rank">
                  <div className="info-header">
                    <h5>Soby Rank</h5>
                  </div>
                  <img className="heed-icon" src={heedImg} alt="" />
                </div>
                <div className="btn-point">
                  <h2 className={shopInfo.shopRank.rank.name.toLowerCase()}>
                    {shopInfo.shopRank.totalPoints
                      ? +shopInfo.shopRank.totalPoints / 10
                      : ''}
                  </h2>
                  <h5 className="mean">{shopInfo.shopRank.rank.description}</h5>
                </div>
              </div>
              <p className="btn-number">01</p>
              <StatusContainer percent={+shopInfo.shopRank.totalPoints}>
                <div className="status-bar">
                  <img className="greenmark-icon" src={greenmarkImg} alt="" />
                </div>
              </StatusContainer>

              <TagIcon>
                {
                  // shopInfo.shopRank.items.map(x => {
                  //   const {rankItem: } = x;
                  // })
                }
                <Icon>
                  <img className="tick" src={tickImg} alt="" />
                  <img className="id1" src={id1Img} alt="" />
                </Icon>
                <Icon>
                  <img className="id2" src={id2Img} alt="" />
                </Icon>
                <Icon>
                  <img className="tick" src={tickImg} alt="" />
                  <img className="shopee" src={shopeeImg} alt="" />
                </Icon>
                <Icon>
                  <img className="id2" src={facebookImg} alt="" />
                </Icon>
                <Icon>
                  <img className="id2" src={networkImg} alt="" />
                </Icon>
                <Icon>
                  <img className="id2" src={instagramImg} alt="" />
                </Icon>
              </TagIcon>
              <Categories>
                <div className="info-header">
                  <p>
                    <b>Shop categories</b>
                  </p>
                </div>
                <TagOption>
                  {shopInfo.categories.length ? (
                    shopInfo.categories.map((x) => {
                      const { id, name } = x;
                      return (
                        <Option key={id}>
                          <p className="option-info">{name}</p>
                        </Option>
                      );
                    })
                  ) : (
                    <p className="body-color">Không có phân loại</p>
                  )}
                </TagOption>
              </Categories>
            </div>
            <NewInfoBox>
              <div className="info-header">
                <h5>Shop description</h5>
              </div>
              <p>{shopInfo.description}</p>
              <ContactGroup>
                <div className="contact-item">
                  <img src={locationImg} alt="" />
                  <p className="body-color">
                    {buildAddressString(shopInfo.shippingLocation)}
                  </p>
                </div>
                <div className="contact-item">
                  <img src={mailImg} alt="" />
                  <p className="body-color">address@email.com</p>
                </div>
              </ContactGroup>
            </NewInfoBox>
          </InfoContainer>

          <Row>
            <div className="row-header">
              <h3>New Product</h3>
              <h5 className="primary-color">See all</h5>
            </div>
            <ProductContainer>
              {shopInfo.records.map((x) => {
                const {
                  imageUrls: [imageUrl],
                  name,
                  skus: [sku],
                  id,
                } = x;
                const { originPrice } = sku;
                return (
                  <NewProductBox key={id} to={`/product/${id}`}>
                    <img src={imageUrl} alt="" />
                    <Description>{name}</Description>
                    <h5>{originPrice}</h5>
                  </NewProductBox>
                );
              })}
            </ProductContainer>
          </Row>
        </div>
      </Container>
      <SobyModal open={open} setOpen={setOpen}>
        {formError ? (
          <ErrorPopup content={formError} setOpen={setOpen} />
        ) : null}
      </SobyModal>
    </React.Fragment>
  );
};

export default ShopProfile;

// <Row>
//             <div className="row-header">
//               <h3>Promotion</h3>
//               <p>
//                 <b>See all</b>
//               </p>
//             </div>
//             <PromotionContainer>
//               <PromotionBox>
//                 <img src={airpod} alt="" />
//                 <div>
//                   <Description>
//                     Amazfit GTS 2e Smartwatch with 24H Heart Rate Monitor,
//                     Sleep, Stress and SpO2...
//                   </Description>
//                   <p>
//                     <b>8.220.000 đ</b>
//                   </p>
//                   <Date>
//                     <b>Offer end in - 3 days</b>
//                   </Date>
//                 </div>
//               </PromotionBox>
//               <PromotionBox>
//                 <img src={airpod} alt="" />
//                 <div>
//                   <Description>
//                     Amazfit GTS 2e Smartwatch with 24H Heart Rate Monitor,
//                     Sleep, Stress and SpO2...
//                   </Description>
//                   <p>
//                     <b>8.220.000 đ</b>
//                   </p>
//                   <Date>
//                     <b>Offer end in - 3 days</b>
//                   </Date>
//                 </div>
//               </PromotionBox>
//               <PromotionBox>
//                 <img src={airpod} alt="" />
//                 <div>
//                   <Description>
//                     Amazfit GTS 2e Smartwatch with 24H Heart Rate Monitor,
//                     Sleep, Stress and SpO2...
//                   </Description>
//                   <p>
//                     <b>8.220.000 đ</b>
//                   </p>
//                   <Date>
//                     <b>Offer end in - 3 days</b>
//                   </Date>
//                 </div>
//               </PromotionBox>
//             </PromotionContainer>
//           </Row>
