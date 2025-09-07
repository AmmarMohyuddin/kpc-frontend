import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TitleValueRow from "./TitleValueRow";

interface Field {
  label: string;
  value: any;
}

interface ShowMoreListProps {
  fields: Field[];
  initialCount?: number; // default 5
}

const ShowMoreList: React.FC<ShowMoreListProps> = ({ fields, initialCount = 5 }) => {
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fieldsToShow = showAll ? fields : fields.slice(0, initialCount);

  const toggleShow = () => {
    if (showAll && containerRef.current) {
      // when collapsing, scroll smoothly back to top of container
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShowAll(!showAll);
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 gap-2">
      <AnimatePresence>
        {fieldsToShow.map((field) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TitleValueRow
              title={field.label
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())}
              value={String(field.value ?? "-")}
            />
            <hr className="custom-divider my-2" />
          </motion.div>
        ))}
      </AnimatePresence>

      {fields.length > initialCount && (
        <button
          className="w-full mt-3 py-2 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-[#C32033] hover:text-white transition"
          onClick={toggleShow}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default ShowMoreList;
