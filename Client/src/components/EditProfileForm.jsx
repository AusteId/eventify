import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CloseSVG from '../assets/CloseSVG';
import editEvent from '../helpers/event/editEvent';
import Button from './Button';
import CategoryImage from './category/CategoryImage';
import { useDarkMode } from './context/DarkModeContext';
import FieldValidationError from './FieldValidationError';
import ImageDropzone from './Registration/ImageDropZone';

const EditProfileForm = ({
  userCategories,
  pUserId,
  isLoading,
  setIsLoading,
  description,
}) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const { isDarkMode } = useDarkMode();
  const [avatarState, setAvatarState] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: null,
      description: description,
      categoryIds: [],
    },
  });

  const avatar = watch('avatar');
  const categoryIds = watch('categoryIds');

  const closeModal = () => {
    resetForm();
    clearErrors();
    document.getElementById('edit_profile_modal').close();
  };

  const getAllCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/categories/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast.error(`Error fetching categories: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch categories');
    } finally {
    }
  };

  useEffect(() => {
    applyDefaultCategories();
  }, [categories]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const applyDefaultCategories = () => {
    let categoryList = [];
    userCategories?.map(category => {
      categoryList.push(category.id);
    });
    setSelectedInterests(categoryList);
    setValue('categoryIds', categoryList);
  };

  const resetForm = () => {
    applyDefaultCategories();
    setAvatarState(`http://localhost:8080/api/users/${pUserId}/avatar`);
    setValue('avatar', avatarState);
    // reset({
    //   avatar: null,
    //   description: description,
    // });
  };

  const toggleInterest = interestId => {
    let newInterests;
    if (selectedInterests.includes(interestId)) {
      newInterests = selectedInterests.filter(id => id !== interestId);
    } else {
      newInterests = [...selectedInterests, interestId];
    }

    setSelectedInterests(newInterests);
    setValue('categoryIds', newInterests);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/${pUserId}/avatar`, {
        responseType: 'blob',
      })
      .then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setValue('avatar', response.data);
        setAvatarState(imageUrl);
      })
      .catch(error => console.error('Error fetching avatar:', error));
  }, [pUserId]);

  const onSubmit = async data => {
    if (isLoading) return;
    closeModal();
    console.log(data);
    setIsLoading(true);
    try {
      const response = await editEvent(data, pUserId);
      toast.success('Event edited successfully');
    } catch (error) {
      console.error('Event edit failed: ', error);
      toast.error('Failed to edit event');
    } finally {
      resetForm();
      navigate(0);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full items-center justify-between">
        <h1 className={`font-inter text-heading-m font-bold`}>Edit Profile</h1>
        <button onClick={closeModal} type="button" className={`w-10 h-10`}>
          <CloseSVG />
        </button>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <ImageDropzone
            onFileChange={file => {
              setValue('avatar', file);
            }}
            initialPreview={avatarState}
            fieldName="avatar"
            acceptedTypes={['image/jpeg', 'image/png']}
            maxSize={5 * 1024 * 1024}
          />
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="profile-description"
          >
            Description
          </label>
          <textarea
            id="profile-description"
            className={` ${isDarkMode ? 'text-gray-200 border-[#f59e0b]' : 'text-body-medium border-input-light'} field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border rounded-md px-3 py-2 focus:outline-none ...`}
            rows="4"
            placeholder="Add a description..."
            maxLength={1000}
            defaultValue={description}
            {...register('description', {
              maxLength: {
                value: 1000,
                message: 'Description cannot exceed 1000 characters',
              },
            })}
          ></textarea>
          <FieldValidationError>
            {errors.description?.message}
          </FieldValidationError>
        </div>
      </div>
      <div className="flex mt-6 gap-6">
        <div className="w-full">
          <label
            className="block font-inter text-body-m font-bold mb-2"
            htmlFor="profile-categories"
          >
            Categories
          </label>
          <div className="grid md:grid-cols-3 grid-rows-3 text-center gap-3">
            {categories?.map(category => (
              <div
                key={category.id}
                className={`capitalize
                cursor-pointer duration-500 px-4 py-2 rounded-2xl border flex flex-col items-center
                ${
                  selectedInterests.includes(category.id) && isDarkMode
                    ? 'border-[#f59e0b] bg-slate-700 text-gray-200'
                    : isDarkMode
                      ? 'border-[#f59e0b] text-gray-200'
                      : selectedInterests.includes(category.id)
                        ? 'bg-category-bg text-black border-btn'
                        : 'bg-white text-body-medium border-gray-300'
                }
              `}
                onClick={() => toggleInterest(category.id)}
              >
                <CategoryImage categoryId={category.id} />
                {category.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex mt-6 gap-6 justify-end">
        <Button
          type="button"
          onClick={closeModal}
          background={`duration-750 ${isDarkMode ? 'bg-slate-900 border-1 border-[#f59e0b] hover:bg-slate-600' : 'bg-white border-1 border-gray-300'}`}
          hoverColor={`duration-750 ${isDarkMode && 'hover:text-[#f59e0b]'}`}
          textColor={`duration-750 ${isDarkMode && 'text-[#f59e0b]'}`}
        >
          <p>Cancel</p>
        </Button>
        <button
          type="submit"
          className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-6 pt-3 pb-3 rounded-lg text-white"
        >
          Apply Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
