import React, { useState } from 'react';

const Comment = ({ comment, addReply, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    if (replyContent.trim() !== '') {
      addReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className={`ml-${level * 4} mt-4`}>
      <div className="bg-white rounded-xl shadow-md p-4">
        <p className="text-gray-800">{comment.content}</p>
        <button
          className="text-sm text-blue-500 hover:underline mt-2"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          Responder
        </button>
        <button
          className="text-sm m-2 text-blue-500 hover:underline mt-2"
          onClick={() => setShowReplies(!showReplies)}
        >
          Respuestas {comment.replies.length}
        </button>
        {showReplyForm && (
          <div className="mt-2">
            <textarea
              className="w-full border border-gray-300 rounded p-2 text-sm"
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escribí tu respuesta..."
            />
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                onClick={handleReply}
              >
                Enviar
              </button>
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={() => setShowReplyForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className={`
    transition-all duration-500 ease-in-out overflow-hidden
    ${showReplies ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'}
  `}>
        {comment.replies?.map((reply) => (
        <Comment key={reply.id} comment={reply} addReply={addReply} level={level + 1} />
      ))}
        </div>
        {/* Renderizar respuestas */}
      
      </div>

      
    </div>
  );
};

const CommentThread = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      content: 'Comentario original',
      replies: [
        {
          id: 2,
          content: 'Respuesta al comentario original',
          replies: [],
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([
        ...comments,
        { id: Date.now(), content: newComment, replies: [] },
      ]);
      setNewComment('');
    }
  };

  const addReply = (parentId, content) => {
    const addReplyRecursively = (commentsList) =>
      commentsList.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...c.replies, { id: Date.now(), content, replies: [] }],
          };
        } else if (c.replies.length > 0) {
          return {
            ...c,
            replies: addReplyRecursively(c.replies),
          };
        }
        return c;
      });

    setComments(addReplyRecursively(comments));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Comentarios</h2>

      <div className="mb-4">
        <textarea
          className="w-full border border-gray-300 rounded p-2"
          rows={3}
          placeholder="Escribí un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddComment}
        >
          Comentar
        </button>
      </div>

      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} addReply={addReply} />
      ))}
    </div>
  );
};

export default CommentThread;
