import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';

import { Container } from './your-transactions.styles';
import ReceiveInvoice from '../receive-invoice/receive-invoice.component';

import usePhoneNumber from 'shared/hooks/usePhoneNumber';
import { ErrorTitle } from './your-transactions.styles';
import Dropdown from 'components/ui/dropdown/dropdown.component';

import {
  PROVINCE_LIST,
  DISTRICT_LIST,
  WARD_LIST,
} from 'shared/constants/vietnamstate.constant';

const YourTransaction = ({ name }) => {
  const { invoiceId } = useParams();
  const [phoneNumberIntl, setPhoneNumberIntl] = useState('');

  const { phoneCountryCode, phoneNumber } = usePhoneNumber(phoneNumberIntl);
  const [inputValidation, setInputValidation] = useState({
    isPasswordValid: true,
    isPhoneValid: true,
  });

  // mock
  const [province, setProvince] = useState('71');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const provinceList = PROVINCE_LIST;
  const districtList = DISTRICT_LIST.filter((x) => x.parentId == '71');
  let wardList = WARD_LIST.filter((x) => x.parentId == district);

  const onSelectDistrictChange = (value) => {
    setDistrict(value);
    setWard('');
    wardList = WARD_LIST.filter((x) => x.parentId == district);
  };

  const { isPhoneValid } = inputValidation;

  return (
    <Container>
      <div className="box-left">
        <p className="title">
          <b>Thông tin giao hàng</b>
        </p>
        <label htmlFor="">Tên người nhận</label>
        <input type="text" placeholder="Brian Nguyen" />
        <label htmlFor="">Địa chỉ</label>
        <input type="text" placeholder="H3 buidling ... HCMcity" />

        <div className="select-wrapper">
          <Dropdown
            options={provinceList}
            onChange={setProvince}
            value={province}
          />
          <Dropdown
            options={districtList}
            onChange={onSelectDistrictChange}
            value={district}
          />
          <Dropdown options={wardList} onChange={setWard} value={ward} />
        </div>

        <label htmlFor="">Số điện thoại</label>
        <PhoneInput
          country="US"
          international
          withCountryCallingCode
          initialValueFormat="national"
          countryCallingCodeEditable={false}
          defaultCountry="VN"
          name="phoneNumber"
          value={phoneNumberIntl}
          onChange={(value) => setPhoneNumberIntl(value)}
        />
        {!isPhoneValid ? (
          <ErrorTitle>Your phone number is not correct</ErrorTitle>
        ) : null}
        <button>Check out</button>
      </div>
      <ReceiveInvoice hideCheckout />
    </Container>
  );
};

export default YourTransaction;
