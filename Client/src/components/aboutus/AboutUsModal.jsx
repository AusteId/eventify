import { useState, useEffect } from 'react';
import ImageDropZoneSmall from './ImageDropZoneSmall.jsx';
import CloseSVG from '../../assets/CloseSVG.jsx';
import Button from '../Button.jsx';

const AboutUsModal = ({ isOpen, closeModal, member, onSave, isDarkMode }) => {
  const [updatedMember, setUpdatedMember] = useState({
    name: '',
    linkedin: '',
    github: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (member && member.id) {
      setUpdatedMember({
        id: member.id,
        name: member.name || '',
        linkedin: member.linkedin || '',
        github: member.github || '',
        phoneNumber: member.phoneNumber || '',
        email: member.email || '',
      });

      setPreviewUrl(member.imageUrl || '');
    } else {
      setUpdatedMember({
        name: '',
        linkedin: '',
        github: '',
        phoneNumber: '',
        email: '',
      });
      setPreviewUrl('');
    }
    setImageFile(null);
  }, [member]);

  const handleClose = () => {
    closeModal();
    setUpdatedMember({
      name: '',
      linkedin: '',
      github: '',
      phoneNumber: '',
      email: '',
    });
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleSave = () => {
    onSave(updatedMember, imageFile);
    handleClose();
  };

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  if (!isOpen) return null;

  return (
    <div onClick={handleClose} className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
      <div onClick={(event) => {event.stopPropagation()}} className={`p-6 rounded-lg shadow-lg w-96 duration-750 border ${isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'}`}>
        <div className={`flex justify-between items-center mb-4`}>
          <h2 className={`text-xl font-bold duration-750 ${isDarkMode ? 'text-[#f59e0b]' : 'text-header-dark'}`}>
            {member && member.id ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button onClick={handleClose} type="button" className="w-10 h-10">
            <CloseSVG/>
          </button>
        </div>

        <div className="flex gap-6 mt-6">
          <div className="w-full">
            <label className={`block font-inter text-body-m font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`} htmlFor="member-name">
              Name
            </label>
            <input
              id="member-name"
              type="text"
              placeholder="John Doe"
              value={updatedMember.name}
              onChange={(e) => setUpdatedMember({ ...updatedMember, name: e.target.value })}
              className={`appearance-none border border-input-light rounded-lg w-full py-2 px-3 leading-tight 
                ${isDarkMode
                ? 'focus:border-[#f59e0b] text-gray-200 focus:outline-none focus:ring focus:ring-[#f59e0b] focus:ring-opacity-50 placeholder:text-gray-400'
                : 'focus:outline-none '
              }`}
            />
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          <div className="w-full">
            <label className={`block font-inter text-body-m font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`} htmlFor="linkedin">
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="text"
              placeholder="LinkedIn Link"
              value={updatedMember.linkedin}
              onChange={(e) => setUpdatedMember({ ...updatedMember, linkedin: e.target.value })}
              className={`appearance-none border border-input-light rounded-lg w-full py-2 px-3 leading-tight 
                ${isDarkMode
                ? 'focus:border-[#f59e0b] text-gray-200 focus:outline-none focus:ring focus:ring-[#f59e0b] focus:ring-opacity-50 placeholder:text-gray-400'
                : 'focus:outline-none '
              }`}
            />
          </div>

          <div className="w-full">
            <label className={`block font-inter text-body-m font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`} htmlFor="github">
              GitHub
            </label>
            <input
              id="github"
              type="text"
              placeholder="Github Link"
              value={updatedMember.github}
              onChange={(e) => setUpdatedMember({ ...updatedMember, github: e.target.value })}
              className={`appearance-none border border-input-light rounded-lg w-full py-2 px-3 leading-tight 
                ${isDarkMode
                ? 'focus:border-[#f59e0b] text-gray-200 focus:outline-none focus:ring focus:ring-[#f59e0b] focus:ring-opacity-50 placeholder:text-gray-400'
                : 'focus:outline-none '
              }`}
            />
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          <div className="w-full">
            <label className={`block font-inter text-body-m font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="off"
              placeholder="John@email.com"
              value={updatedMember.email}
              onChange={(e) => setUpdatedMember({ ...updatedMember, email: e.target.value })}
              className={`appearance-none border border-input-light rounded-lg w-full py-2 px-3 leading-tight 
                ${isDarkMode
                ? 'focus:border-[#f59e0b] text-gray-200 focus:outline-none focus:ring focus:ring-[#f59e0b] focus:ring-opacity-50 placeholder:text-gray-400'
                : 'focus:outline-none '
              }`}
            />
          </div>
        </div>

        {/* Image Dropzone Component */}
        <ImageDropZoneSmall
          onChange={handleImageChange}
          previewUrl={previewUrl}
          isDarkMode={isDarkMode}
        />

        <div className="flex mt-6 gap-6 justify-between">
          <Button
            type="button"
            onClick={handleClose}
            hoverColor={"hover:bg-slate-600 duration-750 "}
            textColor={"text-white"}
            size={"large"}
            background={`bg-slate-900`}
            border={`border ${isDarkMode ? "border-[#f59e0b]" : "border-transparent"}`}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="button"
            onClick={handleSave}
            className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-6 pt-3 pb-3 rounded-lg text-white"
          >
            {member && member.id ? 'Save Changes' : 'Add Member'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;