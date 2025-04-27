import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useAuth } from '../Auth/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import LoadingScreen from '../message/LoadingScreen.jsx';
import Pagination from '../Pagination.jsx';
import { Calendar, Trash2 } from 'lucide-react';
import avatar from '../../assets/default-user-image.png';
import defaultEvent from "../../assets/no-image.png"
import DeleteModal from '../DeleteModal.jsx';
import Searchbar from './Searchbar.jsx';

const AdminComments = () => {
  const { isDarkMode } = useDarkMode();
  const { authFetch } = useAuth();
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedCommentsContent, setSelectedCommentsContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await authFetch(`http://localhost:8080/api/users/${userId}/avatar`, {
          method: 'GET',
        });
        const avatarBlob = await response.blob();
        const avatarUrl = URL.createObjectURL(avatarBlob);
        setUserAvatar(avatarUrl);
      } catch (error) {
        console.error(error.message || "Server Error");
      }
    };
    fetchAvatar();
    return () => {
      if (userAvatar) {
        URL.revokeObjectURL(userAvatar)
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await authFetch(`http://localhost:8080/api/admin/${userId}/username`, {
          method: 'GET',
        });
        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized");
        }
        const username = await response.text();
        setUsername(username);
      } catch (error) {
        console.error(error.message || "Server Error");
      }
    };
    fetchUsername();
  }, []);

  const fetchComments = async (page = 0,term = "") => {
    setLoading(true);
    try {
      const response = await authFetch(`http://localhost:8080/api/admin/comments/creator/${userId}?page=${page}${term ? `&searchTerm=${encodeURIComponent(term)}` : ''}`, {
        method: 'GET',
      });
      if (response.status === 401 || response.status === 403) {
        toast.error("Unauthorized");
        return;
      }
      const data = await response.json();
      setComments(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    fetchComments(pageNumber - 1,searchTerm);
  };

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
    fetchComments(0, term);
  };

  useEffect(() => {
    fetchComments(0);
  }, [refresh]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deleteComment = async () => {
    try {
      const response = await authFetch(`http://localhost:8080/api/events/comments/${selectedCommentId}`, {
        method: 'DELETE',
      });

      if (response && response.ok) {
        toast.success('Comment deleted successfully');
        setDeleteModal(false);
        setRefresh(prev => prev + 1);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting comment:', err);
      return false;
    }
  };

  const openDeleteModal = (commentId,commentContent) => {
    setSelectedCommentId(commentId);
    setSelectedCommentsContent(commentContent);
    setDeleteModal(true);
  }

  const placeholderTerm = "Search comments by content"

  return (
    <>
      {deleteModal && (
        <DeleteModal buttonAccept={'Delete'}
                     buttonCancel={'Cancel'}
                     closeModal={() => setDeleteModal(false)}
                     warningMessage={'Are you sure you want to delete '}
                     name={`${username}'s comment
                     which is - "${selectedCommentsContent}"`}
                     onClick={deleteComment}
        />
      )}
      <div className="px-6 pt-6 pb-2">
        <Searchbar placeholder={placeholderTerm} onSearch={handleSearch} initialValue={searchTerm} />
      </div>

    <div className={`container mx-auto px-4 py-6 max-w-4xl transition-colors duration-750 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
      <h1 className={`text-center text-3xl font-bold mb-8 font-inter ${isDarkMode ? "text-[#f59e0b]" : "text-header-dark"}`}>
        <span className="capitalize">{username || "User"}</span>'s comments
      </h1>

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingScreen />
        </div>
      )}

      {!loading && comments.length === 0 ? (
        <div className={`col-span-full text-center py-12 text-lg duration-750 font-inter ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          User has no comments
        </div>
      ) : (
        <div className="space-y-4 duration-750">
          {comments.map((comment) => (
            <div
              key={comment.commentId}
              className={`duration-750 shadow-sm hover:shadow-md transition-all rounded-2xl border ${
                isDarkMode ? "bg-slate-900 border-[#f59e0b]" : "bg-light-gray border-transparent"
              }`}
            >
              <div className={`relative p-5 rounded-2xl ${isDarkMode ? "bg-slate-600/40" : "bg-light-gray"}`}>
                <div className="flex items-center mb-4 pb-3 border-b border-opacity-20 border-gray-400">
                  <div className="avatar mr-3">
                    <div
                      onClick={() => {navigate(`/events/${comment.eventId}`)}}
                      className="cursor-pointer border hover:border-[#f59e0b] w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <img
                        src={`http://localhost:8080/api/events/${comment.eventId}/picture`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultEvent;
                        }}
                        alt="Event"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3
                      onClick={() => {navigate(`/events/${comment.eventId}`)}}
                      className={`text-lg cursor-pointer font-inter duration-750 font-bold hover:underline ${isDarkMode ? "text-[#f59e0b]" : "text-header-dark"}`}>
                      {comment.eventName}
                    </h3>
                    <div className={`flex items-center text-sm font-inter ${isDarkMode ? "text-amber-700" : "text-gray-500"}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div>
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-full">
                        <img
                          src={userAvatar || avatar}
                          alt={username}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      className="text-error absolute right-[3%] cursor-pointer duration-300 hover:translate-y-[1px] hover:text-red-500 bottom-[15%]"
                      onClick={(e) => {
                        openDeleteModal(comment.commentId,comment.comment)
                        e.stopPropagation();
                      }}
                    >
                      <Trash2 className="w-8 h-8" />
                    </button>
                    <p className={`text-body-l font-inter mt-2 break-all overflow-hidden ${
                      isDarkMode ? "text-gray-200" : "text-body-medium"
                    }`}>
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            paginate={handlePageChange}
          />
        </div>
      )}
    </div>
      </>
  );
};

export default AdminComments;