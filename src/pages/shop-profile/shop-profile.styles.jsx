import styled from 'styled-components';
import { mainColor } from '../../css-variable/variable';

export const ShopContainer = styled.div`
  padding: 0 240px;
  min-height: 150vh;
  font-family: 'Work Sans', sans-serif;
  margin-top: 80px;
  display: flex;
  .left-panel {
    margin-right: 40px;
  }
`;

export const CardShadow = styled.div`
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(194, 194, 194, 0.5);
  border-radius: 8px;
  transition: 0.3s;
  width: 453px;

  &.shop-name {
    height: 154px;
    display: flex;
    margin: 0 40px 32px 0;
    .info {
      margin: auto 0 auto 16px;
      .title {
        color: ${mainColor};
        line-height: 0;
      }
      .rank {
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 26px;
        margin: 0;
      }
    }

    img {
      width: 74px;
      height: 74px;
      margin: auto 0 auto 40px;
    }
  }

  &.shop-feedback {
    height: 276px;
    padding: 56px 48px;
    h3 {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: black;
      margin: 0 0 32px;
      padding: 0;
    }

    .info-group {
      display: flex;
      justify-content: space-between;
      p {
        font-weight: normal;
        font-size: 14px;
        margin: 0;
      }
    }
  }
`;

export const Card = styled.div`
  border: 1px solid rgba(194, 194, 194, 0.2);
  width: 453px;
  margin-bottom: 32px;
  padding: 24px;

  &.business-kyb {
    height: 402px;
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      .status {
        padding: 4px 12px;
        background: #2b74e4;
        border-radius: 4px;
        font-size: 20px;
        color: white;
      }
    }

    .info-group {
      border-bottom: 1px solid rgba(194, 194, 194, 0.5);
      padding-bottom: 8px;
      p + p {
        margin-top: 4px;
      }

      & + .info-group {
        margin-top: 16px;
      }
    }
  }
  &.personal-kyb {
    height: 82px;
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      .status {
        padding: 4px 12px;
        background: #f53535;
        border-radius: 4px;
        font-size: 20px;
        color: white;
      }
    }
  }

  h4 {
    font-weight: 600;
    font-size: 20px;
    line-height: 23px;
    margin: 0;
  }

  p {
    margin: 0;
    padding: 0;
    font-weight: normal;
    font-size: 18px;
  }
`;

export const MainContent = styled.div`
  flex: 2;
  h3 {
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    color: black;
    margin: 0 0 32px;
    padding: 0;
  }

  p {
    margin: 0 0 56px;
    padding: 0;
    font-weight: normal;
    font-size: 20px;
  }
  .category-list {
    display: flex;
    margin-bottom: 56px;
    .category-item {
      width: 199px;
      height: 46px;
      padding: 8px 20px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      display: flex;

      p {
        margin: auto 0 auto 8px;
      }

      & + .category-item {
        margin-left: 16px;
      }
    }
  }

  .shop-info {
    display: flex;

    p {
      font-size: 18px;
    }

    .wrapper {
      display: flex;
      width: 453px;
    }

    svg {
      margin-right: 16px;
    }
  }

  .website-group {
    margin: 56px 0;
    display: grid;
    grid-column-gap: 40px;
    grid-row-gap: 24px;
    grid-template-columns: repeat(2, 1fr);
    .wrapper {
      display: flex;
      justify-content: space-between;
      .sub-wrapper {
        display: flex;
      }
      p {
        margin: auto 0;
        &.url {
          font-size: 18px;
        }
      }
    }

    svg {
      margin-right: 16px;
      &.temp {
        width: 60px;
        height: 60px;
      }
    }

    .icon-wrapper {
      padding: 15px;
      height: 60px;
      width: 60px;
      margin-right: 16px;
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.07);
      border-radius: 8px;
    }
  }
`;