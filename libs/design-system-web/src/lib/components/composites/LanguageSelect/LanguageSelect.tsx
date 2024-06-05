import { Box } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { Typography } from '../../primatives/Typography/Typography';
import { Modal } from '../Modal/Modal';

export type Language = {
  label: string;
  value: string;
  emoji?: string;
  name: string;
};

export interface LanguageSelectProps {
  languages: Language[];
  language?: string;
  title: string;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelect = ({
  languages,
  language,
  title,
  onLanguageChange,
}: LanguageSelectProps) => {
  const [show, setShow] = useState(false);
  const selectedLanguage = useMemo(
    () => languages.find((lang: Language) => lang.value === language),
    [language, languages]
  );

  const onLanguageSelect = (language: Language) => {
    setShow(false);
    onLanguageChange(language);
  };

  return (
    <>
      <Modal title={title} open={show} onClose={() => setShow(false)}>
        <>
          {languages.map((language: Language) => (
            <Box key={language.label}>
              <IconButton onClick={() => onLanguageSelect(language)}>
                <Typography fontSize="lg">{language.label}</Typography>
              </IconButton>
            </Box>
          ))}
        </>
      </Modal>
      <IconButton onClick={() => setShow(true)}>
        <Typography fontSize="1.2rem">{selectedLanguage?.emoji}</Typography>
      </IconButton>
    </>
  );
};
