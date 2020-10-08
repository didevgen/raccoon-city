import React from 'react';
import {Select, MenuItem} from '@material-ui/core';

interface SectionSelectorProps {
    currentSection: string;
    setCurrentSection: any;
    sections: any;
}

export const SectionSelector = ({currentSection, setCurrentSection, sections}: SectionSelectorProps) => (
    <div style={{marginLeft: 'auto'}}>
        <Select value={currentSection} style={{marginRight: '20px'}}>
            {Object.values(sections).map((item: any) => {
                return (
                    <MenuItem key={item.id} value={item.id} onClick={() => setCurrentSection(item.id)}>
                        {`Подъезд ${item.section}`}
                    </MenuItem>
                );
            })}
        </Select>
    </div>
);
