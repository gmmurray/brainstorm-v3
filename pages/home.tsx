import { ArrowRightShort, Plus } from 'react-bootstrap-icons';
import { Button, Col, Row } from 'react-bootstrap';

import FrontPageItems from '../lib/components/FrontPageItems';
import { GET_IDEAS_QUERY } from '../apollo/ideas/queries';
import { GET_LIMITED_TEMPLATES_QUERY } from '../apollo/templates/queries';
import { Idea } from '../lib/types/Idea';
import Link from 'next/link';
import { NextPage } from 'next';
import { Template } from '../lib/types/Template';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Home: NextPage = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'home';
    }
  }, []);

  const {
    loading: templatesLoading,
    error: templatesError,
    data: templatesData,
  } = useQuery(GET_LIMITED_TEMPLATES_QUERY, { variables: { limit: 3 } });
  const {
    loading: ideasLoading,
    error: ideasError,
    data: ideasData,
  } = useQuery(GET_IDEAS_QUERY, { variables: { limit: 3 } });

  const ideas = (ideasData?.ideas as Idea[]) ?? [];
  const templates = (templatesData?.templates as Template[]) ?? [];

  return (
    <div>
      <h1 className="display-1">home</h1>
      <Row>
        <Col xs={12}>
          <h5 className="display-5">ideas</h5>
        </Col>
        <Col xs={12}>
          <FrontPageItems
            items={ideas}
            loading={ideasLoading}
            error={ideasError}
            itemsName="ideas"
          />
        </Col>
        <Col xs={12} className="mt-3">
          <Link
            className={`btn btn-primary${ideasLoading ? ' disabled' : ''}`}
            href="/ideas"
            passHref
          >
            <Button color="primary">
              view all <ArrowRightShort />
            </Button>
          </Link>
          {!ideasLoading && ideas.length === 0 && (
            <Link
              className={`btn btn-primary ms-2${
                ideasLoading ? ' disabled' : ''
              }`}
              href="/ideas/create"
              passHref
            >
              <Button color="primary" className="ms-2">
                create one <Plus />
              </Button>
            </Link>
          )}
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs={12}>
          <h5 className="display-5">templates</h5>
        </Col>
        <Col xs={12}>
          <FrontPageItems
            items={templates}
            loading={templatesLoading}
            error={templatesError}
            itemsName="templates"
            isTemplate
          />
        </Col>
        <Col xs={12} className="mt-3">
          <Link
            className={`btn btn-primary${templatesLoading ? ' disabled' : ''}`}
            href="/templates"
            passHref
          >
            <Button color="primary">
              view all <ArrowRightShort />
            </Button>
          </Link>
          {!templatesLoading && templates.length === 0 && (
            <Link
              className={`btn btn-primary ms-2${
                templatesLoading ? ' disabled' : ''
              }`}
              href="/templates/create"
              passHref
            >
              <Button color="primary" className="ms-2">
                create one <Plus />
              </Button>
            </Link>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default withPageAuthRequired(Home);
