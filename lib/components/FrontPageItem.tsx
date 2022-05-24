import { Card } from 'react-bootstrap';
import { FunctionComponentWithProps } from '../types/FunctionComponentWithProps';
import { Idea } from '../types/Idea';
import Link from 'next/link';
import React from 'react';
import { Template } from '../types/Template';

type FrontPageItemProps = {
  item: Idea | Template;
  isTemplate: boolean;
};

const FrontPageItem: FunctionComponentWithProps<FrontPageItemProps> = ({
  item,
  isTemplate,
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
      <Link
        href={`/${isTemplate ? 'templates' : 'ideas'}/view/${item.id}`}
        passHref
      >
        <Card.Link>view</Card.Link>
      </Link>
    </Card.Footer>
  </Card>
);

export default FrontPageItem;
