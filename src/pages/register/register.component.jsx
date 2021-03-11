/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import FormInput from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import passwordValidation from '../../utils/passwordValidation';
import emailValidation from '../../utils/emailValidation';
import {
  REGISTER,
  SEND_PHONE_VERIFICATION,
  generateEncryptionKey,
  generateSignInKey,
  getSignature,
  LOGIN_WITH_SIGNATURE,
} from '../../repository/individual.repository';
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  sendPhoneVerification,
} from '../../redux/user/user.actions';

import {
  SignUpContainer,
  ErrorTitle,
  CardWrapper,
  RegisterContainer,
  FormContainer,
  InputGroup,
} from './register.styles';
import {
  selectPhoneNumber,
  selectUserCredential,
} from '../../redux/user/user.selectors';
import PolicyNavigate from '../../components/policy-navigate/policy-navigate.component';
import Spinner from '../../components/spinner/spinner.component';

const Register = ({
  history,
  signUpSuccess,
  signUpFailure,
  signUpStart,
  phone,
  userKeyPair,
}) => {
  const [userCredentials, setUserCredentials] = useState({
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    encryptionSecret: '',
    encryptionPublicKey: '',
    signingSecret: '',
    signingPublicKey: '',
  });
  const [inputValidation, setInputValidation] = useState({
    isPasswordValid: true,
    isEmailValid: true,
    isFirstNameValid: true,
    isLastNameValid: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { firstName, lastName, email, password } = userCredentials;

  const {
    isPasswordValid,
    isEmailValid,
    isFirstNameValid,
    isLastNameValid,
  } = inputValidation;
  const { phoneNumber, phoneCountryCode } = phone;

  const [register, { data: registerData, errors }] = useMutation(REGISTER, {
    errorPolicy: 'all',
  });

  const [signinWithSignature, { data: signatureData }] = useMutation(
    LOGIN_WITH_SIGNATURE,
    {
      errorPolicy: 'all',
    }
  );

  const [sendPhoneVerification] = useMutation(SEND_PHONE_VERIFICATION, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (signatureData?.loginWithSignature?.data?.accessToken) {
      localStorage.setItem(
        'token',
        signatureData?.loginWithSignature?.data?.accessToken
      );

      sendPhoneVerification({
        variables: {
          cmd: { phoneCountryCode, phoneNumber },
        },
      });

      setIsLoading(false);

      history.push('/phone-verification');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureData?.loginWithSignature?.success]);

  useEffect(() => {
    if (registerData?.register?.data?.id) {
      localStorage.setItem('token', '');

      const signature = getSignature(
        userKeyPair?.signingPublicKey,
        userKeyPair?.signingSecret,
        password
      );
      signinWithSignature({
        variables: {
          cmd: { signature },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerData?.register?.success]);

  if (errors) {
    signUpFailure(errors);
    setIsLoading(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      encryptionSecret,
      encryptionPublicKey,
    } = await generateEncryptionKey(password);

    const { signingSecretKey, signingPublicKey } = generateSignInKey(password);

    const isPasswordValid = passwordValidation(password);
    const isEmailValid = emailValidation(email);

    setInputValidation({
      ...inputValidation,
      isPasswordValid,
      isEmailValid,
      isFirstNameValid: !!firstName,
      isLastNameValid: !!lastName,
    });

    if (isPasswordValid && isEmailValid) {

      setIsLoading(true);

      setUserCredentials({
        ...userCredentials,
        encryptionSecret,
        signingSecret: signingSecretKey,
      });

      const cmd = {
        ...userCredentials,
        encryptionSecret,
        encryptionPublicKey,
        signingSecret: signingSecretKey,
        signingPublicKey,
        phoneNumber,
        phoneCountryCode,
      };
      signUpStart();
      register({
        variables: {
          cmd,
        },
      });
      signUpSuccess({
        signingSecret: signingSecretKey,
        encryptionSecret,
        signingPublicKey,
        encryptionPublicKey,
      });
    }
  };

  const handleChange = (event) => {
    if (!event) {
      return;
    }
    const { name, value } = event?.target;

    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return (
    isLoading ?
      <Spinner/>
    :
    <RegisterContainer>
      <CardWrapper>
        <SignUpContainer>
          <div className="soby-title">Đăng ký</div>
          <FormContainer>
            <form onSubmit={handleSubmit}>
              <div className="second-col">
                <div>
                  <div className="form-label">First name</div>
                  <FormInput
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    label="Brian"
                  />
                  {!isFirstNameValid ? (
                    <ErrorTitle>The field is required</ErrorTitle>
                  ) : null}
                </div>
                <div>
                  <div className="form-label">Last name</div>
                  <FormInput
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    label="John"
                  />
                  {!isLastNameValid ? (
                    <ErrorTitle>The field is required</ErrorTitle>
                  ) : null}
                </div>
              </div>

              <InputGroup>
                <div className="form-label">Your email</div>
                <FormInput
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  label="Email"
                />
                {!isEmailValid ? (
                  <ErrorTitle>Your email is not correct</ErrorTitle>
                ) : null}
              </InputGroup>

              <InputGroup>
                <div className="form-label">Password</div>
                <FormInput
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  label="Abcabc123#"
                  required
                />
                {!isPasswordValid ? (
                  <ErrorTitle>
                    Your password must be between 8 to 20 characters which
                    contain at least one numeric digit, one uppercase and one
                    lowercase letter
                  </ErrorTitle>
                ) : null}
              </InputGroup>

              <CustomButton type="submit">Đăng ký</CustomButton>
            </form>
          </FormContainer>
        </SignUpContainer>
        <PolicyNavigate isSignIn />
      </CardWrapper>
    </RegisterContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  phone: selectPhoneNumber,
  userKeyPair: selectUserCredential,
});

const mapDispatchToProps = (dispatch) => ({
  signUpStart: (userCredentials) => dispatch(signUpStart(userCredentials)),
  signUpFailure: (error) => dispatch(signUpFailure(error)),
  signUpSuccess: (keyPair) => dispatch(signUpSuccess(keyPair)),
  sendPhoneVerification: () => dispatch(sendPhoneVerification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
