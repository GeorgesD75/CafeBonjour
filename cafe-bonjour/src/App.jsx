import React, { useState } from 'react';
import DaySelector from './components/DaySelector';
import {
  FluentProvider,
  webLightTheme,
  Input,
  Textarea,
  Select,
  Option,
  Label,
  Field,
  makeStyles,
  Title1,
  Subtitle2,
  Card,
  Text,
  tokens
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: '2rem',
    maxWidth: '700px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  preview: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '1.5rem',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  codeBlock: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '1rem',
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    whiteSpace: 'pre-wrap',
  }
});

const App = () => {
  const styles = useStyles();

  const [day, setDay] = useState('Lundi');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [time, setTime] = useState('09:00');
  const [channelName, setChannelName] = useState('☕ café-bonjour');
  const [message, setMessage] = useState(
    'Bonjour {groupe} 👋\nBienvenue à votre café du jour dans #{canal} ☕'
  );

  const getDayLabel = (key) => {
    const days = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
    };
    return days[key] || '';
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const getParsedMessage = () => {
    const fakeGroup = 'Emma, Jules';
    const fakeChannel = channelName || '☕ café-bonjour';

    return message
      .replaceAll('{groupe}', fakeGroup)
      .replaceAll('{canal}', fakeChannel);
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <Title1>Configuration Café Bonjour</Title1>
        <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

        <Field label="Heure">
          <Input
            type="time"
            value={time}
            onChange={(e, data) => setTime(e.target.value)}
          />
        </Field>

        <Field label="Nom du canal Teams">
          <Input
            value={channelName}
            onChange={(e, data) => setChannelName(data.value)}
            placeholder="☕ café-bonjour"
          />
        </Field>

        <Field
          label="Message personnalisé"
          hint="Utilisez {groupe} pour insérer les membres du binôme (2-3 personnes), et {canal} pour le nom du canal"
        >
          <Textarea
            value={message}
            onChange={(e, data) => setMessage(data.value)}
            resize="vertical"
          />
        </Field>

        <Card className={styles.preview}>
          <Subtitle2>Aperçu de la configuration :</Subtitle2>
          <Text>
            Une conversation Teams sera créée pour chaque binôme chaque semaine,
            le <strong>{getDayLabel(selectedDay)}</strong> à <strong>{formatTime(time)}</strong> dans le canal <strong>#{channelName}</strong>,
            avec le message suivant :
          </Text>
          <div className={styles.codeBlock}>
            {getParsedMessage()}
          </div>
        </Card>
      </div>
    </FluentProvider>
  );
};

export default App;
