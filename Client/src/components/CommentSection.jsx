import axios from 'axios';
import { MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import avatar from '../assets/avatar.png';
import Comment from './Comment';

const CommentSection = props => {
  const [imgSrc, setImgSrc] = useState(avatar);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

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
      <form onSubmit={handleSubmit(onPostComment)}>
        <h1 className="text-header-dark font-inter font-bold text-heading-s pb-6">
          Comments
        </h1>
        <div className="flex">
          <img
            className="w-10 h-10 rounded-full"
            src={imgSrc}
            alt="User avatar"
            onError={() => setImgSrc(avatar)}
          />
          <div className="pl-4 w-full">
            <textarea
              id="textarea"
              className="field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none ..."
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
              <button
                type="submit"
                className="btn bg-btn items-center border-0 shadow-none hover:bg-btn-hover px-4 pt-3 pb-3 rounded-lg text-white"
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4" />
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>
      {loading && !comments.length ? (
        <div className="flex justify-center mt-20">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      ) : comments.length > 0 ? (
        <div className="flex flex-col gap-6 pt-8">
          {comments.map(comment => (
            <Comment
              name={comment.userResponse.username}
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
          <MessageCircle className="h-20 w-20" />
          <p className="font-inter text-body-medium mt-2">No comments yet</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
