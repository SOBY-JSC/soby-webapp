/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@apollo/client';
import ErrorPopup from 'components/ui/error-popup/error-popup.component';
import SobyModal from 'components/ui/modal/modal.component';
import Spinner from 'components/ui/spinner/spinner.component';
import { UPDATE_PASSWORD } from 'graphQL/repository/individual.repository';
import React, { useEffect, useState } from 'react';
import passwordValidation from 'shared/utils/passwordValidation';
import styled from 'styled-components';

const Box = styled.form`
  width: 700px;
  padding: 48px 40px;
  background-color: #fff;
  border-radius: 8px;

  h2 {
    margin-bottom: 40px;
  }

  @media (max-width: 700px) {
    width: auto;
  }
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.error ? 0 : '30px')};

  @media (max-width: 700px) {
    flex-direction: column;
    margin-bottom: 0;
  }
`;

const Button = styled.input.attrs((props) => ({
  type: 'submit',
  value: 'Save',
}))`
  width: 100%;
  background-color: #f1f1f1;
  color: #2b74e4;
  font-weight: 700;
  padding: 14px 0 12px;
  border: 0;
  border-radius: 7px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.04);
  cursor: pointer;
`;

const InputContainer = styled.div`
  width: ${(props) => props.width || '100%'};

  @media (max-width: 700px) {
    width: 100%;
    margin-bottom: 30px;
  }
`;

const Input = styled.input.attrs((props) => ({
  type: 'password',
}))`
  width: 100%;
  padding: 8px 0;
  outline: 0;
  border: 0;
  border-radius: 0;
  border-bottom: 0.5px solid #c2c2c2;
  font-size: 18px;
`;

export const ErrorTitle = styled.h5`
  color: red;
  margin: 5px 0;
`;

const PasswordPopup = ({
  setOpenPasswordPopup,
  signingSecret,
  encryptionPublicKey,
  encryptionSecret,
}) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [state, setState] = useState({
    password: null,
    newPassword: null,
    confirmPassword: null,
    signingSecret,
    encryptionPublicKey,
    encryptionSecret,
  });
  const [inputValidation, setInputValidation] = useState({
    isPasswordNotValid: false,
    isNewPasswordNotValid: false,
    isPasswordDuplicateCurrent: false,
    isNewPasswordAndConfirmNotCorrect: false,
  });

  // UPDATE_PASSWORD
  const [
    updatePasswordMutation,
    {
      data: updatePasswordData,
      loading: updatePasswordLoading,
      error: updatePasswordError,
    },
  ] = useMutation(UPDATE_PASSWORD, {
    errorPolicy: 'all',
  });
  useEffect(() => {
    if (updatePasswordData?.updatePassword?.data) {
      setOpenPasswordPopup(false);
    }
  }, [updatePasswordData?.updatePassword?.data, updatePasswordMutation]);

  useEffect(() => {
    if (updatePasswordError?.message) {
      setFormError(updatePasswordError?.message);
      setOpen(true);
    }
  }, [updatePasswordError?.message]);

  const handleChange = (event) => {
    if (!event) {
      return;
    }
    const { name, value } = event?.target;

    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isPasswordNotValid = !passwordValidation(state.password);
    const isNewPasswordNotValid = !passwordValidation(state.newPassword);

    const isPasswordDuplicateCurrent = state.password === state.newPassword;
    const isNewPasswordAndConfirmNotCorrect =
      state.newPassword !== state.confirmPassword;

    setInputValidation({
      isPasswordNotValid,
      isPasswordDuplicateCurrent,
      isNewPasswordAndConfirmNotCorrect,
      isNewPasswordNotValid,
    });

    if (
      !isPasswordNotValid &&
      !isPasswordDuplicateCurrent &&
      !isNewPasswordAndConfirmNotCorrect &&
      !isNewPasswordNotValid
    ) {
      updatePasswordMutation({
        variables: {
          cmd: {
            password: state.password,
            newPassword: state.newPassword,
            signingSecret,
            encryptionPublicKey,
            encryptionSecret,
          },
        },
      });
    }
  };

  return updatePasswordLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Box onSubmit={handleSubmit}>
        <h2>Password and Update your Pin</h2>

        <Row>
          <InputContainer>
            <span>Your Old Password</span>
            <Input name="password" onChange={handleChange} />
          </InputContainer>
        </Row>
        <Row>
          {inputValidation.isPasswordNotValid ? (
            <ErrorTitle>
              Your password must be between 8 to 20 characters which contain at
              least one numeric digit, one uppercase and one lowercase letter
            </ErrorTitle>
          ) : null}
        </Row>

        <Row>
          <InputContainer width="48%">
            <span>New Password</span>
            <Input name="newPassword" onChange={handleChange} />
          </InputContainer>

          <InputContainer width="48%">
            <span>Confirm new password</span>
            <Input name="confirmPassword" onChange={handleChange} />
          </InputContainer>
        </Row>

        <Row error>
          {inputValidation.isNewPasswordNotValid ? (
            <ErrorTitle>
              Your password must be between 8 to 20 characters which contain at
              least one numeric digit, one uppercase and one lowercase letter
            </ErrorTitle>
          ) : null}
        </Row>
        <Row error>
          {inputValidation.isPasswordDuplicateCurrent ? (
            <ErrorTitle>
              Your new password is duplicate with the current
            </ErrorTitle>
          ) : null}
        </Row>
        <Row error>
          {inputValidation.isNewPasswordAndConfirmNotCorrect ? (
            <ErrorTitle>
              Your confirm password must equal your new password
            </ErrorTitle>
          ) : null}
        </Row>

        <Button />
      </Box>

      <SobyModal open={open} setOpen={setOpen}>
        {formError ? (
          <ErrorPopup content={formError} setOpen={setOpen} />
        ) : null}
      </SobyModal>
    </React.Fragment>
  );
};

export default PasswordPopup;
