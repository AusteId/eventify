import axios from 'axios';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import avatar from '../assets/avatar.png';
import { useDarkMode } from './context/DarkModeContext.jsx';
import { useAuth } from './Auth/AuthContext.jsx';
import toast from 'react-hot-toast';
import DeleteModal from './DeleteModal.jsx';


const Comment = props => {
  const [editing, setEditing] = useState(false);
  const [editingComment, setEditingComment] = useState('+');
  const { isDarkMode } = useDarkMode();
  const { roles,authFetch } = useAuth();
  const [deleteModal, setDeleteModal] = useState(false);
  const adminRole = roles.find((role) => role.name === "ADMIN");
  const bannedRole = roles.find((role) => role.name === "BANNED");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: props.comment,
    },
  });

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACK_URL + '/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  const deleteC = () => {
    props.setComments([]);
    props.setLoading(true);


    const del = async () => {
      try {
        const response = await api.delete(props.editPoint + props.id);
        console.log("Success!");
      } catch (err) {
        console.error('Error:', err);
        toast.error("Failed to delete comment");
      } finally {
        props.fetchComments();
      }
    };
    del();
  };

  const onEdit = () => {
    setEditing(true);
    closeDropdown();
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditingComment('+');
    reset();
  };

  const closeDropdown = () => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  };

  const editComment = data => {
    props.setComments([]);
    props.setLoading(true);

    const edit = async () => {
      try {
        const response = await api.patch(props.editPoint + props.id, {
          comment: data.comment,
        });
        console.log(response.data);
      } catch (err) {
        console.error('Error editing comment:', err);
      } finally {
        props.fetchComments();
        setEditing(false);
      }
    };
    edit();
  };

  const secureClick = () => {
    if (!adminRole) {
      toast.error("Unauthorized")
      return;
    }
    setDeleteModal(true);
  }

  const closeModal = () => {
    setDeleteModal(false);
  }
  return (
    <>
    {deleteModal && <DeleteModal buttonAccept={"Delete"}
    buttonCancel={"Cancel"}
    warningMessage={"Are you sure you want to delete comment by"}
    name={props.name}
    api={`/api/users/${props.id}/avatar`}
                                 onClick={deleteC}
    closeModal={closeModal}/>}
    <div
      key={props.id}
      className={`duration-750 card bg-base-100 shadow-sm hover:shadow-md transition-all rounded-2xl border ${isDarkMode ? "bg-slate-600/40 border-[#f59e0b]" : "bg-light-gray border-transparent"}`}
    >
      <div className={`relative card-body p-4 rounded-2xl ${isDarkMode ? "bg-slate-600/40" : "bg-light-gray"}`}>
        {(adminRole && props.contextId != props.userId) && <button onClick={secureClick} className="text-error absolute right-[6%] top-[12%]">
          <Trash2 className="cursor-pointer h-6 w-6" />
        </button>}
        <div className="flex items-start gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img
                  src={`http://localhost:8080/api/users/${props.userId}/avatar`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = avatar;
                  }}
                alt={(props.name)}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-body-m font-inter capitalize font-bold ${isDarkMode ? "text-[#f59e0b]" : "text-header-dark"}`}>
                  {props.name}
                </h3>
                <p className={`font-inter ${isDarkMode ? "text-amber-700" : "text-header-dark"} text-body-s opacity-70`}>
                  {props.time}
                </p>
              </div>

              {props.contextId == props.userId ? (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className={`btn btn-ghost btn-xs btn-circle ${isDarkMode && "hover:bg-[#f59e0b] duration-750 border-transparent shadow-none"}`}
                  >
                    <MoreVertical className={`duration-750 h-4 w-4 ${isDarkMode && "text-[#f59e0b] hover:text-gray-200"}`} />
                  </label>
                  <ul
                    tabIndex={0}
                    className={`dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border ${isDarkMode ? "bg-slate-900 border-[#f59e0b]" : "border-transparent" }`}
                  >
                    <li>
                      <button
                        type="button"
                        onClick={onEdit}
                        className={`duration-750 ${isDarkMode ? "text-gray-200 hover:bg-slate-600" : "text-body-medium"}`}
                      >
                        <Pencil className={`h-4 w-4 ${isDarkMode ? "text-[#f59e0b]" : ""}`} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={deleteC}
                        className={`text-error duration-750 ${isDarkMode && "hover:bg-slate-600"}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                ''
              )}
            </div>
            {editing ? (
              <form onSubmit={handleSubmit(editComment)}>
                <textarea
                  id="edittext"
                  className={`duration-750 field-sizing-fixed resize-none font-inter  text-body-m w-full bg-transparent text-sm border  rounded-md px-3 py-2 focus:outline-none ... ${isDarkMode ? "text-gray-200 placeholder:text-gray-400 border-gray-300" : "text-body-medium placeholder:text-slate-400 border-slate-200"}`}
                  rows="2"
                  placeholder="Edit your comment..."
                  onInput={e => setEditingComment(e.target.value)}
                  maxLength={1000}
                  {...register('comment', {
                    required: 'Comment required',
                    maxLength: {
                      value: 1000,
                      message: 'Comment cannot exceed 1000 characters',
                    },
                  })}
                ></textarea>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`btn  items-center border-0 shadow-none px-4 pt-3 pb-3 rounded-lg  ${isDarkMode ? "bg-amber-600 text-gray-200 hover:bg-amber-700" : "text-white bg-btn hover:bg-btn-hover"}`}
                    disabled={!editingComment.trim()}
                  >
                    <Pencil className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className={`btn border shadow-none  px-6 pt-3 pb-3 rounded-lg ${isDarkMode ? "border-[#f59e0b] text-gray-200 hover:text-[#f59e0b] bg-slate-900 hover:bg-slate-800" : "bg-white border-input-light shadow-none hover:bg-input-light"}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className={`text-body-m font-inter mt-2 break-all overflow-hidden ${isDarkMode ? "text-gray-200" : "text-body-medium"}`}>
                {props.comment}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Comment;
