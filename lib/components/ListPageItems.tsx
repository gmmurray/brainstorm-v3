import { Col, Row } from 'react-bootstrap';

import { ApolloError } from '@apollo/client';
import CardPlaceholders from './CardPlaceholders';
import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import { Idea } from '../types/Idea';
import ListItem from './ListItem';
import React from 'react';
import { Template } from '../types/Template';

type ListPageItemsProps = {
  items: Idea[] | Template[];
  itemsLoading: boolean;
  itemsError?: ApolloError;
  onDelete: (id: string) => any;
  deleteLoading: boolean;
  deleteError?: ApolloError;
  isTemplate?: boolean;
  itemsName: string;
};

const ListPageItems: FunctionComponentWithProps<ListPageItemsProps> = ({
  items,
  itemsLoading,
  itemsError,
  onDelete,
  deleteLoading,
  deleteError,
  isTemplate,
  itemsName,
}) => {
  if (itemsError) {
    return (
      <div>
        <h4 className="display-4 text-muted text-center mt-5">
          error retrieving {itemsName}
        </h4>
      </div>
    );
  }

  if (deleteError) {
    return (
      <div>
        <h4 className="display-4 text-muted text-center mt-5">
          error deleting {itemsName}
        </h4>
      </div>
    );
  }

  if (itemsLoading) {
    return (
      <Row xs={1} md={3} className="g-4">
        <CardPlaceholders count={6} />
      </Row>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h4 className="display-4 text-muted text-center mt-5">
          no {itemsName} yet
        </h4>
      </div>
    );
  }

  return (
    <Row xs={1} md={3} className="mt-2 g-4">
      {items.map((item, key) => (
        <Col key={key}>
          <ListItem
            item={item}
            isTemplate={!!isTemplate}
            onDelete={onDelete}
            deleteLoading={deleteLoading}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ListPageItems;
