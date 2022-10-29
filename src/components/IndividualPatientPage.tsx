import { Patient } from "../types";

const IndividualPatientPage = ({ patient }: { patient: Patient | undefined }): JSX.Element => {

  if (!patient) return <></>;

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>Gender: {patient.gender}</p>
      <p>Occupation: {patient.occupation}</p>
      <p>SSN: {patient.ssn}</p>
    </div>
  );
};

export default IndividualPatientPage;