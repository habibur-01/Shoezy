import React, { useState, useEffect, useCallback } from "react";
import { Star, ShieldCheck, Lock, User, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import {
  getProductReviews,
  checkCanUserReview,
  createOrUpdateReview,
} from "../../server/review/review";

const ReviewsSection = ({ productId }) => {
  const { isAuthenticated: hasUser } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // User review status & eligibility
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews for product
  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoadingReviews(true);
      const res = await getProductReviews(productId);
      if (res?.data?.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error("fetchReviews error:", err);
    } finally {
      setLoadingReviews(false);
    }
  }, [productId]);

  // Check if current user can review this product
  const fetchEligibility = useCallback(async () => {
    if (!hasUser || !productId) {
      setCanReview(false);
      setHasReviewed(false);
      return;
    }
    try {
      setCheckingEligibility(true);
      const res = await checkCanUserReview(productId);
      if (res?.data?.success) {
        const { canReview, hasReviewed, existingReview } = res.data.data;
        setCanReview(canReview || false);
        setHasReviewed(hasReviewed || false);

        if (existingReview) {
          setRating(existingReview.rating || 5);
          setComment(existingReview.comment || "");
        }
      }
    } catch (err) {
      console.error("fetchEligibility error:", err);
    } finally {
      setCheckingEligibility(false);
    }
  }, [hasUser, productId]);

  useEffect(() => {
    fetchReviews();
    fetchEligibility();
  }, [fetchReviews, fetchEligibility]);

  // Handle Review Submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!hasUser) {
      toast.warning("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a short comment about your experience");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createOrUpdateReview({
        product: productId,
        rating,
        comment: comment.trim(),
      });

      if (res?.data?.success) {
        toast.success(hasReviewed ? "Review updated successfully!" : "Review submitted successfully! 🎉");
        await fetchReviews();
        await fetchEligibility();
      } else {
        toast.error(res?.data?.message || "Failed to submit review");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Only verified purchasers of this product can submit a review.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate Average Rating & Distribution
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
      : "5.0";

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.rating && ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8 shadow-xs space-y-8 my-8">
      {/* Header & Overall Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-6">
        <div>
          <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-stone-900" />
            <span>Customer Reviews & Ratings</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Real feedback from verified buyers who purchased this product
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
          <div className="text-center">
            <span className="text-3xl font-black text-stone-900 leading-none">{averageRating}</span>
            <span className="text-[11px] font-semibold text-stone-500 block mt-0.5">out of 5.0</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(averageRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-stone-700">
              Based on {totalReviews} verified review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* RATING BREAKDOWN BARS */}
      {totalReviews > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 max-w-xl bg-stone-50/50 p-4 rounded-xl border border-stone-100">
          {[5, 4, 3, 2, 1].map((num) => {
            const count = ratingCounts[num] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={num} className="flex items-center gap-2 text-xs">
                <span className="font-bold text-stone-700 w-3">{num}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-stone-500 font-semibold w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* REVIEW SUBMISSION SECTION (VERIFIED PURCHASER ONLY) */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-6 space-y-4">
        {!hasUser ? (
          // Guest User State
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Want to leave a review?</h4>
                <p className="text-xs text-stone-500">
                  Please log in to your account to check your verified purchase status and write a review.
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
            >
              Log In to Review
            </Link>
          </div>
        ) : checkingEligibility ? (
          // Loading Eligibility State
          <div className="flex items-center gap-2 py-4 justify-center text-xs font-semibold text-stone-500">
            <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
            <span>Checking purchase eligibility...</span>
          </div>
        ) : !canReview ? (
          // Logged in BUT Not Purchased State
          <div className="flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Verified Purchase Required
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Only customer accounts that have ordered and purchased this item can leave a review. Order this product to unlock verified customer review features!
              </p>
            </div>
          </div>
        ) : (
          // Logged in & Eligible Purchaser State -> Show Form
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  {hasReviewed ? "Edit Your Verified Review" : "Write a Verified Customer Review"}
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Buyer ✓
              </span>
            </div>

            {/* Interactive Star Rating Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-stone-700 ml-2">
                  {hoverRating || rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">Your Feedback & Comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your experience with the quality, fit, or performance of this product..."
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{hasReviewed ? "Update Review" : "Submit Verified Review"}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
          Customer Reviews ({totalReviews})
        </h4>

        {loadingReviews ? (
          <div className="flex items-center gap-2 py-8 justify-center text-xs font-semibold text-stone-500">
            <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
            <span>Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs font-bold text-stone-800">No reviews yet</p>
            <p className="text-[11px] text-stone-500">
              Be the first verified customer to leave a review for this product!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {reviews.map((rev) => {
              const userName = rev.user
                ? rev.user.firstName
                  ? `${rev.user.firstName} ${rev.user.lastName || ""}`
                  : rev.user.username || "Verified Customer"
                : "Verified Customer";

              const avatar = rev.user?.avatar;
              const dateStr = rev.created_at
                ? new Date(rev.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recently";

              return (
                <div key={rev._id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={userName}
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                          {userName[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{userName}</span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Verified Buyer ✓
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block">{dateStr}</span>
                      </div>
                    </div>

                    {/* Star rating for review */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= (rev.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed pl-11">{rev.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
