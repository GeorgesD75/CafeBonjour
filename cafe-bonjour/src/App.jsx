import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import DaySelector from './components/DaySelector';
import GroupResults from './components/GroupResults';
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
  Title3,
  Subtitle2,
  Card,
  Text,
  tokens,
  Button,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
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

  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState('monday');
  const [time, setTime] = useState('09:00');
  const [channelName, setChannelName] = useState('');
  const [message, setMessage] = useState('');

  const [generating, setGenerating] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    // 1. Récupérer l'état de connexion MSAL
    fetch('/auth/me')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Non connecté');
      })
      .then((data) => {
        setUser(data.account);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });

    // 2. Récupérer la configuration sauvegardée
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        setSelectedDay(settings.selectedDay || 'monday');
        setTime(settings.time || '09:00');
        setChannelName(settings.channelName || t('convoTitlePlaceholder'));
        setMessage(settings.message || t('defaultMessage'));
      })
      .catch(err => console.error("Erreur chargement paramètres", err));

  }, []);

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
    const fakeChannel = channelName || t('convoTitlePlaceholder');

    return message
      .replaceAll('{groupe}', fakeGroup)
      .replaceAll('{canal}', fakeChannel);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('cafebonjour_lang', lng); // <--- Persistance !
    // On met à jour les placeholders par defaut lors du changement si non modifiés
    if (channelName === t('convoTitlePlaceholder', { lng: i18n.language === 'fr' ? 'en' : 'fr' })) {
      setChannelName(t('convoTitlePlaceholder', { lng }));
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>

        {/* Sélecteur de langue placé seul en haut à droite pour éviter le conflit avec le titre */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: tokens.colorNeutralBackground3, padding: '0.25rem', borderRadius: tokens.borderRadiusMedium }}>
            <Button
              appearance={i18n.language.startsWith('fr') ? "primary" : "transparent"}
              onClick={() => changeLanguage('fr')}
              style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Français"
            ><Text weight="semibold">FR</Text></Button>
            <Button
              appearance={i18n.language.startsWith('en') ? "primary" : "transparent"}
              onClick={() => changeLanguage('en')}
              style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="English"
            ><Text weight="semibold">EN</Text></Button>
            <Button
              appearance={i18n.language.startsWith('es') ? "primary" : "transparent"}
              onClick={() => changeLanguage('es')}
              style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Español"
            ><Text weight="semibold">ES</Text></Button>
          </div>
        </div>

        <Title1 style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>{t('appTitle')}</Title1>

        {loading ? (
          <Spinner label={t('loading')} />
        ) : !user ? (
          <Card className={styles.preview} style={{ alignItems: 'center', textAlign: 'center', marginTop: '2rem', padding: '3rem' }}>
            <Subtitle2>{t('welcomeTitle')}</Subtitle2>
            <Text style={{ marginBottom: '1.5rem', color: tokens.colorNeutralForeground2 }}>
              {t('welcomeDesc')}
            </Text>
            <Button appearance="primary" size="large" onClick={() => window.location.href = '/auth/login'}>
              {t('loginBtn')}
            </Button>
          </Card>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: tokens.colorNeutralBackground3, padding: '1rem 1.5rem', borderRadius: tokens.borderRadiusMedium, marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text weight="semibold">{user.name || user.username}</Text>
              </div>
              <Text size={200} style={{ color: tokens.colorNeutralForeground4 }}>{t('connectedVia')}</Text>
            </div>

            {(!resultData || resultData?.isFakePreview) && (
              <Card style={{ backgroundColor: '#fff4ce', borderColor: '#f2c811', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text weight="semibold" style={{ display: 'block', marginBottom: '0.2rem' }}>{t('adminAlertTitle')}</Text>
                    <Text size={200}>{t('adminAlertDesc')}</Text>
                  </div>
                  <Button appearance="outline" onClick={() => window.location.href = '/auth/admin-consent'}>
                    {t('adminBtn')}
                  </Button>
                </div>
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card style={{ padding: '1.5rem', border: `1px solid ${tokens.colorNeutralStroke1}` }}>
                <Title3 style={{ marginBottom: '1rem' }}>{t('step1')}</Title3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
                  <Field label={`${t('timeLabel')} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`}>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e, data) => setTime(e.target.value)}
                    />
                  </Field>
                </div>
              </Card>

              <Card style={{ padding: '1.5rem', border: `1px solid ${tokens.colorNeutralStroke1}` }}>
                <Title3 style={{ marginBottom: '1rem' }}>{t('step2')}</Title3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <Field label={t('convoTitleLabel')}>
                    <Input
                      value={channelName}
                      onChange={(e, data) => setChannelName(data.value)}
                      placeholder={t('convoTitlePlaceholder')}
                    />
                  </Field>

                  <Field
                    label={t('msgLabel')}
                    hint={
                      <Trans i18nKey="msgHint" components={{ 1: <strong /> }} />
                    }
                  >
                    <Textarea
                      value={message}
                      onChange={(e, data) => setMessage(data.value)}
                      resize="vertical"
                      rows={4}
                    />
                  </Field>

                  <div style={{ backgroundColor: tokens.colorNeutralBackground1, padding: '1rem', borderRadius: tokens.borderRadiusSmall, border: `1px solid ${tokens.colorNeutralStroke1}` }}>
                    <Subtitle2>{t('previewTitle')}</Subtitle2>
                    <Text style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem', display: 'block' }}>
                      {getParsedMessage()}
                    </Text>
                  </div>
                </div>
              </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
              <Text style={{ marginBottom: '1rem', color: tokens.colorNeutralForeground3, textAlign: 'center' }}>
                <i>{t('noteDisclaimer')}</i>
              </Text>

              <Button
                appearance="primary"
                size="large"
                disabled={generating}
                onClick={async () => {
                  setGenerating(true);
                  setResultData(null);

                  // 1. Sauvegarder la config avec le Timezone du navigateur Client
                  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedDay, time, channelName, message, timezone: tz })
                  });

                  // 2. Générer les binômes (Aperçu)
                  fetch('/api/generate')
                    .then(res => {
                      if (!res.ok) throw new Error("Erreur droits");
                      return res.json();
                    })
                    .then(data => {
                      setResultData(data);
                      setGenerating(false);
                    })
                    .catch(() => {
                      // Fallback visuel local si les droits (Graph API) manquent encore
                      const fakeData = {
                        isFakePreview: true,
                        totalGroups: 1,
                        totalUsers: 2,
                        groups: [
                          {
                            user1: { displayName: "Employé A" },
                            user2: { displayName: "Employé B" }
                          }
                        ]
                      };
                      setResultData(fakeData);
                      alert(t('alertFake'));
                      setGenerating(false);
                    });
                }}>
                {generating ? <Spinner size="tiny" /> : t('btnSave')}
              </Button>
            </div>

            {resultData && <GroupResults resultData={resultData} messageTemplate={message} channelName={channelName} />}
          </>
        )}
      </div>
    </FluentProvider>
  );
};

export default App;
