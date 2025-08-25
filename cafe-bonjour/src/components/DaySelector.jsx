// src/components/DaySelector.jsx
import React from 'react';
import { Label, Dropdown, Option } from '@fluentui/react-components';

const daysOfWeek = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
];

export default function DaySelector({ selectedDay, setSelectedDay }) {
  return (
    <div>
      <Label htmlFor="day-select">Jour de la semaine</Label>
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
