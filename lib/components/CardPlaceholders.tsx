import { Card, Col, Placeholder } from 'react-bootstrap';
import React, { Fragment } from 'react';

import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';

type CardPlaceholdersProps = {
  count: number;
};

const CardPlaceholders: FunctionComponentWithProps<CardPlaceholdersProps> = ({
  count,
}) => (
  <Fragment>
    {[...Array(count)].map((_, index) => (
      <Col key={index}>
        <Card>
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as={Card.Subtitle} animation="glow">
              <Placeholder xs={5} bg="secondary" />
            </Placeholder>
          </Card.Body>
          <Card.Footer>
            <Placeholder xs={4} bg="primary" />
          </Card.Footer>
        </Card>
      </Col>
    ))}
  </Fragment>
);

export default CardPlaceholders;
