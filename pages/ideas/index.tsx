import { Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { DELETE_IDEA_MUTATION } from '../../apollo/ideas/mutations';
import { GET_IDEAS_QUERY } from '../../apollo/ideas/queries';
import { Idea } from '../../lib/types/Idea';
import Link from 'next/link';
import ListPageItems from '../../lib/components/ListPageItems';

const getIdeasArray = (data: any): Idea[] => (data?.ideas as Idea[]) ?? [];

const ViewIdeas = () => {
  const {
    loading: getLoading,
    error: getError,
    data: getData,
  } = useQuery(GET_IDEAS_QUERY);

  const [deleteIdea, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_IDEA_MUTATION, {
      refetchQueries: [GET_IDEAS_QUERY],
    });

  const [visibleIdeas, setVisibleIdeas] = useState<Idea[]>([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const ideas = getIdeasArray(getData);
    setVisibleIdeas([...ideas]);
  }, [getData]);

  useEffect(() => {
    const allIdeas = getIdeasArray(getData);
    if (!searchValue || searchValue === '') {
      return setVisibleIdeas([...allIdeas]);
    }

    setVisibleIdeas(
      allIdeas.filter(i =>
        i.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()),
      ),
    );
  }, [getData, searchValue]);

  const handleSearchValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearchValue(event.target.value),
    [],
  );

  const handleSearchValueReset = useCallback(() => {
    const allIdeas = getIdeasArray(getData);
    setVisibleIdeas([...allIdeas]);
    setSearchValue('');
  }, [getData]);

  const handleDelete = useCallback(
    (deleteIdeaId: string) => deleteIdea({ variables: { deleteIdeaId } }),
    [deleteIdea],
  );

  return (
    <div className="mb-3">
      <h1 className="display-1">ideas</h1>
      <p className="fs-6 text-muted">{getIdeasArray(getData).length} idea(s)</p>
      <Row>
        <Col xs={12} md="auto" className="mb-3 mb-md-0">
          <Link href="/ideas/create" passHref>
            <Button variant="primary">new idea</Button>
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
        items={visibleIdeas}
        itemsLoading={getLoading}
        itemsError={getError}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        isTemplate={false}
        itemsName="ideas"
      />
    </div>
  );
};

export default ViewIdeas;
