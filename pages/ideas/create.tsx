import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Formik, FormikHelpers } from 'formik';
import { IIdeaField, Idea } from '../../lib/types/Idea';
import React, { ReactElement, useCallback, useState } from 'react';
import { object, string } from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import { CREATE_IDEA_MUTATION } from '../../apollo/ideas/mutations';
import { GET_IDEAS_QUERY } from '../../apollo/ideas/queries';
import { GET_TEMPLATES_QUERY } from '../../apollo/templates/queries';
import Link from 'next/link';
import LoadingModal from '../../lib/components/LoadingModal';
import { Template } from '../../lib/types/Template';
import { TemplateFieldTypes } from '../../lib/types/TemplateField';
import { useRouter } from 'next/router';

const schema = object().shape({
  name: string().required(),
  template: string().required(),
});

type CreateIdeaFormValues = {
  name: string;
  template?: string;
  fields: IIdeaField[];
};

const CreateIdea = () => {
  const { user } = useUser();
  const router = useRouter();

  const [createIdea, { loading: createLoading }] = useMutation(
    CREATE_IDEA_MUTATION,
    {
      refetchQueries: [GET_IDEAS_QUERY],
    },
  );

  const { loading: templatesLoading, data: templatesData } =
    useQuery(GET_TEMPLATES_QUERY);

  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >(undefined);

  const handleTemplateSelect = useCallback(
    (
      setFieldValue: FormikHelpers<CreateIdeaFormValues>['setFieldValue'],
      template?: Template,
    ) => {
      setFieldValue(
        'fields',
        (template?.fields ?? []).map(field => ({
          name: field.name,
          type: field.type,
          value: undefined,
        })),
      );
      setSelectedTemplate(template);
    },
    [],
  );

  const handleSave = useCallback(
    async (values: CreateIdeaFormValues) => {
      setSubmitMessage(null);

      const idea: Partial<Idea> = {
        userId: user!.sub!,
        name: values.name,
        fields: values.fields.map(field => ({
          ...field,
          value: field.value.toString(),
        })),
        template: {
          ...selectedTemplate!,
          fields: selectedTemplate!.fields.map(field => ({
            ...field,
          })),
        },
      };

      const created = await createIdea({
        variables: {
          idea,
        },
      });

      if (created.errors || !created?.data?.createIdea) {
        setSubmitMessage('error creating idea');
      } else {
        router.push(`/ideas/${created.data!.createIdea!.id}`);
      }
    },
    [createIdea, router, selectedTemplate, user],
  );

  const renderContent = () => {
    if (templatesLoading) {
      return (
        <Container className="text-center">
          <Spinner animation="border" variant="primary" />
        </Container>
      );
    }

    if ((templatesData?.templates ?? []).length === 0) {
      return (
        <div>
          <h4 className="display-4 text-muted text-center mt-5">
            no templates available. please create one first
          </h4>
        </div>
      );
    }

    const templateMap = new Map(
      ((templatesData?.templates ?? []) as Template[]).map(t => [t.id, t]),
    );

    return (
      <Formik
        validationSchema={schema}
        onSubmit={handleSave}
        initialValues={{
          name: '',
          fields: [] as IIdeaField[],
          template: undefined,
        }}
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
                <Form.Select
                  name="template"
                  value={values.template}
                  onChange={e => {
                    handleTemplateSelect(
                      setFieldValue,
                      templateMap.get(e.target.value),
                    );
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.template && !!errors.template}
                >
                  <option value="">select</option>
                  {Array.from(templateMap).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.template}
                </Form.Control.Feedback>
              </Form.Group>
              {values.template &&
                (templateMap.get(values.template)?.fields ?? []).map(
                  (field, key) => {
                    const fieldName = `fields[${key}].value`;
                    const fieldValue = values.fields[key]?.value;
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
                      <Form.Group as={Col} lg={6} className="my-1" key={key}>
                        <Form.Label>{field.name}</Form.Label>
                        {content}
                      </Form.Group>
                    );
                  },
                )}
              <Form.Group as={Col} className="my-1">
                <Button type="submit" disabled={createLoading}>
                  save
                </Button>
              </Form.Group>
            </Row>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <div>
      <h1 className="display-1">create idea</h1>
      <Link href="/ideas" passHref>
        <Button variant="outline-primary">back to ideas</Button>
      </Link>
      {renderContent()}
      <LoadingModal loading={createLoading} />
    </div>
  );
};

export default withPageAuthRequired(CreateIdea);
