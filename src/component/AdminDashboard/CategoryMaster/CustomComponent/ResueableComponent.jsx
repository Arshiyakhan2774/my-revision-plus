import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Grid, Card, CardContent } from '@mui/material';

const ReusableForm = ({ initialValues, validationSchema, fields, onSubmit, submitLabel = "Submit" }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
         
              <Grid container spacing={2}>
                {fields.map((field) => (
                  <Grid item xs={12} md={6} key={field.name}>
                    <Field
                      name={field.name}
                      label={field.label}
                      as={TextField}
                      fullWidth
                      required={field.required}
                      variant="outlined"
                      margin="normal"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      error={!!ErrorMessage[field.name]}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary">
                    {submitLabel}
                  </Button>
                </Grid>
              </Grid>
            
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;