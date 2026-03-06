import React from 'react';
import { FluentProvider, webLightTheme, Title1, Title3, Text, Card, makeStyles, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
    container: { padding: '2rem', maxWidth: '800px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    section: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }
});

export default function Privacy() {
    const styles = useStyles();
    return (
        <FluentProvider theme={webLightTheme}>
            <div className={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title1>Politique de Confidentialité</Title1>
                    <Button appearance="subtle" onClick={() => window.location.href = '/'}>Retour à l'Accueil</Button>
                </div>
                <Card style={{ padding: '2rem' }}>
                    <div className={styles.section}>
                        <Title3>1. Collecte des données</Title3>
                        <Text block>L'application "Café Bonjour" nécessite l'accès en lecture à l'annuaire de votre organisation (Microsoft Graph API) uniquement dans le but de lister les utilisateurs afin de générer des binômes. Aucune donnée personnelle n'est stockée de façon permanente sur nos serveurs.</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>2. Utilisation des données</Title3>
                        <Text block>Les informations collectées (Nom, Prénom, Email) sont utilisées exclusivement pour orchestrer des conversations privées (chats) au sein de votre environnement Microsoft Teams. L'application agit comme un automate sans sauvegarder le contenu de l'annuaire ni les messages envoyés.</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>3. Partage des informations</Title3>
                        <Text block>Vos données ne sont ni revendues, ni partagées avec des prestataires tiers. L'intégralité du traitement de jumelage s'effectue entre l'environnement Microsoft Teams de l'entreprise et la mémoire volatile du moteur de génération.</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>4. Sécurité</Title3>
                        <Text block>Nous mettons en œuvre des mesures de sécurité de l'industrie pour protéger l'architecture (Helmet, Rate-Limits, HttpOnly Cookies). Les communications entre votre environnement Teams et l'application s'effectuent via HTTPS avec le protocole d'authentification robuste Microsoft OAuth2.</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>5. Vos droits (RGPD)</Title3>
                        <Text block>Puisque notre application ne sauvegarde aucune donnée d'utilisateur sur notre base de données (nous ne stockons que les horaires de planification pour votre locataire), les droits de suppression d'utilisateurs s'exercent directement depuis la console d'administration Microsoft 365. Pour révoquer l'accès global de l'application, l'administrateur peut la supprimer du centre d'administration Azure AD / MS Entra ID.</Text>
                    </div>
                </Card>
            </div>
        </FluentProvider>
    );
}
