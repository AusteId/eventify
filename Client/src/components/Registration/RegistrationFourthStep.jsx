import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router';
import Frame from '../../assets/Frame.svg';
import Button from '../Button';
import RegistrationSteps from '../RegistrationSteps';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const RegistrationFourthStep = forwardRef((props, ref) => {
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState(null);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const { prevStep, finalSubmit, isSubmitting } = useOutletContext();

  const { isDarkMode } = useDarkMode();

  RegistrationFourthStep.displayName = 'RegistrationFirstStep';

  const validateFile = file => {
    if (!file) return null;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return 'Invalid file type. Please upload JPG or PNG';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 5MB';
    }
    return null;
  };

  const onDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setValue('profilePicture', file);
      setFilePreview(URL.createObjectURL(file));
    },
    [setValue],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_FILE_SIZE,
  });

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      return true;
    },
  }));

  const removeFile = e => {
    e.stopPropagation();
    setFilePreview(null);
    setValue('profilePicture', null);
    setError(null);
  };

  return (
    <div>
      <RegistrationSteps step={4} />
      <div
        className={`flex flex-col items-center rounded-2xl border p-10 mt-10 duration-750 ${isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'}`}
      >
        <h2
          className={`text-heading-l font-[700] ${isDarkMode ? 'text-[#f59e0b]' : 'text-header-dark'}`}
        >
          Complete Your Profile
        </h2>
        <p
          className={` text-body-m font-[400] pb-4 ${isDarkMode ? 'text-gray-200' : 'text-light'}`}
        >
          Add a profile picture to help others recognize you
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div>
          <section
            className={`w-[40rem] flex justify-center items-center rounded-2xl duration-750 p-8 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
          >
            <div
              {...getRootProps()}
              className={`border-2 duration-750 border-dashed border-btn p-6 flex flex-col items-center justify-center cursor-pointer rounded-2xl w-[95%] ${isDarkMode ? 'bg-slate-600' : 'bg-white'}`}
            >
              <input {...getInputProps()} />
              {filePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={filePreview}
                    alt="Uploaded Preview"
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        const fileInput =
                          document.querySelector('input[type="file"]');
                        if (fileInput) fileInput.click();
                      }}
                      className="text-sm"
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      background={`duration-750 ${isDarkMode ? 'bg-slate-900 text-gray-200 hover:bg-slate-800 hover:text-[#f59e0b]' : 'bg-white '}`}
                      border="border border-[#f59e0b]"
                      textColor={`${isDarkMode ? '' : 'text-red-500'}`}
                      onClick={e => removeFile(e)}
                      className="text-sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={Frame}
                    alt="frame.logo"
                    className=" w-[4rem] h-[3rem]"
                  />
                  <p
                    className={`text-heading-xs font-semibold pt-2 pb-4 duration-750 ${
                      isDarkMode ? 'text-gray-200' : 'text-header-dark'
                    }`}
                  >
                    Drag and drop your photo here
                  </p>
                  <p
                    className={`text-body-s font-normal pb-4 duration-750 ${
                      isDarkMode ? 'text-gray-300' : 'text-body-medium'
                    }`}
                  >
                    or click to browse from your computer
                  </p>
                  <small
                    className={`text-body-s font-normal pb-8 duration-750 ${
                      isDarkMode ? 'text-gray-400' : 'text-body-medium'
                    }`}
                  >
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
              type="button"
              size="large"
              background={`duration-750 ${isDarkMode ? 'bg-slate-600 text-gray-200 hover:bg-slate-700 hover:text-[#f59e0b]' : 'bg-white '}`}
              border="border border-btn"
              textColor={`${isDarkMode ? '' : 'text-[#f59e0b]'}`}
              onClick={prevStep}
            >
              Back
            </Button>
            <Button
              size="large"
              onClick={handleSubmit(finalSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Registration'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default RegistrationFourthStep;
