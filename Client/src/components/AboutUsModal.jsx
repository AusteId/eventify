import React, { useState, useEffect } from 'react';

const AboutUsModal = ({ isOpen, closeModal, member, onSave }) => {
  const [updatedMember, setUpdatedMember] = useState({
    name: '',
    linkedin: '',
    github: '',
    phoneNumber: '',
    email: '',
    imageUrl: '',
  });

  // Initialize the form with member data if editing
  useEffect(() => {
    if (member && member.id) {
      setUpdatedMember({
        id: member.id,
        name: member.name || '',
        linkedin: member.linkedin || '',
        github: member.github || '',
        phoneNumber: member.phoneNumber || '',
        email: member.email || '',
        imageUrl: member.imageUrl || '',
      });
    } else {
      // For a new member, reset the form with empty values
      setUpdatedMember({
        name: '',
        linkedin: '',
        github: '',
        phoneNumber: '',
        email: '',
        imageUrl: '',
      });
    }
  }, [member]);

  const handleClose = () => {
    closeModal();
    setUpdatedMember({
      name: '',
      linkedin: '',
      github: '',
      phoneNumber: '',
      email: '',
      imageUrl: '',
    });
  };

  const handleSave = () => {
    // Save the member data (either create new or update existing member)
    onSave(updatedMember);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {member && member.id ? 'Edit Member' : 'Add New Member'}
          </h2>
          <button onClick={handleClose} type="button" className="w-10 h-10">
            <img
              className="w-full h-full p-2"
              src="src/assets/close.svg"
              alt="Close"
            />
          </button>
        </div>

        <div className="flex gap-6 mt-6">
          <div className="w-full">
            <label className="block font-inter text-header-dark text-body-m font-bold mb-2" htmlFor="member-name">
              Name
            </label>
            <input
              id="member-name"
              type="text"
              value={updatedMember.name}
              onChange={(e) => setUpdatedMember({ ...updatedMember, name: e.target.value })}
              className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          <div className="w-full">
            <label className="block font-inter text-header-dark text-body-m font-bold mb-2" htmlFor="linkedin">
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="text"
              value={updatedMember.linkedin}
              onChange={(e) => setUpdatedMember({ ...updatedMember, linkedin: e.target.value })}
              className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label className="block font-inter text-header-dark text-body-m font-bold mb-2" htmlFor="github">
              GitHub
            </label>
            <input
              id="github"
              type="text"
              value={updatedMember.github}
              onChange={(e) => setUpdatedMember({ ...updatedMember, github: e.target.value })}
              className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-6 mt-4">

          <div className="w-full">
            <label className="block font-inter text-header-dark text-body-m font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={updatedMember.email}
              onChange={(e) => setUpdatedMember({ ...updatedMember, email: e.target.value })}
              className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-inter text-header-dark text-body-m font-bold mb-2" htmlFor="image-url">
            Photo URL
          </label>
          <input
            id="image-url"
            type="text"
            value={updatedMember.imageUrl}
            onChange={(e) => setUpdatedMember({ ...updatedMember, imageUrl: e.target.value })}
            className="h-10 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
            placeholder="Enter image URL"
          />
        </div>

        <div className="flex mt-6 gap-6 justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="btn bg-white border border-input-light shadow-none hover:bg-input-light px-6 pt-3 pb-3 rounded-lg"
          >
            <p className="text-body-medium">Cancel</p>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-6 pt-3 pb-3 rounded-lg text-white"
          >
            {member && member.id ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;
