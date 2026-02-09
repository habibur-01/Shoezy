import FilterSection from "./FilterSection";

const RatingFilter = ({ selectedRating, onChange }) => (
  <FilterSection title="Rating">
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(rating => (
        <label key={rating} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="rating"
            checked={selectedRating === rating}
            onChange={() => onChange(rating)}
            className="w-4 h-4 border-gray-300 text-black focus:ring-black"
          />
          <span className="ml-3 flex items-center">
            {[...Array(rating)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
            <span className="ml-2 text-gray-600 text-sm">& up</span>
          </span>
        </label>
      ))}
    </div>
  </FilterSection>
);

export default RatingFilter;