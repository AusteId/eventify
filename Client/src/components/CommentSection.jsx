import axios from 'axios';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import avatarDefault from '../assets/avatar.png';
import Comment from './Comment';
import { useAuth } from './Auth/AuthContext';
import { useDarkMode } from './context/DarkModeContext.jsx';
import CommentButton from './CommentButton.jsx';
import BannedButton from './Auth/BannedButton.jsx';


const CommentSection = props => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const {userId,avatar,isAuthenticated} = useAuth();
  const { isDarkMode } = useDarkMode();
  const {shortenContent,roles} = useAuth();

  const bannedRole = roles.find((role) => role.name === "BANNED");

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: null,
    },
  });

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  const onPostComment = data => {
    setComments([]);
    setLoading(true);

    const post = async () => {
      try {
        const response = await api.post(`${props.endpoint}`, {
          comment: data.comment,
        });
        console.log(response.data);
      } catch (err) {
        console.error('Error posting comment:', err);
      } finally {
        fetchComments();
      }
    };

    post();

    reset();

    setNewComment('');
  };

  const fetchComments = () => {
    setLoading(true);

    const fetch = async () => {
      try {
        const response = await api.get(`${props.endpoint}`); // Adjust endpoint as needed
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      {isAuthenticated &&  <form onSubmit={handleSubmit(onPostComment)}>
        <h1 className={` font-inter font-bold text-heading-s pb-6 ${isDarkMode ? "text-gray-200" : "text-header-dark"}`}>
          Comments
        </h1>
        <div className="flex">
          <img
            className="w-10 h-10 rounded-full"
            src={avatar || avatarDefault}
            alt="User avatar"
          />
          <div className="pl-4 w-full">
            <textarea
              id="textarea"
              className={`duration-750 field-sizing-fixed resize-none font-inter  text-body-m w-full bg-transparent text-sm border  rounded-md px-3 py-2 focus:outline-none ... ${isDarkMode ? "text-gray-200 placeholder:text-gray-400 border-gray-300" : "text-body-medium placeholder:text-slate-400 border-slate-200"}`}
              rows="4"
              placeholder="Write a comment..."
              onInput={e => setNewComment(e.target.value)}
              maxLength={1000}
              {...register('comment', {
                required: 'Comment required',
                maxLength: {
                  value: 1000,
                  message: 'Comment cannot exceed 1000 characters',
                },
              })}
            ></textarea>
            <div className="w-full flex flex-row items-center">
              {bannedRole ? <BannedButton isAuthenticated={isAuthenticated} roles={roles} buttonName={"Post Comment"} size="big" message="Cannot post comments while banned"/>
             : <CommentButton isDarkMode={isDarkMode} newComment={newComment} handleSubmit={handleSubmit} /> }
            </div>
          </div>
        </div>
      </form>}
     
      {loading && !comments.length ? (
        <div className="flex justify-center mt-20">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : comments.length > 0 ? (
        <div className="flex flex-col gap-6 pt-8">
          {comments.map(comment => (
            <Comment
              name={shortenContent(comment.userResponse.username, 30)}
              contextId={props.contextId}
              avatar={'src/assets/avatar.png'}
              comment={comment.comment}
              time={comment.createdAt}
              key={comment.id}
              id={comment.id}
              fetchComments={fetchComments}
              setComments={setComments}
              setLoading={setLoading}
              userId={comment.userResponse.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center pt-10 pb-10">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 mx-auto" fill="none" viewBox="0 0 24 24" stroke={`${isDarkMode ? "#e5e7eb" : "gray"}`}>
   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
          <p className={`font-inter mt-2 ${isDarkMode ? "text-gray-300" : "text-body-medium"}`}>No comments yet</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
