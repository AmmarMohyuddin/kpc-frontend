import SalesRequestRedIcon from '../images/sidebar/sales_request_red_icon.svg';
import { cardStyle } from '../../src/styles/cardStyle';
type CardThreeProps = {
  title: string;
  count?: number;
};

const CardThree = ({ title, count = 0 }: CardThreeProps) => {
  return (
    <div
      className="bg-white px-5 py-5 w-full h-[138px] flex items-center justify-between"
      style={cardStyle}
    >
      {/* Icon */}
       <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        <img src={SalesRequestRedIcon} alt="Leads Icon" className="w-7 h-7" />
      </div>

      {/* Text */}
      <div className="flex flex-col text-right">
        <h4 className="text-[30px] font-medium text-black dark:text-white">
          {count}
        </h4>
        <span className="text-[14px] font-medium text-black dark:text-white">
          {title}
        </span>{' '}
      </div>
    </div>
  );
};

export default CardThree;
