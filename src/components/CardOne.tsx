import LeadsRedIcon from '../images/sidebar/leads_red_icon.svg';
import { cardStyle } from '../../src/styles/cardStyle';
type CardOneProps = {
  title: string;
  count?: number;
};

const CardOne = ({ title, count = 0 }: CardOneProps) => {
  return (
    <div
      className="bg-white px-4 sm:px-5 py-4 sm:py-5 w-full h-auto min-h-[120px] sm:min-h-[138px] flex items-center justify-between"
      style={cardStyle}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 sm:h-11.5 sm:w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 flex-shrink-0">
        <img
          src={LeadsRedIcon}
          alt="Leads Icon"
          className="w-6 h-6 sm:w-7 sm:h-7"
        />
      </div>

      {/* Text (count + title) */}
      <div className="flex flex-col text-right ml-2">
        <h4 className="text-2xl sm:text-[30px] font-medium text-black dark:text-white">
          {count.toLocaleString()}
        </h4>
        <span className="text-xs sm:text-sm font-medium text-black dark:text-white truncate max-w-[140px] sm:max-w-none">
          {title}
        </span>{' '}
      </div>
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
