

import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, DiagnosisSelection, HealthCheckRatingOption, TypeOption } from "./FormField";
import { Entry, HealthCheckRating, Type } from "../types";
import { useStateValue } from "../state";

type BetterOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type EntryFormValuesBase = BetterOmit<Entry, "id" | "entries" | "discharge" | "sickLeave">;
export type EntryFormValues = EntryFormValuesBase & {
  dischargeDate: string,
  dischargeCriteria: string,
  sickLeaveSD: string,
  sickLeaveED: string,
};


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

const typeOptions: TypeOption[] = [
  { value: Type.HealthCheck, label: 'HealthCheck' },
  { value: Type.Hospital, label: 'Hospital' },
  { value: Type.OccupationalHealthcare, label: 'OccupationalHealthcare' },
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
          dischargeDate: "",
          dischargeCriteria: "",
          sickLeaveSD: "",
          sickLeaveED: "",
          employerName: "",
          type: Type.HealthCheck,
        }
      }
      onSubmit={onSubmit}
      validate={(values) => {
        console.log(values);
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        } else {
          switch(values.type) {
            case Type.HealthCheck:
              if  ( !(0 === values.healthCheckRating) && !values.healthCheckRating) {
                errors.healthCheckRating = requiredError;
              }
              break;
            case Type.Hospital:
              if (!values.dischargeDate) {
                errors.dischargeDate = requiredError;
              }
              if (!values.dischargeCriteria) {
                errors.dischargeCriteria = requiredError;
              }
              break;
            case Type.OccupationalHealthcare:
              if (!values.employerName) {
                errors.employerName = requiredError;
              }
              if (!values.sickLeaveSD) {
                errors.sickLeaveSD = requiredError;
              }
              if (!values.sickLeaveED) {
                errors.sickLeaveED = requiredError;
              }
              break;
          }
        }
        return errors;
      }}
    >
      {
        ({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
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
                label="Type"
                name="type"
                options={typeOptions}
              />
              {
                values.type === Type.HealthCheck
                ? <SelectField
                    label="HealthCheckRating" name='healthCheckRating'
                    options={healthCheckRatingOptions}
                  />
                : null
              }
              {
                values.type === Type.Hospital
                ? <Field
                    label="Discharge Date"
                    placeholder="YYYY-MM-DD"
                    name="dischargeDate"
                    component={TextField}
                  />
                : null
              }
              {
                values.type === Type.Hospital
                ? <Field
                    label="Discharge Criteria"
                    placeholder="Criteria"
                    name="dischargeCriteria"
                    component={TextField}
                  />
                : null
              }
              {
                values.type === Type.OccupationalHealthcare
                ? <Field
                    label="Employer Name"
                    placeholder="Elly Fore"
                    name="employerName"
                    component={TextField}
                  />
                : null
              }
              {
                values.type === Type.OccupationalHealthcare
                ? <Field
                    label="Sick Leave Start Date"
                    placeholder="YYYY-MM-DD"
                    name="sickLeaveSD"
                    component={TextField}
                  />
                : null
              }
              {
                values.type === Type.OccupationalHealthcare
                ? <Field
                    label="Sick Leave End Date"
                    placeholder="YYYY-MM-DD"
                    name="sickLeaveED"
                    component={TextField}
                  />
                : null
              }

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