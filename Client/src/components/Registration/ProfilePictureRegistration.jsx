// import { useCallback, useState } from 'react';
// import Button from '../Button';
// import Frame from '../../assets/Frame.svg';
// import { useForm } from 'react-hook-form';
// import { useDropzone } from 'react-dropzone';
// const ProfilePictureRegistration = () => {
// const [selectedFile, setSelectedFile] = useState(null);
// const handleFileChange = event => {
//   const file = event.target.files[0];
//   if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
//     setSelectedFile(file);
//   } else {
//     alert('Please upload a JPG or PNG file.');
//   }
// };
// const handleDragOver = event => {
//   event.preventDefault();
// };
// const handleDrop = event => {
//   event.preventDefault();
//   const file = event.dataTransfer.files[0];
//   if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
//     setSelectedFile(file);
//   } else {
//     alert('Please upload a JPG or PNG file.');
//   }
// };

//   const { register, handleSubmit, formState: { errors } } = useForm();

// const onSubmit = (data) => {
//   console.log(data); // For now, just log the form data
// };
// const onDrop = useCallback((acceptedFiles) => {
//   acceptedFiles.forEach((file) => {
//     const reader = new FileReader()

//     reader.onabort = () => console.log('file reading was aborted')
//     reader.onerror = () => console.log('file reading has failed')
//     reader.onload = () => {
//     // Do whatever you want with the file contents
//       const binaryStr = reader.result
//       console.log(binaryStr)
//     }
//     reader.readAsArrayBuffer(file)
//   })

// }, [])
// const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

// return (
//   <section>
{
  /* <section className="flex flex-col items-center pt-[8rem]">
        <h2 className="text-header-dark text-heading-l font-[700]">
          Complete Your Profile
        </h2>
        <p className="text-light text-body-m font-[400] pb-[1rem]">
          Add a profile picture to help others recognize you
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="bg-white w-[40rem] flex justify-center items-center rounded-2xl p-[2rem]">
            <section
              className="border-2 border-dashed border-btn p-6 flex flex-col items-center justify-center cursor-pointer rounded-2xl w-[95%]"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <img src={Frame} alt="frame.logo" className="bg-white" />
              <p className="text-heading-xs text-header-dark font-[600] pt-[0.5rem] pb-[1rem] leading-[1rem]">
                Drag and drop your photo here
              </p>
              <p className="text-body-s text-body-medium font-[400] leading-[0.875rem] pb-[1rem]">
                or click to browse from your computer
              </p>
              <p className="text-body-s text-body-medium font-[400] leading-[0.875rem] pb-[2rem]">
                Supported formats: JPG, PNG (Max size: 5MB)
              </p>
              {selectedFile && (
                <p className="text-center text-body-s text-body-medium p-[2rem]">
                  Selected: {selectedFile.name}
                </p>
              )}
              <Button>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  {...register('file')}
                />
                <label htmlFor="fileInput" id="customLabel">
                  {selectedFile ? selectedFile.name : 'Choose a file'}
                </label>
              </Button>
            </section>
          </section>
            <button type="submit">
        Submit
      </button>
        </form>
      </section>
      <section className=" flex justify-between px-[9.9rem] pt-4">
        <section className="">
          <Button
            background="bg-white"
            textColor="text-btn"
            border="border border-btn"
          >
            Back
          </Button>
        </section>
        <section>
          <Button>Complete Setup</Button>
        </section>
      </section> */
}
{
  /* <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
    </section>
  );
};

export default ProfilePictureRegistration; */
}

import { useCallback, useState } from 'react';
import Frame from '../../assets/Frame.svg'
import { useDropzone } from 'react-dropzone';

const ProfileUpload = () => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const uploadedFile = acceptedFiles[0];

    setFile(URL.createObjectURL(uploadedFile));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

    accept: 'image/jpeg, image/png',

    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="flex flex-col items-center p-6 ">
      <h2 className="text-xl font-semibold text-gray-700">
        Complete Your Profile
      </h2>

      <p className="text-gray-500 text-sm mb-4">
        Add a profile picture to help others recognize you
      </p>

      <div
        {...getRootProps()}
        className="w-full border-2 border-dashed border-yellow-500 bg-white rounded-lg p-6 flex flex-col items-center cursor-pointer"
      >
        <input {...getInputProps()} />

        {file ? (
          <img
            src={file}
            alt="Uploaded Preview"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <>
            <div className="text-3xl">
              <img src={Frame} alt="frame.logo" className="bg-white" />
              </div>

            <p className="text-gray-600 text-sm mt-2">
              Drag and drop your photo here
            </p>

            <p className="text-gray-400 text-xs">
              or click to browse from your computer
            </p>

            <small className="text-gray-500 text-xs">
              Supported formats: JPG, PNG (Max size: 5MB)
            </small>
          </>
        )}
      </div>

      <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-lg transition">
        Complete Setup
      </button>
    </div>
  );
};

export default ProfileUpload;
