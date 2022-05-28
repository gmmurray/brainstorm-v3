import { Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { DELETE_TEMPLATE_MUTATION } from '../../apollo/templates/mutations';
import { GET_TEMPLATES_QUERY } from '../../apollo/templates/queries';
import Link from 'next/link';
import ListPageItems from '../../lib/components/ListPageItems';
import { Template } from '../../lib/types/Template';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const getTemplateArray = (data: any): Template[] =>
  (data?.templates as Template[]) ?? [];

const Templates = () => {
  const {
    loading: getLoading,
    error: getError,
    data: getData,
  } = useQuery(GET_TEMPLATES_QUERY);
  const [
    deleteTemplate,
    { loading: deleteLoading, error: deleteError, data: deleteData },
  ] = useMutation(DELETE_TEMPLATE_MUTATION, {
    refetchQueries: [GET_TEMPLATES_QUERY],
  });
  const [visibleTemplates, setVisibleTemplates] = useState<Template[]>([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const templates = getTemplateArray(getData);
    setVisibleTemplates([...templates]);
  }, [getData]);

  useEffect(() => {
    const allTemplates = getTemplateArray(getData);
    if (!searchValue || searchValue === '') {
      return setVisibleTemplates([...allTemplates]);
    }

    setVisibleTemplates(
      allTemplates.filter(t =>
        t.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()),
      ),
    );
  }, [getData, searchValue]);

  const handleSearchValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    [],
  );

  const handleSearchValueReset = useCallback(() => {
    const allTemplates = getTemplateArray(getData);
    setVisibleTemplates([...allTemplates]);
    setSearchValue('');
  }, [getData]);

  const handleDelete = useCallback(
    (deleteTemplateId: string) => {
      deleteTemplate({ variables: { deleteTemplateId } });
    },
    [deleteTemplate],
  );

  return (
    <div className="mb-3">
      <h1 className="display-1">templates</h1>
      <p className="fs-6 text-muted">
        {getTemplateArray(getData).length} template(s)
      </p>
      <Row>
        <Col xs={12} md="auto" className="mb-3 mb-md-0">
          <Link href="/templates/create" passHref>
            <Button variant="primary">new template</Button>
          </Link>
        </Col>
        <Col>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="search..."
              onChange={handleSearchValueChange}
              value={searchValue}
            />
            <Button
              variant="outline-primary"
              type="button"
              onClick={handleSearchValueReset}
            >
              clear
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <ListPageItems
        items={visibleTemplates}
        itemsLoading={getLoading}
        itemsError={getError}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        isTemplate
        itemsName="templates"
      />
    </div>
  );
};

export default withPageAuthRequired(Templates);
