import React from 'react';
import axios from 'axios';
import avatar from '../assets/avatar.png';
import { useState } from 'react';
import { Trash2, MoreVertical } from 'lucide-react';

const Comment2 = props => {
  const [imgSrc, setImgSrc] = useState(props.avatar || avatar);

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

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle">
                  <MoreVertical className="h-4 w-4" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
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
            </div>

            <p className="text-body-medium text-body-m font-inter mt-2 break-all">
              {props.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment2;
