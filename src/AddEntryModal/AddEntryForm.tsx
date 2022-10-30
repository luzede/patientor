

import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, DiagnosisSelection, HealthCheckRatingOption } from "./FormField";
import { Entry, HealthCheckRating, Type } from "../types";
import { useStateValue } from "../state";

type BetterOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type EntryFormValues = BetterOmit<Entry, "id" | "entries">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.LowRisk, label: 'Low Risk' },
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.HighRisk, label: 'HighRisk' },
  { value: HealthCheckRating.CriticalRisk, label: 'CriticalRisk' },
];


export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [ { extraDiagnoses } ] = useStateValue();

  return (
    <Formik
      initialValues={
        {
          description: "",
          date: "",
          specialist: "",
          diagnosisCodes: undefined,
          healthCheckRating: HealthCheckRating.LowRisk,
          discharge: {
            date: "",
            criteria: ""
          },
          sickLeave: undefined,
          employerName: "",
          type: Type.HealthCheck,
        }
      }
      onSubmit={onSubmit}
      validate={(values) => {
        console.log(values);
      }}
    >
      {
        ({ isValid, dirty, setFieldValue, setFieldTouched }) => {
          return (
            <Form className='form ui'>
              <Field
                label="Description"
                placeholder="Description"
                name="description"
                component={TextField}
              />
              <Field
                label="Specialist"
                placeholder="Specialist"
                name="specialist"
                component={TextField}
              />
              <Field
                label="Date"
                placeholder="Date"
                name="date"
                component={TextField}
              />
              <DiagnosisSelection 
                diagnoses={extraDiagnoses}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <SelectField
                label="HealthCheckRating" name='healthCheckRating'
                options={healthCheckRatingOptions}
              />

            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            </Form>
          );
        }
      }

    </Formik>
  );
};

export default AddEntryForm;