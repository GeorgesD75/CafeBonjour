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

const GroupResults = ({ resultData, messageTemplate, channelName, isInTeams, time = '09:00' }) => {
    const styles = useStyles();
    const titleRef = useRef(null);
    const { t } = useTranslation();

    const getGroupMessage = (members) => {
        if (!messageTemplate) return t('loadingMsg');
        const groupNames = members.map(m => m.displayName).join(', ');
        return messageTemplate
            .replaceAll('{groupe}', groupNames)
            .replaceAll('{conversation}', channelName || t('convoTitlePlaceholder'));
    };

    useEffect(() => {
        if (resultData && resultData.groups && titleRef.current) {
            titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    <Card key={index} className={styles.groupCard} style={{ backgroundColor: isInTeams ? tokens.colorNeutralBackground1 : 'rgba(255, 255, 255, 0.85)', backdropFilter: isInTeams ? 'none' : 'blur(20px)', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' }}>
                        <CardHeader
                            header={<Text weight="semibold">{t('convoPrefix')} {group.nom}</Text>}
                        />
                        <div className={styles.membersContainer}>
                            {members.map((user, i) => (
                                <div key={i} className={styles.memberItem}>
                                    <Avatar name={user.displayName} color="colorful" image={user.profilePhoto ? { src: user.profilePhoto } : undefined} />
                                    <Text>{user.displayName}</Text>
                                </div>
                            ))}
                        </div>

                        {/* Simulation Vue Chat Teams */}
                        <div style={{ marginTop: '1.5rem', padding: '1rem', border: `1px dashed ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: isInTeams ? 'transparent' : 'rgba(255,255,255,0.4)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <Avatar name="Café Bonjour" color="brand" size={36} />
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                                    <Text weight="semibold">Café Bonjour</Text>
                                    <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>{t('today')} {time}</Text>
                                </div>
                                <div style={{
                                    backgroundColor: isInTeams ? tokens.colorNeutralBackground2 : '#ffffff',
                                    padding: '12px 16px',
                                    borderRadius: '0 8px 8px 8px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    display: 'inline-block'
                                }}>
                                    <Text style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', margin: 0 }}>
                                        {getGroupMessage(members)}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}

            {resultData.totalGroups > 3 && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Text italic style={{ color: tokens.colorNeutralForeground2, fontWeight: '600', textShadow: '0 1px 4px rgba(255,255,255,0.9), 0 -1px 4px rgba(255,255,255,0.9)' }}>
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
