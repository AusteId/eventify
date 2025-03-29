import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../Button';
import Frame from '../../assets/Frame.svg';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * ImageDropzone - A reusable component for image uploading with preview
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
      // Create accept object for react-dropzone
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

  // Update preview if initialPreview changes
  useEffect(() => {
    setFilePreview(initialPreview);
  }, [initialPreview]);

  const containerClass =
    customClasses.container ||
    'bg-white w-full flex justify-center items-center rounded-2xl p-8';
  const dropzoneClass =
    customClasses.dropzone ||
    'border-2 border-dashed border-btn p-6 flex flex-col items-center justify-center cursor-pointer rounded-2xl w-[95%]';
  const previewClass =
    customClasses.preview || 'w-24 h-24 rounded-full object-cover';
  const errorClass = customClasses.error || 'text-red-500 mb-4';

  return (
    <div className="flex flex-col items-center">
      {error && <p className={errorClass}>{error}</p>}

      <section className={containerClass}>
        <div {...getRootProps()} className={dropzoneClass}>
          <input {...getInputProps()} />
          {filePreview ? (
            <img
              src={filePreview}
              alt="Uploaded Preview"
              className={previewClass}
            />
          ) : (
            <>
              <img
                src={Frame}
                alt="frame.logo"
                className="bg-white w-16 h-12"
              />
              <p className="text-heading-xs text-header-dark font-semibold pt-2 pb-4">
                Drag and drop your photo here
              </p>
              <p className="text-body-s text-body-medium font-normal pb-4">
                or click to browse from your computer
              </p>
              <small className="text-body-s text-body-medium font-normal pb-8">
                Supported formats:{' '}
                {acceptedTypes
                  .map(type => type.split('/')[1].toUpperCase())
                  .join(', ')}
                (Max size: {maxSize / (1024 * 1024)}MB)
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
    </div>
  );
};

export default ImageDropzone;
