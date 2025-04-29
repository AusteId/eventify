import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../Button';
import Frame from '../../assets/Frame.svg';
import { useDarkMode } from '../context/DarkModeContext.jsx';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * ImageDropZoneSmall - A reusable component for image uploading with preview
 *
 * @param {Object} props
 * @param {Function} props.onFileChange - Callback when file changes (receives the selected file)
 * @param {string[]} props.acceptedTypes - Array of accepted MIME types (defaults to ["image/jpeg", "image/png"])
 * @param {number} props.maxSize - Maximum file size in bytes (defaults to 5MB)
 * @param {string} props.initialPreview - Initial preview URL (optional)
 * @param {string} props.fieldName - Name of the field in the form (optional)
 * @param {Object} props.customClasses - Custom classes for styling
 */
const ImageDropzone = ({
  onFileChange,
  acceptedTypes = ['image/jpeg', 'image/png'],
  maxSize = MAX_FILE_SIZE,
  initialPreview = null,
  fieldName = 'image',
  customClasses = {},
}) => {
  const [filePreview, setFilePreview] = useState(initialPreview);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    setFilePreview(initialPreview);
  }, [initialPreview]);

  const validateFile = file => {
    if (!file) return null;
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Please upload ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(' or ')}`;
    }
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`;
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
      onFileChange(file, fieldName);
      setFilePreview(URL.createObjectURL(file));
    },
    [onFileChange, fieldName, acceptedTypes, maxSize],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      if (type === 'image/jpeg') {
        acc[type] = ['.jpeg', '.jpg'];
      } else if (type === 'image/png') {
        acc[type] = ['.png'];
      }
      return acc;
    }, {}),
    maxSize: maxSize,
  });

  useEffect(() => {
    return () => {
      if (filePreview && filePreview !== initialPreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview, initialPreview]);

  const removeFile = e => {
    e.stopPropagation();
    setFilePreview(null);
    setError(null);
    onFileChange(null, fieldName);
  };

  return (
    <div className="flex flex-col items-center">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <section
        className={`w-full flex justify-center items-center rounded-2xl p-8 duration-750 ${isDarkMode ? 'bg-slate-600' : 'bg-white'
          } ${customClasses.container || ''}`}
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer rounded-2xl w-[95%] duration-750 ${isDarkMode ? 'border-[#f59e0b]' : 'border-btn'
            } ${customClasses.dropzone || ''}`}
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
                className={`w-16 h-12 ${isDarkMode ? 'none' : 'none'}`}
              />
              <p
                className={`text-heading-xs font-semibold pt-2 pb-4 duration-750 ${isDarkMode ? 'text-gray-200' : 'text-header-dark'
                  }`}
              >
                Drag and drop your photo here
              </p>
              <p
                className={`text-body-s font-normal pb-4 duration-750 ${isDarkMode ? 'text-gray-300' : 'text-body-medium'
                  }`}
              >
                or click to browse from your computer
              </p>
              <small
                className={`text-body-s font-normal pb-8 duration-750 ${isDarkMode ? 'text-gray-400' : 'text-body-medium'
                  }`}
              >
                Supported formats:{' '}
                {acceptedTypes
                  .map(type => type.split('/')[1].toUpperCase())
                  .join(', ')}
                (Max size: {maxSize / (1024 * 1024)}MB)
              </small>
              <Button
                background={
                  isDarkMode
                    ? 'bg-[#f59e0b] hover:bg-amber-500'
                    : 'bg-[#f59e0b]'
                }
                textColor={isDarkMode ? 'text-gray-200' : ''}
              >
                <label htmlFor="fileInput" className="cursor-pointer">
                  Choose a file
                </label>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ImageDropzone;
