import { useMediaQuery } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Box } from '../../primatives/Box/Box';
import { Button } from '../../primatives/Button/Button';
import { Flex } from '../../primatives/Flex/Flex';
import { Typography } from '../../primatives/Typography/Typography';
import { WBLink } from '../..';
import { Icon } from '../../primatives/Icon/Icon';
import { LinkProps } from '../../primatives/Link/Link';
// import UploadIcon from '../../../../assets/images/upload.svg';

interface DragDropUploadProps {
  validFileTypes: string[];
  inputAccept: string;
  maxFiles?: number;
  inputName?: string;
  onFileDrop: (files: FileList) => void;
  uploadMessage: string | React.ReactNode;
  btnText: string;
  btnTextProps?: LinkProps;
}

export const DragDropFiles = ({
  validFileTypes = [],
  inputAccept,
  maxFiles = 1,
  inputName,
  onFileDrop,
  uploadMessage,
  btnText, //Drag and drop files to upload
  btnTextProps,
}: DragDropUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [error, setError] = useState('');
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const dragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // const files = e.dataTransfer.files;
    setIsDraggedOver(true);
  };

  const dragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const dragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
    setError('');

    const files = e.dataTransfer.files;
    if (files && files.length > maxFiles) {
      setError(`Only ${maxFiles} files can be uploaded`);
    } else if (files && files.length >= 1) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onSelect = () => {
    if (!inputRef.current?.files) {
      setError('Invalid upload');
      return;
    } else {
      if (inputRef.current?.files.length > maxFiles) {
        setError(`Only ${maxFiles} file can be uploaded`);
      } else if (inputRef.current?.files.length === 1) {
        handleFiles(inputRef.current.files);
      }
    }
  };

  const handleFiles = (files: FileList) => {
    let isError = false;
    for (let i = 0; i < files.length; i++) {
      const invalidFileType = validFileTypes.indexOf(files[i].type) === -1;
      if (invalidFileType) {
        setError(`Invalid file type ${files[i].type}`);
        isError = true;
        break;
      }
    }

    if (!isError) {
      setError('');
      onFileDrop(files);
    }
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
      sx={{
        borderRadius: '10px',
        backgroundColor: isDraggedOver
          ? 'transparent'
          : darkMode
          ? 'rgba(0, 0, 0, 0.1)'
          : '#e9ebff', // Change background color
        //TODO: colour based on primary colour
        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='${
          isDraggedOver ? '%2300CB87' : '%238F8F8F'
        }' stroke-width='5' stroke-dasharray='1%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");`,
      }}
      onDragOver={dragOver}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={onDrop}
      p={4}
    >
      {/* <WBSvgIcon fontSize="small">
        <UploadIcon />
      </WBSvgIcon> */}
      <Icon name="CloudUpload"></Icon>
      {typeof uploadMessage === 'string' ? (
        <Typography textAlign="center">{uploadMessage}</Typography>
      ) : (
        uploadMessage
      )}
      <Box sx={{ textDecoration: 'underline' }}>
        <Button
          //@ts-ignore - TODO: fix type errors, WB link throwing safari lint issue
          type="button"
          //@ts-ignore
          variant="text"
          mt={4}
          //@ts-ignore
          onClick={() => inputRef.current?.click()}
          {...btnTextProps}
        >
          {btnText}
        </Button>
      </Box>
      {/*<WBLink*/}
      {/*  type="button"*/}
      {/*  underline="always"*/}
      {/*  mt={4}*/}
      {/*  onClick={() => inputRef.current?.click()}*/}
      {/*  {...btnTextProps}*/}
      {/*>*/}
      {/*  {btnText}*/}
      {/*</WBLink>*/}

      {error && <Typography color="error">{error}</Typography>}

      <Box display="none">
        <input
          ref={inputRef}
          type="file"
          accept={inputAccept}
          name={inputName}
          multiple={maxFiles > 1}
          onChange={onSelect}
        />
      </Box>
    </Flex>
  );
};
