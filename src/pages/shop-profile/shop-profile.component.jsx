/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import { GET_AGGREGATED_SHOP } from 'graphQL/repository/shop.repository';
import { SEARCH_PRODUCT } from 'graphQL/repository/product.repository';

import Spinner from 'components/ui/spinner/spinner.component';
import SobyModal from 'components/ui/modal/modal.component';
import ErrorPopup from 'components/ui/error-popup/error-popup.component';
import locationImg from 'shared/assets/location.svg';
import mailImg from 'shared/assets/mail-black.svg';
import wallpaperImg from 'shared/assets/wallpaper.svg';
import shareImg from 'shared/assets/share.svg';
import phoneImg from 'shared/assets/phone-circle.svg';
import heedImg from 'shared/assets/heed.svg';
import greenmarkImg from 'shared/assets/greenmark.svg';

import buildAddressString from 'shared/utils/buildAddressString';
import {
  bodyColor,
  borderColor,
  greenColor,
  mainColor,
  orangeColor,
  redColor,
  yellowColor,
} from 'shared/css-variable/variable';
import SharedBreadcrumb from 'components/shared-breadcrumb/shared-breadcrumb.component';
import ShopVerifies from 'components/shop-verifies/shop-verifies.component';

const Container = styled.div`
  margin: auto;
  .container-1 {
    background-color: white;
    height: 5.2rem;
    padding: 1.2rem;
  }

  .btn-rank {
    display: flex;
  }

  .heed-icon {
    margin-left: 0.2665rem;
    width: 0.6665rem;
    height: 0.6665rem;
    cursor: pointer;
  }

  .btn-point {
    display: flex;
  }

  .mean {
    margin-left: 0.4rem;
    color: ${bodyColor};
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

  @media screen and (max-width: 1024px) {
    .rank-info {
      justify-content: flex-start;
      .mean {
        font-weight: normal;
        font-size: 14px;
        color: ${bodyColor};
        &::before {
          content: '- ';
        }
      }
    }
  }
`;

const Description = styled.p`
  color: ${bodyColor};
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
  .row-header {
    display: flex;
    justify-content: space-between;
  }
`;

const NewProductBox = styled(Link)`
  display: grid;
  justify-content: center;
  img {
    width: 172px;
    height: 172px;
    margin-bottom: 13.6.4rem;
  }
`;

const PromotionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(172px, 172px));
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
  grid-template-columns: repeat(auto-fit, minmax(172px, 172px));
  grid-gap: 1.2rem;
  margin-top: 0.8rem;
  @media screen and (max-width: 500px) {
    justify-content: center;
    grid-template-columns: 1fr;
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
    cursor: pointer;
  }
  img.avatar {
    width: 6rem;
    height: 6rem;
    position: absolute;
    bottom: -3rem;
    left: 1.35rem;
  }

  @media screen and (max-width: 600px) {
    img.avatar {
      width: 56px;
      height: 56px;
      bottom: -33px;
    }
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
  padding: 0 1.2rem;
  h3 {
    padding: 1.85rem 0 0 7.35rem;
  }
  display: flex;

  @media screen and (max-width: 600px) {
    h3 {
      padding: 10px 0 0 76.8px;
    }
    height: 49px;
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
    grid-gap: 0;
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
    border-radius: 100px;
    img {
      width: 1.25rem;
      height: 1.25rem;
      margin: -0.3rem -0.15rem 0 0;
    }

    h2 {
      position: relative;
      top: -24px;
      right: -22px;
    }
  }
`;

const Icon = styled(Link)`
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
  pointer-events: ${(props) => props.default && 'none'};
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
  padding: 0.525rem 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.8rem;
  color: ${bodyColor};
  font-size: 0.8rem;
`;

const TagOption = styled.div`
  margin-top: 0.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
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

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-gap: 0.4rem;
  }
`;

const TooltipData = styled.div`
  background-color: white;
`;

const PhoneBtn = styled.div`
  height: 2rem;
  background: ${mainColor};
  padding: 0.2rem 0.6rem;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  img.phone-icon {
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.5rem;
  }
  .btn-click {
    font-size: 0.7rem;
    text-transform: uppercase;
    flex: 1;
    text-align: right;
    margin-left: 1.2rem;
  }
  margin-top: 1rem;
  @media screen and (max-width: 600px) {
    display: ${(props) => (props.hide ? 'flex' : 'none')};
  }
`;

const MobileSection = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  background-color: white;
  @media screen and (max-width: 1024px) {
    margin: 1rem 0;
    padding: 0.8rem 1.2rem;
    display: ${(props) => (props.hide ? 'block' : 'none')};
    color: ${bodyColor};
  }
`;

const RankPoint = styled.h2`
  display: ${(props) => (props.show ? 'block' : 'none')};
  @media screen and (max-width: 1024px) {
    display: ${(props) => (props.hide ? 'block' : 'none')};
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
    kycStatus: '',
  });
  const [phoneString, setPhoneString] = useState('');
  const [togglePhone, setTogglePhone] = useState(false);

  const [breadcrumbs, setBreadcrumb] = useState([
    {
      name: 'Home',
      src: '/',
    },
  ]);

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
        kycStatus,
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
        kycStatus,
      });

      setPhoneString(`${phoneCountryCode} ${phoneNumber.slice(0, 4)} *** ****`);

      setBreadcrumb([
        {
          name: 'Home',
          src: '/',
        },
        {
          name: name,
          src: `/shop-profile/${shopId}`,
        },
      ]);

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

  const getColor = (name) => {
    switch (name) {
      case 'Red':
        return redColor;
      case 'Orange':
        return orangeColor;
      case 'Yellow':
        return yellowColor;
      case 'Green':
        return greenColor;
      case 'Blue':
        return mainColor;
      default:
        return redColor;
    }
  };

  return getAggregatedShopLoading || productLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <SharedBreadcrumb breadcrumbs={breadcrumbs} />
      <Container>
        <HeadRow>
          <HeadPromotion
            style={{ backgroundImage: shopInfo.coverUrl || wallpaperImg }}
          >
            <img
              className="share-icon"
              src={shareImg}
              alt=""
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                window.alert('Shop url is copied');
              }}
            />
            <img className="avatar" src={shopInfo.logoUrl} alt="" />
          </HeadPromotion>
          <NewHeadPromotion>
            <h3>{shopInfo.name}</h3>
            <PhoneBtn show>
              <img className="phone-icon" src={phoneImg} alt="" />
              <p>
                {togglePhone
                  ? formatPhoneNumberIntl(
                      `${shopInfo.phoneCountryCode}${shopInfo.phoneNumber}`
                    )
                  : phoneString}
              </p>
              <p
                className="btn-click"
                onClick={() => setTogglePhone(!togglePhone)}
              >
                {togglePhone ? 'Click to hide' : 'Click to show'}
              </p>
            </PhoneBtn>
          </NewHeadPromotion>
        </HeadRow>
        <InfoContainer>
          <div>
            <div className="rank-info">
              <div className="btn-rank">
                <h5>Soby Rank</h5>
                <img
                  className="heed-icon"
                  src={heedImg}
                  alt=""
                  data-tip
                  data-for="rank-info"
                  data-event="click focus"
                />
              </div>
              <div className="btn-point">
                <RankPoint
                  style={{
                    color: getColor(shopInfo.shopRank.rank.name),
                  }}
                  show
                >
                  {shopInfo.shopRank.totalPoints
                    ? +shopInfo.shopRank.totalPoints / 10
                    : ''}
                </RankPoint>

                <h5 className="mean">{shopInfo.shopRank.rank.description}</h5>
              </div>
            </div>
            <p className="btn-number">01</p>
            <StatusContainer percent={+shopInfo.shopRank.totalPoints}>
              <div
                className="status-bar"
                style={{
                  backgroundColor: getColor(shopInfo.shopRank.rank.name),
                }}
              >
                <RankPoint
                  style={{
                    color: getColor(shopInfo.shopRank.rank.name),
                  }}
                  hide
                >
                  {shopInfo.shopRank.totalPoints
                    ? +shopInfo.shopRank.totalPoints / 10
                    : ''}
                </RankPoint>
                <img src={greenmarkImg} alt="" />
              </div>
            </StatusContainer>

            <ShopVerifies
              status={shopInfo.kyb?.status}
              kycStatus={shopInfo.kycStatus}
              shopUrls={shopInfo.shopUrls}
            />

            <MobileSection show>
              <Categories>
                <h5>Shop categories</h5>
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
            </MobileSection>
          </div>
          <PhoneBtn hide>
            <img className="phone-icon" src={phoneImg} alt="" />
            <p>
              {togglePhone
                ? formatPhoneNumberIntl(
                    `${shopInfo.phoneCountryCode}${shopInfo.phoneNumber}`
                  )
                : phoneString}
            </p>
            <p
              className="btn-click"
              onClick={() => setTogglePhone(!togglePhone)}
            >
              {togglePhone ? 'Hide' : 'Show'}
            </p>
          </PhoneBtn>
          <div>
            <MobileSection show>
              <h5>Shop description</h5>
              <p>{shopInfo.description}</p>
            </MobileSection>

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
          </div>
        </InfoContainer>

        <MobileSection hide>
          <h3>Shop description</h3>
          <p>{shopInfo.description}</p>
        </MobileSection>

        <MobileSection hide>
          <h3>Shop categories</h3>
          <TagOption>
            {shopInfo.categories.length ? (
              shopInfo.categories.map((x) => {
                const { id, name } = x;
                return (
                  <Option key={id} className="truncate">
                    {name}
                  </Option>
                );
              })
            ) : (
              <p className="body-color">Không có phân loại</p>
            )}
          </TagOption>
        </MobileSection>

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
      </Container>
      <SobyModal open={open} setOpen={setOpen}>
        {formError ? (
          <ErrorPopup content={formError} setOpen={setOpen} />
        ) : null}
      </SobyModal>

      <ReactTooltip
        id="rank-info"
        aria-haspopup="true"
        role="example"
        place="right"
        type="light"
        effect="solid"
        globalEventOff="dbclick"
      >
        <TooltipData>
          <h5>Soby Rank – Chỉ số uy tín</h5>
          <p className="mg-b-8">
            Giá trị của Soby Rank đối với một cửa hàng sẽ tương đương với tầm
            quan trọng của điểm IMDB đối với một bộ phim, hay của số sao
            Michelin đối với một nhà hàng.
          </p>
          <h5 className="primary-color clickable">Read more</h5>
        </TooltipData>
      </ReactTooltip>
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
