import { useState } from "react";
import { FaRegPaperPlane, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa";

export const VoidrPromoTwitterCard: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => setLiked((prev) => !prev);
  const handleBookmark = () => setBookmarked((prev) => !prev);

  return (
    <div className="my-6 mx-auto max-w-xl w-full rounded-3xl bg-white border border-blue-200 shadow-xl p-4 transition hover:shadow-2xl cursor-pointer" onClick={() => window.location.href = '/'}>
      {/* Twitter-style Header */}
      <div className="flex items-center gap-3 mb-2">
        <img src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" alt="Voidr Health" width={40} height={40} className="rounded-full border border-blue-300" />
        <div>
          <span className="font-bold text-blue-700">Voidr Health</span>
          <span className="ml-2 text-gray-500 text-sm">@voidrhealth · now</span>
        </div>
      </div>
      {/* Promo Content */}
      <div className="mt-2 mb-4 text-gray-900 text-base leading-relaxed">
        <span className="font-semibold text-blue-700">🚀 Discover the future of medical learning!</span><br />
        Voidr Health brings you AI-powered tools for clinical reasoning, case simulations, and instant note summarization.<br />
        <span className="text-blue-600 font-medium">Tap to explore the platform and level up your med journey.</span>
      </div>
      <div className="rounded-xl overflow-hidden mb-3">
        <img src="/lovable-uploads/hero-preview.png" alt="Voidr Health Demo" className="w-full object-cover" />
      </div>
      {/* Actions */}
      <div className="flex justify-evenly gap-2 mt-2">
        <button type="button" onClick={e => { e.stopPropagation(); handleLike(); }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
          {liked ? <FaHeart color="red" /> : <FaRegHeart />}<span className="text-sm font-medium text-gray-700">{liked ? "Liked" : "Like"}</span>
        </button>
        <button type="button" onClick={e => { e.stopPropagation(); handleBookmark(); }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
          {bookmarked ? <FaBookmark color="#00bfff" /> : <FaRegBookmark />}<span className="text-sm font-medium text-gray-700">{bookmarked ? "Saved" : "Save"}</span>
        </button>
        <button type="button" onClick={e => { e.stopPropagation(); navigator.share && navigator.share({ title: 'Voidr Health', url: window.location.href }); }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
          <FaRegPaperPlane /><span className="text-sm font-medium text-gray-700">Share</span>
        </button>
      </div>
    </div>
  );
};
