// src/components/DaySelector.jsx
import React from 'react';
import { Label, Dropdown, Option } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';

export default function DaySelector({ selectedDay, setSelectedDay }) {
  const { t } = useTranslation();

  const daysOfWeek = [
    { key: 'monday', label: t('monday') },
    { key: 'tuesday', label: t('tuesday') },
    { key: 'wednesday', label: t('wednesday') },
    { key: 'thursday', label: t('thursday') },
    { key: 'friday', label: t('friday') },
  ];

  return (
    <div>
      <Label htmlFor="day-select">{t('dayLabel')}</Label>
      <div>
        <Dropdown
          id="day-select"
          value={daysOfWeek.find(d => d.key === selectedDay)?.label ?? ''}
          placeholder="Choisissez un jour"
          onOptionSelect={(_, data) => {
            setSelectedDay(data.optionValue);
          }}
        >
          {daysOfWeek.map(day => (
            <Option key={day.key} value={day.key}>
              {day.label}
            </Option>
          ))}
        </Dropdown>
      </div>
    </div>
  );
}
