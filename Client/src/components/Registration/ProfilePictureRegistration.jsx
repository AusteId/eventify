import Button from '../Button';
import { useCallback, useState } from 'react';
import Frame from '../../assets/Frame.svg';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

const ProfilePictureRegistration = () => {
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const {handleSubmit, formState: { errors } } = useForm();

  const isValidMimeType = (file) => {
    if (!file || !file.type) return false; // Ensure file and file type exist
    const validMimeTypes = ['image/jpeg', 'image/png'];
    return validMimeTypes.includes(file.type);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert('No file selected.');
      return;
    }

    if (!isValidMimeType(file)) {
      alert('Invalid file type. Please upload a JPG or PNG.');
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };


  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    if (!uploadedFile) {
      alert('Invalid file selection.');
      return;
    }

    if (!isValidMimeType(uploadedFile)) {
      alert('Invalid file type. Please upload a JPG or PNG.');
      return;
    }

    setSelectedFile(uploadedFile);
    setFilePreview(URL.createObjectURL(uploadedFile));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {'':['.jpeg', '.png']
      },
    useFsAccessApi:false,
  });

  const onSubmit = (data) => {
    if (!selectedFile) {
      alert('Please upload a profile picture.');
      return;
    }

    console.log('Form Data:', data);
    console.log('Uploaded File:', selectedFile);
  };


  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-header-dark text-heading-l font-[700]">
        Complete Your Profile
      </h2>

      <p className="text-light text-body-m font-[400] pb-[1rem]">
        Add a profile picture to help others recognize you
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
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
                <div className="text-3xl">
                  <img src={Frame} alt="frame.logo" className="bg-white w-[4rem] h-[3rem]" />
                </div>

                <p className="text-heading-xs text-header-dark font-[600] pt-[0.5rem] pb-[1rem] leading-[1rem]">
                  Drag and drop your photo here
                </p>

                <p className="text-body-s text-body-medium font-[400] leading-[0.875rem] pb-[1rem]">
                  or click to browse from your computer
                </p>

                <small className="text-body-s text-body-medium font-[400] leading-[0.875rem] pb-[2rem]">
                  Supported formats: JPG, PNG (Max size: 5MB)
                </small>

                <Button>
                  <label htmlFor="fileInput">Choose a file</label>
                </Button>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/jpeg, image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </section>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfilePictureRegistration;