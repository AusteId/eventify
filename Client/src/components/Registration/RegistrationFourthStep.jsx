import { useCallback, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import Button from '../Button';
import Frame from '../../assets/Frame.svg';

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const RegistrationFourthStep = forwardRef((props, ref) => {
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const { register, setValue, handleSubmit, formState: { errors } } = useFormContext();
  const { prevStep, finalSubmit, isSubmitting } = useOutletContext();

  RegistrationFourthStep.displayName = "RegistrationFirstStep";
  
  const validateFile = (file) => {
    if (!file) return null; 
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return "Invalid file type. Please upload JPG or PNG";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 5MB";
    }
    return null;
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setValue("profilePicture", file);
    setFilePreview(URL.createObjectURL(file));
  }, [setValue]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"]
    },
    maxSize: MAX_FILE_SIZE
  });

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      return true;
    }
  }));



  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-header-dark text-heading-l font-[700]">
        Complete Your Profile
      </h2>
      <p className="text-light text-body-m font-[400] pb-[1rem]">
        Add a profile picture to help others recognize you
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div>
        <section className="bg-white w-[40rem] flex justify-center items-center rounded-2xl p-[2rem]">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-btn p-6 flex flex-col items-center justify-center cursor-pointer rounded-2xl w-[95%]"
          >
            <input {...getInputProps()} />
            {filePreview ? (
              <img
                src={filePreview}
                alt="Uploaded Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <>
                <img src={Frame} alt="frame.logo" className="bg-white w-[4rem] h-[3rem]" />
                <p className="text-heading-xs text-header-dark font-[600] pt-[0.5rem] pb-[1rem]">
                  Drag and drop your photo here
                </p>
                <p className="text-body-s text-body-medium font-[400] pb-[1rem]">
                  or click to browse from your computer
                </p>
                <small className="text-body-s text-body-medium font-[400] pb-[2rem]">
                  Supported formats: JPG, PNG (Max size: 5MB)
                </small>
                <Button className="mt-4">
                  <label htmlFor="fileInput" className="cursor-pointer">
                    Choose a file
                  </label>
                </Button>
              </>
            )}
          </div>
        </section>
        
        <div className="flex justify-between mt-8 gap-10">
           <Button
            background="bg-white"
            textColor="text-btn"
            border="border border-btn"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button 
            onClick={handleSubmit(finalSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default RegistrationFourthStep;