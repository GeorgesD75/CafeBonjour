import React from 'react';
import { FluentProvider, webLightTheme, Title1, Title3, Text, Card, makeStyles, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
    container: { padding: '2rem', maxWidth: '800px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    section: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }
});

export default function Terms() {
    const styles = useStyles();
    return (
        <FluentProvider theme={webLightTheme}>
            <div className={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title1>Conditions d'Utilisation</Title1>
                    <Button appearance="subtle" onClick={() => window.location.href = '/'}>Retour à l'Accueil</Button>
                </div>
                <Card style={{ padding: '2rem' }}>
                    <div className={styles.section}>
                        <Title3>1. Présentation du service</Title3>
                        <Text block>"Café Bonjour" est une application tierce pour Microsoft Teams permettant d'organiser automatiquement des conversations privées (en petits groupes ou binômes) entre les collaborateurs de l'entreprise cliente à des fréquences définies par l'Administrateur.</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>2. Accès et Consentement</Title3>
                        <Text block>L'installation de l'application requiert le consentement d'enteprise d'un Administrateur de l'organisation ("Admin Consent") permettant d'accorder le droit à l'Application de lire l'annuaire d'employés et d'initier des conversations purement techniques au nom du chatbot du locataire Microsoft.</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>3. Responsabilité</Title3>
                        <Text block>L'application est fournie "en l'état". Bien que nous veillons à un haut niveau de disponibilité, l'éditeur ne saurait être tenu responsable d'éventuels dysfonctionnements liés aux coupures des API Microsoft Graph tierces, ni des éventuels retards dans la planification ou envois de l'automatisation.</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>4. Droits de propriété intellectuelle</Title3>
                        <Text block>L'ensemble du code central, de la charte graphique et des logiques algorithmiques de l'application "Café Bonjour" reste la propriété exclusive de son ou ses créateur(s).</Text>
                    </div>
                    <div className={styles.section}>
                        <Title3>5. Modification et Abonnements</Title3>
                        <Text block>Dans le cadre de cette version Freemium, le service est gratuit. L'éditeur se réserve le droit d'adapter ces présentes conditions générales, notamment en cas de déploiement ultérieur de fonctionnalités additionnelles dites "Premium" pour les organisations.</Text>
                    </div>
                </Card>
            </div>
        </FluentProvider>
    );
}
