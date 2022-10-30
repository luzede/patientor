import { Patient } from "../types";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";

const IndividualPatientPage = ({ patientId }: { patientId: string | undefined }): JSX.Element => {

  const [{ diagnoses }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient | null>(null);

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
              <p>{e.date}: <i>{e.description}</i></p>
              <ul>
                {e.diagnosisCodes
                ? e.diagnosisCodes.map((code, index) => {
                  return(
                    <li key={index}>
                      {code}: {diagnoses[code]}
                    </li>
                  );
                })
                : null
              }
              </ul>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default IndividualPatientPage;