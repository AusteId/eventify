import React, { useEffect, useState } from 'react';
import AboutUsCard from '../components/AboutUsCard';
import Modal from '../components/AboutUsModal.jsx';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMember, setEditingMember] = useState(null); // To keep track of the member being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // To track if the modal is open for adding a new member

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/about', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch team members');

        const data = await response.json();
        setTeamMembers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Error fetching team members');
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Handle Edit: Open the modal with member details
  const handleEdit = (member) => {
    if (member.id) {
      setEditingMember(member);
      setIsModalOpen(true);
    } else {
      console.error("Member ID is undefined:", member);
    }
  };

  // Handle Add: Open the modal to add a new team member
  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  // Handle updating the member details
  const handleUpdate = async (updatedMember) => {
    try {
      if (!updatedMember.id) throw new Error('Member ID is missing');

      const response = await fetch(`http://localhost:8080/api/about/${updatedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to update team member');

      const updatedData = await response.json();
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === updatedData.id ? updatedData : member
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message || 'Error updating member');
    }
  };


  // Handle Add (Create) new team member
  const handleAddMember = async (newMember) => {
    try {
      const response = await fetch('http://localhost:8080/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to add new team member');

      const addedMember = await response.json();
      setTeamMembers((prevMembers) => [...prevMembers, addedMember]);
      setIsModalOpen(false); // Close the modal after adding
    } catch (error) {
      setError(error.message || 'Error adding new member');
    }
  };

  // Handle Delete: Delete the team member
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/about/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete team member');

      setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
    } catch (error) {
      setError(error.message || 'Error deleting member');
    }
  };

  if (loading) return <p>Loading team members...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-5">
      <div className="flex">
        <h1 className="text-heading-m font-[700] leading-[1.5rem] text-center">Team Members</h1>

        {/* Button to open the modal for adding a new member */}
        <button
          onClick={handleAdd}
          className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-4 pt-2 pb-2 rounded-lg text-white"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap justify-evenly gap-4 mt-4">
        {teamMembers.length > 0 ? (
          teamMembers.map(member => (
            <AboutUsCard
              key={member.id}
              photo={member.imageUrl}
              name={member.name}
              linkedin={member.linkedin}
              github={member.github}
              mail={member.email}
              onEdit={() => handleEdit(member)}
              onDelete={() => handleDelete(member.id)}
            />
          ))
        ) : (
          <p>No team members available.</p>
        )}
      </div>

      {/* Modal for adding/editing team member */}
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        member={editingMember || {}}
        onSave={editingMember ? handleUpdate : handleAddMember}
      />
    </div>
  );
};

export default About;
