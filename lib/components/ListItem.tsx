import { Button, Card } from 'react-bootstrap';

import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import { Idea } from '../types/Idea';
import Link from 'next/link';
import React from 'react';
import { Template } from '../types/Template';

type ListItemProps = {
  item: Idea | Template;
  isTemplate: boolean;
  onDelete?: (id: string) => any;
  deleteLoading?: boolean;
};

const ListItem: FunctionComponentWithProps<ListItemProps> = ({
  item,
  isTemplate,
  onDelete,
  deleteLoading = false,
}) => (
  <Card className="h-100">
    <Card.Body className="d-flex flex-column">
      <Card.Title>{item.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted mt-auto">
        {isTemplate
          ? `${(item as Template).fields.length} field(s)`
          : `${((item as Idea).template as Template)?.name ?? 'no template'}`}
      </Card.Subtitle>
    </Card.Body>
    <Card.Footer>
      <Link href={`/${isTemplate ? 'templates' : 'ideas'}/${item.id}`} passHref>
        <Button variant="link">view</Button>
      </Link>
      {onDelete ? (
        <Button
          onClick={() => onDelete(item.id)}
          variant="link"
          disabled={deleteLoading}
          className="text-danger"
        >
          delete
        </Button>
      ) : null}
    </Card.Footer>
  </Card>
);

export default ListItem;
