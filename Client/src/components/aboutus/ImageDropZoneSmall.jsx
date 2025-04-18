import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const ImageDropZoneSmall = ({ onChange, previewUrl, isDarkMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(previewUrl);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (jpg, png, etc)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  return (
    <div className="mt-4">
      <label className={`block font-inter text-body-m font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`}>
        Profile Photo
      </label>

      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400'}
          ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg mb-2"
            />
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Click or drag to change image
            </p>
          </div>
        ) : (
          <div className="py-4">
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Drop an image here, or click to select
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageDropZoneSmall;