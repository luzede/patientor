import { Patient, Type } from "../types";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import EntryComponent from "./EntryComponent";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";
import { useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import React from 'react';

const IndividualPatientPage = ({ patientId }: { patientId: string | undefined }): JSX.Element => {

  const [{ diagnoses }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const { id } = useParams();

  if (!id) return <>
  </>;

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const entry = {
        ...values,
        sickLeave: values.type === Type.OccupationalHealthcare ? { startDate: values.sickLeaveSD, endDate: values.sickLeaveED } : undefined ,
        discharge: values.type === Type.Hospital ? { date: values.dischargeDate, criteria: values.dischargeCriteria } : undefined ,
        healthCheckRating: values.type === Type.HealthCheck ? values.healthCheckRating : undefined ,
        employerName: values.type === Type.OccupationalHealthcare ? values.employerName : undefined ,
      };

      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entry
      );
      dispatch({ type: "ADD_PATIENT", payload: newPatient });
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  if (!patientId) return <></>;

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatient = async () => {
      try {
        const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${patientId}`);
        const p = response.data;
        dispatch({type: 'ADD_PATIENT', payload: p});
        setPatient(p);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();
  }, []);

  if(!patient) return <></>;


  

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>Gender: {patient.gender}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>SSN: {patient.ssn}</p>
      
      <div>
        <p><b>entries</b></p>
        {patient.entries.map((e) => {

          return (
            <div key={e.id}>
              <EntryComponent entry={e} diagnoses={diagnoses} />
            </div>
          );
        })}
      </div>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>

    </div>
  );
};

export default IndividualPatientPage;