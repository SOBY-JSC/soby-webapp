import React from 'react';
import ImageGallery from '../carousel/carousel.component';

import { Container } from './product-listcard.styles';
import { currencyFormatter } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';
import ProductCard from '../product-card/product-card.component';

const ProductListCard = ({ records = [] }) => {
  return (
    <Container>
      <div className="content-bottom">
        {records.map((x) => {
          let sku = {};
          if (x.skus.length) {
            sku = x.skus[x.skus.length - 1];
          }
          return (
            <ProductCard
              key={x.id}
              id={x.id}
              imageUrls={x.imageUrls}
              currentPrice={sku?.currentPrice}
              description={x.description}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default ProductListCard;
