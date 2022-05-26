import { Container, Modal, Spinner } from 'react-bootstrap';

import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import React from 'react';

type LoadingModalProps = {
  loading: boolean;
};

const LoadingModal: FunctionComponentWithProps<LoadingModalProps> = ({
  loading,
}) => (
  <Modal
    centered
    show={loading}
    keyboard={false}
    animation={false}
    backdrop="static"
    dialogAs={Container}
    dialogClassName="full-screen-spinner-container"
  >
    <Spinner animation="border" variant="primary" />
  </Modal>
);

export default LoadingModal;
