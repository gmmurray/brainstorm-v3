import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import {
  DELETE_IDEA_MUTATION,
  UPDATE_IDEA_MUTATION,
} from '../../apollo/ideas/mutations';
import { GET_IDEAS_QUERY, GET_IDEA_QUERY } from '../../apollo/ideas/queries';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { object, string } from 'yup';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import { Formik } from 'formik';
import { IIdeaField } from '../../lib/types/Idea';
import Link from 'next/link';
import LoadingModal from '../../lib/components/LoadingModal';
import { TemplateFieldTypes } from '../../lib/types/TemplateField';
import { useRouter } from 'next/router';

const schema = object().shape({
  name: string().required(),
});

type UpdateIdeaFormValues = {
  name: string;
  template?: string;
  fields: IIdeaField[];
};

const ViewIdea = () => {
  const {
    query: { ideaId },
    push,
  } = useRouter();

  const [
    getIdea,
    { loading: getLoading = true, error: getError, data: getData },
  ] = useLazyQuery(GET_IDEA_QUERY);

  const [updateIdea, { loading: updateLoading }] = useMutation(
    UPDATE_IDEA_MUTATION,
    { refetchQueries: [GET_IDEAS_QUERY] },
  );

  const [deleteIdea, { loading: deleteLoading }] = useMutation(
    DELETE_IDEA_MUTATION,
    {
      refetchQueries: [GET_IDEAS_QUERY],
    },
  );

  useEffect(() => {
    getIdea({ variables: { ideaId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleSave = useCallback(
    async (values: UpdateIdeaFormValues) => {
      setSubmitMessage(null);

      const updated = await updateIdea({
        variables: {
          updateIdeaId: ideaId,
          idea: {
            ...values,
            template: getData?.idea.template,
            fields: values.fields.map(field => ({
              ...field,
              value: field.value.toString(),
            })),
          },
        },
      });

      if (updated.errors || !updated?.data.updateIdea) {
        setSubmitMessage('error updating idea');
      } else {
        getIdea();
      }
    },
    [getData, getIdea, ideaId, updateIdea],
  );

  const handleDelete = useCallback(async () => {
    await deleteIdea({
      variables: {
        deleteIdeaId: ideaId,
      },
    });
    push('/ideas');
  }, [deleteIdea, ideaId, push]);

  const renderContent = () => {
    if (getLoading) {
      return (
        <Container className="text-center">
          <Spinner animation="border" variant="primary" />
        </Container>
      );
    }

    if (getError) {
      return (
        <div>
          <h4 className="display-4 text-muted text-center mt-5">
            error retrieving idea
          </h4>
        </div>
      );
    }

    return (
      <Formik
        validationSchema={schema}
        onSubmit={handleSave}
        initialValues={{
          name: getData?.idea.name,
          template: getData?.idea?.template?.name,
          fields: getData?.idea.fields,
        }}
        enableReinitialize
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit} className="mt-3">
            <Row>
              {submitMessage && (
                <Col xs={12}>
                  <p className="text-danger fw-bold">{submitMessage}</p>
                </Col>
              )}
              <Form.Group as={Col} lg={6} className="my-1">
                <Form.Label>name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && !!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} lg={6} className="my-1">
                <Form.Label>template</Form.Label>
                <Form.Control
                  name="template"
                  value={values.template ?? 'no template'}
                  disabled
                  readOnly
                />
              </Form.Group>
              {(values.fields ?? []).map((field, index) => {
                const fieldName = `fields[${index}].value`;
                const fieldValue = values.fields[index]?.value;
                let content: ReactElement;

                if (field.type === TemplateFieldTypes.STRING) {
                  content = (
                    <>
                      <Form.Control
                        type="text"
                        name={fieldName}
                        value={fieldValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </>
                  );
                } else if (field.type === TemplateFieldTypes.NUMBER) {
                  content = (
                    <>
                      <Form.Control
                        type="number"
                        name={fieldName}
                        value={fieldValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </>
                  );
                } else {
                  console.log(fieldValue);
                  content = (
                    <>
                      <Form.Check
                        type="checkbox"
                        name={fieldName}
                        value={fieldValue}
                        onChange={handleChange}
                        label="true"
                      />
                    </>
                  );
                }

                return (
                  <Form.Group as={Col} lg={6} className="my-1" key={index}>
                    <Form.Label>{field.name}</Form.Label>
                    {content}
                  </Form.Group>
                );
              })}
              <Form.Group as={Col} className="my-1">
                <Button type="submit" disabled={updateLoading}>
                  save
                </Button>
                <Button
                  disabled={deleteLoading}
                  onClick={handleDelete}
                  variant="danger"
                  className="ms-2"
                >
                  delete
                </Button>
              </Form.Group>
            </Row>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <div className="mb-3">
      <h1 className="display-1">update idea</h1>
      <Link href="/ideas" passHref>
        <Button variant="outline-primary">back to ideas</Button>
      </Link>
      {renderContent()}
      <LoadingModal loading={updateLoading || deleteLoading} />
    </div>
  );
};

export default withPageAuthRequired(ViewIdea);
