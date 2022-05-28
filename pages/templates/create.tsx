import { Button, Col, Form, InputGroup, ListGroup, Row } from 'react-bootstrap';
import { Formik, FormikHelpers } from 'formik';
import {
  GET_LIMITED_TEMPLATES_QUERY,
  GET_TEMPLATES_QUERY,
} from '../../apollo/templates/queries';
import {
  ITemplateField,
  TemplateFieldTypes,
} from '../../lib/types/TemplateField';
import React, { useCallback, useState } from 'react';
import { object, string } from 'yup';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import { CREATE_TEMPLATE_MUTATION } from '../../apollo/templates/mutations';
import Link from 'next/link';
import LoadingModal from '../../lib/components/LoadingModal';
import { Template } from '../../lib/types/Template';
import { X } from 'react-bootstrap-icons';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const schema = object().shape({
  name: string().required(),
});

type CreateTemplateFormValues = {
  name: string;
  newFieldName: string;
  newFieldType: TemplateFieldTypes;
};

const CreateTemplate = () => {
  const { user } = useUser();
  const router = useRouter();
  const [createTemplate, { loading: createLoading }] = useMutation(
    CREATE_TEMPLATE_MUTATION,
    {
      refetchQueries: [GET_TEMPLATES_QUERY, GET_LIMITED_TEMPLATES_QUERY],
    },
  );

  const [fields, setFields] = useState<ITemplateField[]>([]);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleAddField = useCallback(
    (
      field: ITemplateField,
      setFieldValue: FormikHelpers<CreateTemplateFormValues>['setFieldValue'],
    ) => {
      if (field.name === '') return;
      setFields(state => [...state, field]);
      setFieldValue('newFieldName', '');
      setFieldValue('newFieldType', TemplateFieldTypes.STRING);
    },
    [],
  );

  const handleRemoveField = useCallback((index: number) => {
    setFields(state => state.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(
    async (values: CreateTemplateFormValues) => {
      setSubmitMessage(null);

      const template: Partial<Template> = {
        userId: user!.sub!,
        name: values.name!,
        fields,
      };

      const created = await createTemplate({
        variables: {
          template,
        },
      });

      if (created.errors || !created?.data?.createTemplate) {
        setSubmitMessage('error creating template');
      } else {
        router.push(`/templates/${created.data!.createTemplate!.id}`);
      }
    },
    [createTemplate, fields, router, user],
  );

  return (
    <>
      <div className="mb-3">
        <h1 className="display-1">create template</h1>
        <Link href="/templates" passHref>
          <Button variant="outline-primary">back to templates</Button>
        </Link>
        <Formik
          validationSchema={schema}
          onSubmit={handleSave}
          initialValues={{
            name: '',
            newFieldName: '',
            newFieldType: TemplateFieldTypes.STRING,
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
                  <Button type="submit" disabled={createLoading}>
                    save
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
      </div>
      <LoadingModal loading={createLoading} />
    </>
  );
};

export default withPageAuthRequired(CreateTemplate);
