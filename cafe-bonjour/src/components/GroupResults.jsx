import React, { useEffect, useRef } from 'react';
import {
    Card,
    CardHeader,
    Text,
    Avatar,
    makeStyles,
    tokens,
    Title3,
} from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    container: {
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    groupCard: {
        backgroundColor: tokens.colorNeutralBackground1,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        padding: '1rem',
        borderRadius: tokens.borderRadiusMedium,
    },
    membersContainer: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginTop: '0.5rem',
    },
    memberItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
    }
});

const GroupResults = ({ resultData, messageTemplate, channelName }) => {
    const styles = useStyles();
    const titleRef = useRef(null);
    const { t } = useTranslation();

    const getGroupMessage = (members) => {
        if (!messageTemplate) return t('loadingMsg');
        const groupNames = members.map(m => m.displayName).join(', ');
        return messageTemplate
            .replaceAll('{groupe}', groupNames)
            .replaceAll('{canal}', channelName || t('convoTitlePlaceholder'));
    };

    useEffect(() => {
        if (resultData && resultData.groups && titleRef.current) {
            setTimeout(() => {
                titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [resultData]);

    if (!resultData || !resultData.groups) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Title3 ref={titleRef}>{t('previewHeader', { count: resultData.totalGroups })}</Title3>
            <Text>
                {t('previewDesc', { count: resultData.totalUsers })}
            </Text>

            {resultData.groups.slice(0, 3).map((group, index) => {
                const members = [group.user1, group.user2, group.user3].filter(Boolean);

                return (
                    <Card key={index} className={styles.groupCard}>
                        <CardHeader
                            header={<Text weight="semibold">{t('convoPrefix')} {group.nom}</Text>}
                        />
                        <div className={styles.membersContainer}>
                            {members.map((user, i) => (
                                <div key={i} className={styles.memberItem}>
                                    <Avatar name={user.displayName} color="colorful" />
                                    <Text>{user.displayName}</Text>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ffffff', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, display: 'flex', gap: '1rem' }}>
                            <Avatar name="Café Bonjour" color="brand" />
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '8px' }}>
                                    <Text weight="bold">Café Bonjour</Text>
                                    <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{t('today')}, 09:00</Text>
                                </div>
                                <Text style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                    {getGroupMessage(members)}
                                </Text>
                            </div>
                        </div>
                    </Card>
                );
            })}

            {resultData.totalGroups > 3 && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Text italic color="neutralForeground3">
                        {t('andOthers', { count: resultData.totalGroups - 3 })}
                    </Text>
                </div>
            )}

            {resultData.isFakePreview && (
                <Card style={{ backgroundColor: '#fff4ce', borderColor: '#f2c811', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Text weight="semibold">{t('fakeModeTitle')}</Text>
                        <Text size={200}>
                            {t('fakeModeDesc')}
                        </Text>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GroupResults;
