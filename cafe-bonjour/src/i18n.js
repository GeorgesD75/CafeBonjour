import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    fr: {
        translation: {
            "appTitle": "Configuration Café Bonjour",
            "loading": "Vérification de la connexion...",
            "welcomeTitle": "Bienvenue sur Café Bonjour 👋",
            "welcomeDesc": "Organisez automatiquement des pauses café informelles pour renforcer la cohésion de vos équipes Microsoft Teams. Veuillez vous authentifier avec votre compte d'entreprise pour commencer.",
            "loginBtn": "Se connecter à Microsoft Teams",
            "connectedVia": "Connecté via Microsoft Teams",
            "adminAlertTitle": "⚠️ Action requise par l'Administrateur",
            "adminAlertDesc": "Pour que le bot puisse créer des conversations privées, un administrateur Microsoft 365 doit octroyer les permissions d'Application (Consentement Admin).",
            "adminBtn": "Approuver les droits (Admin)",
            "step1": "1. Planification des rencontres",
            "timeLabel": "Heure d'exécution de la tâche locale",
            "step2": "2. Contenu du Message Automatique",
            "convoTitleLabel": "Titre de la conversation privée",
            "convoTitlePlaceholder": " café-bonjour",
            "msgLabel": "Message personnalisé pour les participants",
            "msgHint": "Personnalisez l'accueil. Utilisez <1>{groupe}</1> pour insérer la liste des collaborateurs conviés et <3>{conversation}</3> pour son titre.",
            "previewTitle": "Aperçu du message :",
            "noteDisclaimer": "Note : Une fois les permissions accordées, les binômes seront générés automatiquement chaque semaine avec ces paramètres.",
            "btnSave": "Enregistrer la planification & Générer un aperçu !",
            "generatingPreview": "Génération de l'aperçu en cours...",
            "alertError": "Erreur lors de la génération. Avez-vous le compte administrateur et les droits approuvés ?",
            "alertFake": "Aperçu affiché. Note : La génération réelle a échoué car le compte Administrateur n'a pas encore concédé les droits de l'application.",
            "previewHeader": "Aperçu de la prochaine planification ({{count}} conversations privées)",
            "previewDesc": "Pour chaque groupe ci-dessous, une conversation Teams (chat privé) sera automatiquement créée et contiendra le message de bienvenue personnalisé. Au total, {{count}} collaborateurs seront conviés !",
            "convoPrefix": "💬 Conversation :",
            "andOthers": "… et {{count}} autres conversations privées non affichées pour des raisons de lisibilité.",
            "fakeModeTitle": "⚠️ Mode Aperçu Fictif Uniquement",
            "fakeModeDesc": "Ceci n'est qu'un aperçu visuel avec des employés fictifs (\"Employé A\"). Pour que l'application puisse lire l'annuaire de votre entreprise et créer les groupes avec les vrais collaborateurs, un administrateur M365 de votre entreprise doit d'abord accorder les droits via le bouton jaune en haut de la page.",
            "loadingMsg": "Message en cours de chargement...",
            "defaultMessage": "Bonjour {groupe} 👋\nProfitez de cette conversation pour planifier un moment sympa autour d'un café dans la semaine !",
            "today": "Aujourd'hui",
            "dayLabel": "Jour de la semaine",
            "monday": "Lundi",
            "tuesday": "Mardi",
            "wednesday": "Mercredi",
            "thursday": "Jeudi",
            "friday": "Vendredi"
        }
    },
    en: {
        translation: {
            "appTitle": "Café Bonjour Configuration",
            "loading": "Checking connection...",
            "welcomeTitle": "Welcome to Café Bonjour 👋",
            "welcomeDesc": "Automatically organize informal coffee breaks to strengthen team cohesion in Microsoft Teams. Please authenticate with your corporate account to get started.",
            "loginBtn": "Connect to Microsoft Teams",
            "connectedVia": "Connected via Microsoft Teams",
            "adminAlertTitle": "⚠️ Administrator Action Required",
            "adminAlertDesc": "For the bot to create private conversations, a Microsoft 365 administrator must grant Application permissions (Admin Consent).",
            "adminBtn": "Approve rights (Admin)",
            "step1": "1. Meeting Schedule",
            "timeLabel": "Local task execution time",
            "step2": "2. Automatic Message Content",
            "convoTitleLabel": "Private conversation title",
            "convoTitlePlaceholder": " coffee-bonjour",
            "msgLabel": "Custom message for participants",
            "msgHint": "Customize the greeting. Use <1>{groupe}</1> to insert the list of invited collaborators and <3>{conversation}</3> for its title.",
            "previewTitle": "Message preview:",
            "noteDisclaimer": "Note: Once permissions are granted, pairs will be generated automatically every week with these settings.",
            "btnSave": "Save Schedule & Generate Preview!",
            "generatingPreview": "Generating preview...",
            "alertError": "Error during generation. Do you have the administrator account and approved rights?",
            "alertFake": "Preview displayed. Note: Actual generation failed because the Administrator account hasn't granted application rights yet.",
            "previewHeader": "Preview of the next schedule ({{count}} private conversations)",
            "previewDesc": "For each group below, a Teams conversation (private chat) will be automatically created and will contain the custom welcome message. A total of {{count}} collaborators will be invited!",
            "convoPrefix": "💬 Conversation:",
            "andOthers": "… and {{count}} other private conversations not shown for readability reasons.",
            "fakeModeTitle": "⚠️ Fake Preview Mode Only",
            "fakeModeDesc": "This is just a visual preview with fictitious employees (\"Employee A\"). For the application to read your company directory and create groups with real collaborators, an M365 administrator from your company must first grant rights via the yellow button at the top of the page.",
            "loadingMsg": "Message is loading...",
            "defaultMessage": "Hello {groupe} 👋\nTake advantage of this conversation to plan a nice moment around a coffee during the week!",
            "today": "Today",
            "dayLabel": "Day of the week",
            "monday": "Monday",
            "tuesday": "Tuesday",
            "wednesday": "Wednesday",
            "thursday": "Thursday",
            "friday": "Friday"
        }
    },
    es: {
        translation: {
            "appTitle": "Configuración Café Bonjour",
            "loading": "Comprobando la conexión...",
            "welcomeTitle": "Bienvenido a Café Bonjour 👋",
            "welcomeDesc": "Organice automáticamente pausas de café informales para fortalecer la cohesión de su equipo en Microsoft Teams. Por favor, autentíquese con su cuenta corporativa para comenzar.",
            "loginBtn": "Conectarse a Microsoft Teams",
            "connectedVia": "Conectado vía Microsoft Teams",
            "adminAlertTitle": "⚠️ Acción requerida por el Administrador",
            "adminAlertDesc": "Para que el bot pueda crear conversaciones privadas, un administrador de Microsoft 365 debe otorgar los permisos de Aplicación (Consentimiento de Admin).",
            "adminBtn": "Aprobar permisos (Admin)",
            "step1": "1. Horario de reuniones",
            "timeLabel": "Hora de ejecución de la tarea local",
            "step2": "2. Contenido del mensaje automático",
            "convoTitleLabel": "Título de la conversación privada",
            "convoTitlePlaceholder": " café-bonjour",
            "msgLabel": "Mensaje personalizado para los participantes",
            "msgHint": "Personalice el saludo. Utilice <1>{groupe}</1> para insertar la lista de colaboradores invitados y <3>{conversation}</3> para su título.",
            "previewTitle": "Vista previa del mensaje:",
            "noteDisclaimer": "Nota: Una vez otorgados los permisos, las parejas se generarán automáticamente cada semana con estos ajustes.",
            "btnSave": "¡Guardar horario y generar vista previa!",
            "generatingPreview": "Generando vista previa...",
            "alertError": "Error durante la generación. ¿Tiene la cuenta de administrador y los derechos aprobados?",
            "alertFake": "Vista previa mostrada. Nota: La generación real falló porque la cuenta de Administrador aún no ha concedido los derechos de la aplicación.",
            "previewHeader": "Vista previa de la próxima planificación ({{count}} conversaciones privadas)",
            "previewDesc": "Por cada grupo a continuación, se creará automáticamente una conversación de Teams (chat privado) que contendrá el mensaje de bienvenida personalizado. ¡Se invitará a un total de {{count}} colaboradores!",
            "convoPrefix": "💬 Conversación:",
            "andOthers": "… y {{count}} otras conversaciones privadas no mostradas por razones de legibilidad.",
            "fakeModeTitle": "⚠️ Solo Modo de Vista Previa Ficticia",
            "fakeModeDesc": "Esto es solo una vista previa visual con empleados ficticios (\"Empleado A\"). Para que la aplicación lea el directorio de su empresa y cree grupos con colaboradores reales, un administrador de M365 de su empresa primero debe otorgar permisos a través del botón amarillo en la parte superior de la página.",
            "loadingMsg": "Mensaje cargando...",
            "defaultMessage": "¡Hola {groupe}! 👋\n¡Aprovecha esta conversación para planificar un momento agradable tomando un café durante la semana!",
            "today": "Hoy",
            "dayLabel": "Día de la semana",
            "monday": "Lunes",
            "tuesday": "Martes",
            "wednesday": "Miércoles",
            "thursday": "Jueves",
            "friday": "Viernes"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('cafebonjour_lang') || (navigator.language.split('-')[0] === 'fr' ? 'fr' : 'en'),
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
