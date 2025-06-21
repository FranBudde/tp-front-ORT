"use client";
import React from "react";

export default function CommentBox({ comment, onChange }) {
  return (
    <div className="px-4 mb-6">
      <label htmlFor="comment" className="text-sm text-gray-300 block mb-2">
        Comentario (opcional)
      </label>
      <textarea
        id="comment"
        value={comment}
        onChange={(e) => onChange(e.target.value)}
        rows={1}
        placeholder="..."
        className="w-full p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
}
