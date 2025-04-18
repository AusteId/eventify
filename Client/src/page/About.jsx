import  { useEffect, useState } from 'react';
import AboutUsCard from '../components/AboutUsCard';
import Modal from '../components/AboutUsModal.jsx';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(true);  // Open the modal with the member's details
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
      const memberToSend = {
        name: newMember.name,
        linkedin: newMember.linkedin,
        github: newMember.github,
        email: newMember.email,
        imageUrl: newMember.imageUrl,
      };

      const response = await fetch('http://localhost:8080/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberToSend),
        credentials: 'include',
      });

      // Log response status and body for better debugging
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Failed to add new team member:', errorMessage);
        throw new Error('Failed to add new team member');
      }

      const addedMember = await response.json();
      setTeamMembers((prevMembers) => [...prevMembers, addedMember]);
      setIsModalOpen(false);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  if (loading) return <p>Loading team members...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center gap-5 py-10 px-10 text-black">
      <div
        className={`flex flex-col justify-start gap-8 h-full items-center tablet:items-baseline ${loading && 'tablet:items-center'}`}>

        <h1 className={`text-heading-m font-[700] leading-[1.5rem] ${loading && 'text-center'}`}>Team Members</h1>
        <button
          onClick={handleAdd}
          className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-4 pt-2 pb-2 rounded-lg text-white"
        >
          Add
        </button>
        <div className="h-full">
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
            key={editingMember ? editingMember.id : "newMember"}
            isOpen={isModalOpen}
            closeModal={handleCloseModal}
            member={editingMember || {}}
            onSave={editingMember ? handleUpdate : handleAddMember}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
