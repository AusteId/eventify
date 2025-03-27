import axios from 'axios';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import avatar from '../assets/avatar.png';

const Comment = props => {
  const [imgSrc, setImgSrc] = useState(props.avatar || avatar);
  const [editing, setEditing] = useState(false);
  const [editingComment, setEditingComment] = useState('+');

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
    baseURL: 'http://localhost:8080/api',
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
        const response = await api.delete('/events/comments/' + props.id);
      } catch (err) {
        console.error('Error deleting comment:', err);
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
        const response = await api.patch(`/events/comments/` + props.id, {
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

  return (
    <div
      key={props.id}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="card-body p-4 bg-light-gray">
        <div className="flex items-start gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img
                src={imgSrc}
                onError={() => setImgSrc(avatar)}
                alt={props.name}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-header-dark text-body-m font-inter font-bold">
                  {props.name}
                </h3>
                <p className="font-inter text-body-medium text-body-s opacity-70">
                  {props.time}
                </p>
              </div>

              {props.contextid == props.userId ? (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button
                        type="button"
                        onClick={onEdit}
                        className="text-body-medium"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={deleteC}
                        className="text-error"
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
                  className="mt-2 field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none ..."
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
                    className="btn bg-btn items-center border-0 shadow-none hover:bg-btn-hover px-4 pt-3 pb-3 rounded-lg text-white"
                    disabled={!editingComment.trim()}
                  >
                    <Pencil className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn bg-white border border-input-light shadow-none hover:bg-input-light px-6 pt-3 pb-3 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-body-medium text-body-m font-inter mt-2 break-all">
                {props.comment}
              </p>
            )}
            {/* <p className="text-body-medium text-body-m font-inter mt-2 break-all">
              {props.comment}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
