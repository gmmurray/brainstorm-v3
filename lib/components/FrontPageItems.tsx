import { Col, Row } from 'react-bootstrap';

import { ApolloError } from '@apollo/client';
import CardPlaceholders from './CardPlaceholders';
import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import { Idea } from '../types/Idea';
import ListItem from './ListItem';
import React from 'react';
import { Template } from '../types/Template';

type FrontPageItemsProps = {
  items: Idea[] | Template[];
  isTemplate?: boolean;
  error?: ApolloError;
  loading: boolean;
  itemsName: string;
};

const FrontPageItems: FunctionComponentWithProps<FrontPageItemsProps> = ({
  items,
  isTemplate,
  error,
  loading,
  itemsName,
}) => {
  if (error) {
    return (
      <div>
        <h4 className="fx-4 text-danger">error retrieving {itemsName}</h4>
      </div>
    );
  }

  if (loading) {
    return (
      <Row xs={1} md={3} className="g-4">
        <CardPlaceholders count={3} />
      </Row>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h4 className="fx-4 text-muted">no {itemsName} yet</h4>
      </div>
    );
  }

  return (
    <Row xs={1} md={3} className="g-4">
      {items.map((item, index) => (
        <Col key={index}>
          <ListItem item={item} isTemplate={!!isTemplate} />
        </Col>
      ))}
    </Row>
  );
};

export default FrontPageItems;
