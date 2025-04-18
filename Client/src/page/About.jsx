import { useEffect, useState } from 'react';
import AboutUsCard from '../components/aboutus/AboutUsCard';
import Modal from '../components/aboutus/AboutUsModal.jsx';
import { useDarkMode } from '../components/context/DarkModeContext.jsx';
import Button from '../components/Button.jsx';
import toast from 'react-hot-toast';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode } = useDarkMode();

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

  const handleEdit = (member) => {
    if (member.id) {
      setEditingMember(member);
      setIsModalOpen(true);
    } else {
      console.error("Member ID is undefined:", member);
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleUpdate = async (updatedMember, imageFile) => {
    try {
      if (!updatedMember.id) toast.error('Member ID is missing');

      const formData = new FormData();
      formData.append("name", updatedMember.name);
      formData.append("linkedin", updatedMember.linkedin);
      formData.append("github", updatedMember.github);
      formData.append("email", updatedMember.email);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`http://localhost:8080/api/about/${updatedMember.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) toast.error('Failed to update team member');

      const updatedData = await response.json();
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === updatedData.id ? updatedData : member
        )
      );
      toast.success('Successfully updated team members');
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message || 'Error updating member');
    }
  };

  const handleAddMember = async (newMember, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("name", newMember.name);
      formData.append("linkedin", newMember.linkedin);
      formData.append("github", newMember.github);
      formData.append("email", newMember.email);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch('http://localhost:8080/api/about', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Failed to add new team member:', errorMessage);
        toast.error('Failed to add new team member');
      }

      const addedMember = await response.json();
      setTeamMembers((prevMembers) => [...prevMembers, addedMember]);
      setIsModalOpen(false);
      toast.success('Successfully added team member');
    } catch (error) {
      setError(error.message || 'Error adding new member');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/about/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) toast.error('Failed to delete team member');

      setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
      toast.success('Successfully deleted team member');
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
    <div className={`flex flex-col items-center gap-5 py-10 px-10`}>
      <div
        className={`flex flex-col justify-start gap-8 h-full items-center tablet:items-baseline ${loading && 'tablet:items-center'}`}>

        <h1 className={`text-heading-m font-[700] leading-[1.5rem] ${loading && 'text-center'} ${isDarkMode ? "text-gray-200" : "text-header-dark"}`}>Team Members</h1>
        <Button
          onClick={handleAdd}
          size="large"
          className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-4 pt-2 pb-2 rounded-lg text-white"
        >
          Add
        </Button>
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
                  isDarkMode={isDarkMode}
                />
              ))
            ) : (
              <p>No team members available.</p>
            )}
          </div>

          <Modal
            key={editingMember ? editingMember.id : "newMember"}
            isOpen={isModalOpen}
            closeModal={handleCloseModal}
            member={editingMember || {}}
            onSave={editingMember ? handleUpdate : handleAddMember}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default About;