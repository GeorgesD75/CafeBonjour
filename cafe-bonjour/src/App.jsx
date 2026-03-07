import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import DaySelector from './components/DaySelector';
import GroupResults from './components/GroupResults';
import {
  FluentProvider,
  webLightTheme,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  createLightTheme,
  createDarkTheme,
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
  AccordionPanel,
} from '@fluentui/react-components';
import { app } from '@microsoft/teams-js';

const CoffeeLoader = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', animation: 'bounce 1s infinite alternate' }}>☕</div>
      <Text as="h3" weight="semibold" style={{ color: '#505AC9' }}>{message || t('loading') || "Préparation en cours..."}</Text>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');
        @keyframes bounce {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

const customTeamsBrandRamp = {
  10: "#060711",
  20: "#22275C",
  30: "#2E357E",
  40: "#3A43A0",
  50: "#464EB8", // Ocean Blue
  60: "#505AC9", // Iris
  70: "#5A66DA",
  80: "#6572EB",
  90: "#7B83EB", // Medium Slate Blue
  100: "#8D94F0",
  110: "#9FA5F5",
  120: "#B1B6F8",
  130: "#C3C7FA",
  140: "#D6D9FD",
  150: "#E8EAFE",
  160: "#FAFaff"
};

const customTeamsLightTheme = createLightTheme(customTeamsBrandRamp);
const customTeamsDarkTheme = createDarkTheme(customTeamsBrandRamp);

const useStyles = makeStyles({
  container: {
    padding: '3rem 2rem',
    maxWidth: '750px',
    margin: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
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

  const [teamsThemeVar, setTeamsThemeVar] = useState(customTeamsLightTheme);
  const [isInTeams, setIsInTeams] = useState(false);

  useEffect(() => {
    // 0. Initialisation Microsoft Teams SDK
    const initTeams = async () => {
      try {
        await app.initialize();
        const context = await app.getContext();
        setIsInTeams(true);

        const applyTheme = (themeStr) => {
          if (themeStr === 'dark') setTeamsThemeVar(customTeamsDarkTheme);
          else if (themeStr === 'contrast') setTeamsThemeVar(teamsHighContrastTheme);
          else setTeamsThemeVar(customTeamsLightTheme);
        };

        applyTheme(context.app.theme);
        app.registerOnThemeChangeHandler(applyTheme);
      } catch (err) {
        console.log("Exécution hors Teams détectée (Web/Localhost)");
        setTeamsThemeVar(customTeamsLightTheme);
      }
    };
    initTeams();

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

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const getParsedMessage = () => {
    const fakeGroup = 'Emma, Jules';
    const fakeChannel = channelName || t('convoTitlePlaceholder');

    return message
      .replaceAll('{groupe}', fakeGroup)
      .replaceAll('{conversation}', fakeChannel);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('cafebonjour_lang', lng); // <--- Persistance !

    // Si le nom de la conversation ou le message est inchangé par rapport aux valeurs par défaut des autres langues, on traduit
    const defaultChannels = [' café-bonjour', ' coffee-bonjour'];
    if (defaultChannels.includes(channelName?.trimEnd()) || !channelName) {
      setChannelName(t('convoTitlePlaceholder', { lng }));
    }
    const defaultMessages = [
      // Très vieux textes
      "Bonjour {groupe} 👋\nBienvenue à votre café du jour !",
      // Anciens textes pour assurer la rétrocompatibilité (détection)
      "Bonjour {groupe} 👋\nProfitez de cette conversation privée pour planifier votre café !",
      "Hello {groupe} 👋\nTake advantage of this private conversation to plan your coffee!",
      "¡Hola {groupe}! 👋\n¡Aproveche esta conversación privada para planificar su café!",
      "Bonjour {groupe} 👋\nProfitez de cette conversation pour planifier un café dans la semaine :)",
      "Hello {groupe} 👋\nTake advantage of this conversation to plan a coffee during the week :)",
      "¡Hola {groupe}! 👋\n¡Aprovecha esta conversación para planificar un café durante la semana :)",
      // Nouveaux textes actuels
      "Bonjour {groupe} 👋\nProfitez de cette conversation pour planifier un moment sympa autour d'un café dans la semaine !",
      "Hello {groupe} 👋\nTake advantage of this conversation to plan a nice moment around a coffee during the week!",
      "¡Hola {groupe}! 👋\n¡Aprovecha esta conversación para planificar un momento agradable tomando un café durante la semana!"
    ];
    const normalizedMessage = message?.replace(/\r\n/g, '\n').trim();
    const isDefault = defaultMessages.some(def => def.replace(/\r\n/g, '\n').trim() === normalizedMessage);

    if (isDefault || !message) {
      setMessage(t('defaultMessage', { lng }));
    }
  };

  return (
    <FluentProvider theme={teamsThemeVar} style={{ minHeight: '100vh', background: isInTeams ? 'transparent' : 'linear-gradient(135deg, #eef0fa 0%, #f4f5fd 100%)', paddingBottom: '4rem' }}>
      <style>{`.lang-btn { min-width: 60px !important; padding: 0 !important; }`}</style>
      <div
        className={styles.container}
        style={{
          marginTop: isInTeams ? '1rem' : 'auto',
          backgroundImage: 'url(/bg_flow_top_abstract.png), url(/corporate_coffee_bg_warm.png), url(/bg_flow_bottom.png)',
          backgroundSize: '100% auto, 100% auto, 100% auto',
          backgroundPosition: 'top center, top 200px center, bottom center',
          backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
          backgroundBlendMode: 'multiply, multiply, normal',
          backgroundColor: '#ffffff'
        }}
      >

        {/* Sélecteur de langue placé seul en haut à droite pour éviter le conflit avec le titre */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '0.25rem', borderRadius: tokens.borderRadiusMedium, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Button
              appearance={i18n.language.startsWith('fr') ? "primary" : "transparent"}
              onClick={() => changeLanguage('fr')}
              className="lang-btn"
              style={{ width: '60px', height: '20px', padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i18n.language.startsWith('fr') ? 1 : 0.4, transition: 'opacity 0.2s' }}
              title="Français"
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 900, fontSize: '0.8rem', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.8)', background: 'linear-gradient(90deg, #0055A4 33%, #FFFFFF 33%, #FFFFFF 66%, #EF4135 66%)' }}>
                FR
              </span>
            </Button>
            <Button
              appearance={i18n.language.startsWith('en') ? "primary" : "transparent"}
              onClick={() => changeLanguage('en')}
              className="lang-btn"
              style={{ width: '60px', height: '20px', padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i18n.language.startsWith('en') ? 1 : 0.4, transition: 'opacity 0.2s' }}
              title="English"
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 900, fontSize: '0.8rem', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.8)', background: 'linear-gradient(90deg, transparent 44%, #C8102E 44%, #C8102E 56%, transparent 56%), linear-gradient(180deg, transparent 38%, #C8102E 38%, #C8102E 62%, transparent 62%), linear-gradient(90deg, transparent 40%, #fff 40%, #fff 60%, transparent 60%), linear-gradient(180deg, transparent 30%, #fff 30%, #fff 70%, transparent 70%), linear-gradient(35deg, transparent 46%, #C8102E 46%, #C8102E 54%, transparent 54%), linear-gradient(-35deg, transparent 46%, #C8102E 46%, #C8102E 54%, transparent 54%), linear-gradient(35deg, transparent 42%, #fff 42%, #fff 58%, transparent 58%), linear-gradient(-35deg, transparent 42%, #fff 42%, #fff 58%, transparent 58%), #012169' }}>
                EN
              </span>
            </Button>
            <Button
              appearance={i18n.language.startsWith('es') ? "primary" : "transparent"}
              onClick={() => changeLanguage('es')}
              className="lang-btn"
              style={{ width: '60px', height: '20px', padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i18n.language.startsWith('es') ? 1 : 0.4, transition: 'opacity 0.2s' }}
              title="Español"
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 900, fontSize: '0.8rem', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.8)', background: 'linear-gradient(180deg, #AA151B 25%, #F1BF00 25%, #F1BF00 75%, #AA151B 75%)' }}>
                ES
              </span>
            </Button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '3rem', position: 'relative' }}>
          <Title1 style={{
            background: 'linear-gradient(135deg, #464EB8 0%, #7B83EB 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block',
            margin: '0 auto',
            textAlign: 'center',
            fontSize: '3.5rem',
            lineHeight: '1.2',
            fontWeight: '900',
            paddingBottom: '0.2rem',
            filter: 'drop-shadow(0px 3px 6px rgba(70, 78, 184, 0.25))'
          }}>
            {t('appTitle').split(/(Bonjour)/i).map((part, i) =>
              part.toLowerCase() === 'bonjour' ? (
                <span key={i} style={{
                  position: 'relative',
                  display: 'inline-block',
                  fontFamily: '"Playfair Display", serif',
                  fontStyle: 'italic',
                  fontSize: '1.4em',
                  fontWeight: 'bold',
                  marginLeft: '8px',
                  marginRight: '8px',
                  paddingBottom: '2px',
                  color: '#464EB8',
                  WebkitTextFillColor: '#464EB8'
                }}>
                  {part}
                  {/* Liseré subtil Bleu Blanc Rouge */}
                  <span style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: '4%',
                    right: '4%',
                    height: '4px',
                    background: 'linear-gradient(to right, #0055A4 33.3%, #ffffff 33.3%, #ffffff 66.6%, #EF4135 66.6%)',
                    borderRadius: '2px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                  }} />
                </span>
              ) : part
            )}
          </Title1>
        </div>

        {loading ? (
          <CoffeeLoader />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isInTeams ? tokens.colorNeutralBackground3 : 'rgba(255, 255, 255, 0.7)', backdropFilter: isInTeams ? 'none' : 'blur(10px)', padding: '1rem 1.5rem', borderRadius: tokens.borderRadiusMedium, marginBottom: '1rem', border: `1px solid ${tokens.colorNeutralStroke1}` }}>
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
              <Card style={{ padding: '1.5rem', backgroundColor: isInTeams ? tokens.colorNeutralBackground1 : 'rgba(255, 255, 255, 0.85)', backdropFilter: isInTeams ? 'none' : 'blur(20px)', border: `1px solid ${tokens.colorNeutralStroke1}`, boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' }}>
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

              <Card style={{ padding: '1.5rem', backgroundColor: isInTeams ? tokens.colorNeutralBackground1 : 'rgba(255, 255, 255, 0.85)', backdropFilter: isInTeams ? 'none' : 'blur(20px)', border: `1px solid ${tokens.colorNeutralStroke1}`, boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' }}>
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

                  <div style={{ backgroundColor: isInTeams ? tokens.colorNeutralBackground1 : 'rgba(255, 255, 255, 0.6)', padding: '1rem', borderRadius: tokens.borderRadiusSmall, border: `1px dashed ${tokens.colorNeutralStroke1}` }}>
                    <Subtitle2>{t('previewTitle')}</Subtitle2>
                    <Text style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem', display: 'block' }}>
                      {getParsedMessage()}
                    </Text>
                  </div>
                </div>
              </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
              <Text style={{ marginBottom: '1rem', color: tokens.colorNeutralForeground2, textAlign: 'center', fontWeight: '600', textShadow: '0 1px 4px rgba(255,255,255,0.9), 0 -1px 4px rgba(255,255,255,0.9)' }}>
                <i>{t('noteDisclaimer')}</i>
              </Text>

              {generating ? (
                <CoffeeLoader message={t('generatingPreview')} />
              ) : (
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
                        setTimeout(() => {
                          setResultData(data);
                          setGenerating(false);
                        }, 1500);
                      })
                      .catch(() => {
                        setTimeout(() => {
                          const fakeData = {
                            isFakePreview: true,
                            totalGroups: 1,
                            totalUsers: 2,
                            groups: [
                              {
                                user1: { displayName: "Employé A", profilePhoto: null },
                                user2: { displayName: "Employé B", profilePhoto: null }
                              }
                            ]
                          };
                          setResultData(fakeData);
                          // L'alerte native bloquait l'UI et brisait le scroll. On l'enlève car un message d'alerte s'affiche de toute facon dans GroupResults.
                          setGenerating(false);
                        }, 1500);
                      });
                  }}>
                  {t('btnSave')}
                </Button>
              )}
            </div>

            {resultData && <GroupResults resultData={resultData} messageTemplate={message} channelName={channelName} isInTeams={isInTeams} time={time} />}
          </>
        )}
      </div>
    </FluentProvider>
  );
};
export default App;
