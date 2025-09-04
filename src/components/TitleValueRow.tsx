import React from "react";

interface TitleValueRowProps {
  title: string;
  value?: string | number | null; // optional, can be string, number, or null
}

const TitleValueRow: React.FC<TitleValueRowProps> = ({ title, value }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="detail-title">{title}:</span>
      <span className="text-[16px] font-normal text-[#000000B2]">
        {value ?? "-"}
      </span>    </div>
  );
};

export default TitleValueRow;
