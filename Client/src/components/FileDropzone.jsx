import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from './Button';

const FileDropzone = props => {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input id={props.id} {...getInputProps()} />
      {isDragActive ? (
        <div></div>
      ) : (
        <div className=" border-2 border-dotted border-input-muted rounded-lg">
          <div className="flex flex-col w-full h-full gap-3 items-center pt-5 pb-5">
            <img src="src/assets/frame.svg" alt="" />
            <p className="font-inter text-body-medium">
              Drag and drop an image here or
            </p>
            <Button>Browse Files</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
