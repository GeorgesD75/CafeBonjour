import React, { useState } from 'react';
import 'dotenv/config';

function App() {
  const [enabled, setEnabled] = useState(true);
  cconst [message, setMessage] = useState(
  'Bonjour {groupe} 👋\nBienvenue à votre café du jour ☕\nPrenez un moment pour discuter ensemble !'
);
  const [targetWholeOrg, setTargetWholeOrg] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [channelName, setChannelName] = useState('☕ café-bonjour');
  const [sendTime, setSendTime] = useState('09:00');
  const [specificDay, setSpecificDay] = useState('monday');

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      enabled,
      message,
      targetWholeOrg,
      selectedTeams,
      channelName,
      sendTime,
      specificDay,
    };
    console.log('Form submission:', config);
    alert('Configuration enregistrée !');
  };

  const handleCreateTeam = () => {
    alert('Création de l’équipe Café Bonjour en cours...');
  };

  const tooltipStyle = {
    display: 'inline-block',
    marginLeft: '0.5rem',
    cursor: 'help',
    color: '#555',
  };

  const formatDay = (day) => {
    const days = {
      monday: 'lundi',
      tuesday: 'mardi',
      wednesday: 'mercredi',
      thursday: 'jeudi',
      friday: 'vendredi',
    };
    return days[day] || day;
  };

  const renderSummary = () => {
  const fakeGroup = 'Emma, Jules';
  const parsedMessage = message.replaceAll('{groupe}', fakeGroup);
  const timeFormatted = sendTime?.padStart(5, '0');
  const day = formatDay(specificDay);

  return (
    <div style={{
      marginTop: '2rem',
      padding: '1rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #ddd'
    }}>
      <strong>Aperçu de la configuration :</strong>
      <p>
        Une conversation Teams sera créée chaque semaine le <strong>{day}</strong> à <strong>{timeFormatted}</strong>,<br />
        dans le canal <strong>{channelName}</strong>,<br />
        pour chaque groupe (2 à 3 personnes), avec le message suivant :
      </p>
      <pre style={{
        backgroundColor: '#f0f0f0',
        padding: '0.75rem',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap'
      }}>
        {message}
      </pre>
    </div>
  );
};


  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>☕ Configuration Café Bonjour</h1>

      <form onSubmit={handleSubmit}>

        {/* Message personnalisé */}
        <label>
          Message personnalisé :
          <span
            title="Variables disponibles : {groupe} = groupe de 2 à 3 personnes"
            style={tooltipStyle}
          >
            🛈
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{ width: '100%' }}
          />
        </label>

        <br /><br />

        {/* Cibler toute l’organisation */}
        <label>
          <input
            type="checkbox"
            checked={targetWholeOrg}
            onChange={(e) => setTargetWholeOrg(e.target.checked)}
          />
          Cibler toute l’organisation
        </label>

        <br /><br />

        {/* Équipes ciblées */}
        {!targetWholeOrg && (
          <>
            <label>
              Équipes ciblées (séparer par virgules) :
              <input
                type="text"
                value={selectedTeams.join(', ')}
                onChange={(e) => setSelectedTeams(e.target.value.split(',').map(s => s.trim()))}
                placeholder="Ex : RH, Produit, Com"
                style={{ width: '100%' }}
              />
            </label>
            <br /><br />
          </>
        )}

        {/* Nom du canal */}
        <label>
          Nom du canal :
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>

        <br /><br />

        {/* Jour spécifique */}
        <label>
          Jour d’envoi :
          <select
            value={specificDay}
            onChange={(e) => setSpecificDay(e.target.value)}
          >
            <option value="monday">Lundi</option>
            <option value="tuesday">Mardi</option>
            <option value="wednesday">Mercredi</option>
            <option value="thursday">Jeudi</option>
            <option value="friday">Vendredi</option>
          </select>
        </label>

        <br /><br />

        {/* Heure d’envoi */}
        <label>
          Heure d’envoi :
          <input
            type="time"
            value={sendTime}
            onChange={(e) => setSendTime(e.target.value)}
          />
        </label>

        <br /><br />

        {/* Boutons */}
        <button type="button" onClick={handleCreateTeam}>
          Créer l’équipe Café Bonjour
        </button>{' '}
        <button type="submit">
          Enregistrer
        </button>

        <br /><br />

        {/* Activer/désactiver l’app */}
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Activer l'application
        </label>

        {/* Résumé dynamique */}
        {renderSummary()}
      </form>
    </div>
  );
}

export default App;
