import LeadsRedIcon from "../images/sidebar/leads_red_icon.svg";
import { cardStyle } from "../../src/styles/cardStyle";
type CardOneProps = {
  title: string;
  count?: number;
};

const CardOne = ({ title, count = 0 }: CardOneProps) => {
  return (
    <div
      className="bg-white px-5 py-5 w-[300px] h-[138px] flex items-center justify-between"
      style={cardStyle}
    >
      {/* Icon */}
      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <img
          src={LeadsRedIcon}
          alt="Leads Icon"
          className="w-6 h-6"
        />
      </div>

      {/* Text (count + title) */}
      <div className="flex flex-col text-right">
        <h4 className="text-[30px] font-medium text-black dark:text-white">
          {count}
        </h4>
        <span className="text-[14px] font-medium text-black dark:text-white">
          {title}
        </span>    </div>
    </div>
  );








  // return (
  //   <div className="bg-white px-3 py-3"
  //     style={cardStyle}>
  //     <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
  //       <img
  //         src={LeadsRedIcon}
  //         alt="Leads Icon"
  //         className="w-6 h-6"
  //       />
  //     </div>

  //     <div className="mt-4 flex items-end justify-between">
  //       <div>
  //         <h4 className="text-title-md font-bold text-black dark:text-white">
  //           {count.toLocaleString()}
  //         </h4>
  //         <span className="text-sm font-medium">{title}</span>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default CardOne;
