
import { Entry } from "../types";


const EntryComponent = ({ entry, diagnoses }: { entry: Entry, diagnoses: { [code: string]: string } }) => {
  const color = {
    "HealthCheck": {
      borderColor: "blue",
      borderStyle: "solid"
    },
    "OccupationalHealthcare": {
      borderColor: "red",
      borderStyle: "solid"
    },
    "Hospital": {
      borderColor: "green",
      borderStyle: "solid"
    }
  };

  switch(entry.type) {
    case "HealthCheck":
      return <div style={color[entry.type]}>
        <p>{entry.date} </p>
        <p><i>{entry.description}</i></p>
        <p>Diagnosed by {entry.specialist}</p>
        <ul>
            {entry.diagnosisCodes
            ? entry.diagnosisCodes.map((code, index) => {
              return(
                <li key={index}>
                  {code}: {diagnoses[code]}
                </li>
                  );
                })
            : null
            }
        </ul>
      </div>;
    case "OccupationalHealthcare":
      return <div style={color[entry.type]}>
        <p>{entry.date} </p>
        <p><i>{entry.description}</i></p>
        <p>Diagnosed by {entry.specialist}</p>
        <ul>
            {entry.diagnosisCodes
            ? entry.diagnosisCodes.map((code, index) => {
              return(
                <li key={index}>
                  {code}: {diagnoses[code]}
                </li>
                  );
                })
            : null
            }
        </ul>
      </div>;
    case "Hospital":
      return <div style={color[entry.type]}>
        <p>{entry.date} </p>
        <p><i>{entry.description}</i></p>
        <p>Diagnosed by {entry.specialist}</p>
        <ul>
            {entry.diagnosisCodes
            ? entry.diagnosisCodes.map((code, index) => {
              return(
                <li key={index}>
                  {code}: {diagnoses[code]}
                </li>
                  );
                })
            : null
            }
        </ul>
      </div>;
    default:
      return assertNever(entry);
  }
};

export default EntryComponent;

function assertNever(input: never): never {
  console.log(input);
  throw new Error('Unhandled discriminated union member');
}