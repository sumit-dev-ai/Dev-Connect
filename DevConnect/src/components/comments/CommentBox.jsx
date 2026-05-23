import { ArrowUp } from "lucide-react";

export const CommentBox = ({
  postId,
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="w-full border border-gray-300 flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(postId, e.target.value)}
        className="w-full p-2 rounded-sm"
        placeholder="Share your thoughts..."
      />

      <button
        type="button"
        onClick={() => onSubmit(postId)}
        className="p-2"
      >
        <ArrowUp />
      </button>
    </div>
  );
};