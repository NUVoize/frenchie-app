import { useRef, useState } from "react";
import {
  parseBackup,
  recoveryBackup,
  restoreBackup,
  type Backup,
} from "../backup";

export function CarnetImport({ refresh }: { refresh: () => void }) {
  const [pending, setPending] = useState<Backup | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [recovery, setRecovery] = useState(recoveryBackup);
  const sequence = useRef(0);
  function apply() {
    if (!pending) return;
    try {
      restoreBackup(pending);
      setRecovery(recoveryBackup());
      setPending(null);
      setError("");
      setMessage(
        "Ton carnet est restauré. Tu peux reprendre tes séances et retrouver tes progrès.",
      );
      refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Impossible de restaurer ce carnet.",
      );
    }
  }
  return (
    <div className="carnetImport">
      <h3>Retrouver un carnet</h3>
      <p>
        Choisis ta copie pour retrouver tes progrès sur ce navigateur. Le
        fichier reste sur ton appareil.
      </p>
      <label className="filePicker">
        Choisir un carnet (.json)
        <input
          type="file"
          accept=".json,application/json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            const request = ++sequence.current;
            setPending(null);
            setMessage("");
            setError("");
            if (!file) return;
            try {
              if (file.size > 5_000_000)
                throw new Error("Choisis un carnet de moins de 5 Mo.");
              const backup = parseBackup(await file.text());
              if (request !== sequence.current) return;
              setPending(backup);
              setName(file.name);
            } catch (err) {
              if (request === sequence.current)
                setError(
                  err instanceof Error
                    ? err.message
                    : "Impossible de lire ce fichier.",
                );
            }
          }}
        />
      </label>
      {pending && (
        <section
          className="importReview"
          aria-label="Vérifier le carnet avant de restaurer"
        >
          <h3>Voici ton carnet</h3>
          <p className="backupFilename">{name}</p>
          <p>Copie du {new Date(pending.exportedAt).toLocaleString("fr-CA")}</p>
          <ul>
            <li>
              {Object.keys(pending.quebecPack).length} fiche(s) du carnet
              québécois enregistrée(s)
            </li>
            <li>
              {Object.keys(pending.expansion).length} activité(s) du parcours
              élargi enregistrée(s)
            </li>
            <li>
              {pending.progress.completedChapters.length} chapitre(s) terminé(s)
            </li>
            <li>{pending.history.attempts.length} séance(s) enregistrée(s)</li>
            <li>{pending.sessions.length} séance(s) normale(s) en pause</li>
            <li>
              {Object.keys(pending.quebecProgress).length} série(s) Québec
              pratiquée(s)
            </li>
            <li>
              {Object.keys(pending.quebecSessions).length} série(s) Québec en
              pause
            </li>
          </ul>
          <p>
            Ce carnet remplacera les progrès et les préférences actuels. Une
            copie de l’état actuel sera gardée ici pour revenir en arrière.
          </p>
          <div className="chips">
            <button className="primary" onClick={apply}>
              Remplacer par ce carnet
            </button>
            <button
              onClick={() => {
                sequence.current++;
                setPending(null);
              }}
            >
              Annuler
            </button>
          </div>
        </section>
      )}
      {message && <p role="status">{message}</p>}
      {error && (
        <p role="alert" className="importError">
          {error}
        </p>
      )}
      {recovery && !pending && (
        <button
          onClick={() => {
            setPending(recovery);
            setName("Carnet conservé avant la dernière restauration");
            setMessage("");
            setError("");
          }}
        >
          Revoir le carnet précédent
        </button>
      )}
    </div>
  );
}
