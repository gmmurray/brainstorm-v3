import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import {
  DELETE_TEMPLATE_MUTATION,
  UPDATE_TEMPLATE_MUTATION,
} from '../../apollo/templates/mutations';
import { Formik, FormikHelpers } from 'formik';
import {
  GET_TEMPLATES_QUERY,
  GET_TEMPLATE_QUERY,
} from '../../apollo/templates/queries';
import {
  ITemplateField,
  TemplateFieldTypes,
} from '../../lib/types/TemplateField';
import React, { useCallback, useEffect, useState } from 'react';
import { object, string } from 'yup';
import { useLazyQuery, useMutation } from '@apollo/client';

import Link from 'next/link';
import LoadingModal from '../../lib/components/LoadingModal';
import { X } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const schema = object().shape({
  name: string().required(),
});

type UpdateTemplateFormValues = {
  name: string;
  newFieldName: string;
  newFieldType: TemplateFieldTypes;
};

const ViewTemplate = () => {
  const {
    query: { templateId },
    push,
  } = useRouter();
  const [
    getTemplate,
    { loading: getLoading = true, error: getError, data: getData },
  ] = useLazyQuery(GET_TEMPLATE_QUERY);

  const [
    updateTemplate,
    { loading: updateLoading, error: updateError, data: updateData },
  ] = useMutation(UPDATE_TEMPLATE_MUTATION, {
    refetchQueries: [GET_TEMPLATE_QUERY],
  });

  const [
    deleteTemplate,
    { loading: deleteLoading, error: deleteError, data: deleteData },
  ] = useMutation(DELETE_TEMPLATE_MUTATION, {
    refetchQueries: [GET_TEMPLATES_QUERY],
  });

  useEffect(() => {
    getTemplate({ variables: { templateId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [fields, setFields] = useState<ITemplateField[]>([]);

  useEffect(() => {
    setFields(
      getData?.template?.fields?.map((field: ITemplateField) => ({
        name: field.name,
        type: field.type,
      })) ?? [],
    );
  }, [getData]);

  const handleAddField = useCallback(
    (
      newField: ITemplateField,
      setFieldValue: FormikHelpers<UpdateTemplateFormValues>['setFieldValue'],
    ) => {
      if (newField.name === '') return;

      setFields(state => [...state, newField]);
      setFieldValue('newFieldName', '');
      setFieldValue('newFieldType', TemplateFieldTypes.STRING);
    },
    [],
  );

  const handleRemoveField = useCallback((index: number) => {
    setFields(state => state.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(
    async (values: UpdateTemplateFormValues) => {
      setSubmitMessage(null);

      const updated = await updateTemplate({
        variables: {
          updateTemplateId: templateId,
          template: {
            name: values.name!,
            fields,
          },
        },
      });

      if (updated.errors || !updated?.data.updateTemplate) {
        setSubmitMessage('error updating template');
      } else {
        getTemplate();
      }
    },
    [fields, getTemplate, templateId, updateTemplate],
  );

  const handleDelete = useCallback(async () => {
    await deleteTemplate({
      variables: {
        deleteTemplateId: templateId,
      },
    });
    push('/templates');
  }, [deleteTemplate, push, templateId]);

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
            error retrieving template
          </h4>
        </div>
      );
    }

    return (
      <Formik
        validationSchema={schema}
        onSubmit={handleSave}
        initialValues={{
          name: getData?.template.name,
          newFieldName: '',
          newFieldType: TemplateFieldTypes.STRING,
        }}
        enableReinitialize
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          setFieldValue,
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
                <Form.Control
                  placeholder="name"
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
                <InputGroup>
                  <Form.Control
                    placeholder="add a field"
                    className="w-50"
                    type="text"
                    name="newFieldName"
                    value={values.newFieldName}
                    onChange={handleChange}
                  />
                  <Form.Select
                    name="newFieldType"
                    value={values.newFieldType}
                    onChange={handleChange}
                  >
                    {Object.values(TemplateFieldTypes).map((value, index) => (
                      <option key={index} value={value}>
                        {value.toLocaleLowerCase()}
                      </option>
                    ))}
                  </Form.Select>
                  <Button
                    onClick={() =>
                      handleAddField(
                        {
                          name: values.newFieldName ?? '',
                          type: values.newFieldType!,
                        },
                        setFieldValue,
                      )
                    }
                    variant="outline-primary"
                    type="button"
                  >
                    add
                  </Button>
                </InputGroup>
              </Form.Group>
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
              <Form.Group as={Col} xs={12} className="my-1">
                <ListGroup numbered as="ol">
                  {fields.map((field, i) => (
                    <ListGroup.Item
                      key={i}
                      className="d-flex justify-content-between align-items-start"
                      as="li"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{field.name}</div>
                        <span>{field.type.toLocaleLowerCase()}</span>
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleRemoveField(i)}
                      >
                        <X />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Form.Group>
            </Row>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <div className="mb-3">
      <h1 className="display-1">view template</h1>
      <Link href="/templates" passHref>
        <Button variant="outline-primary">back to templates</Button>
      </Link>
      {renderContent()}
      <LoadingModal loading={updateLoading || deleteLoading} />
    </div>
  );
};

export default withPageAuthRequired(ViewTemplate);
