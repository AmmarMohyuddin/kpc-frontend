import LeadsRedIcon from "../images/sidebar/leads_red_icon.svg";
import { cardStyle } from "../../src/styles/cardStyle";
type CardTwoProps = {
  title: string;
  count?: number;
};

const CardTwo = ({ title, count = 0 }: CardTwoProps) => {
return (
  <div
    className="bg-white px-5 py-5 w-[300px] h-[138px] flex items-center justify-between"
    style={cardStyle}
  >
    {/* Icon */}
    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
      <svg
        className="fill-[#C32033] dark:fill-white"
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SVG paths */}
      </svg>
    </div>

    {/* Text */}
    <div className="flex flex-col text-right">
  <h4 className="text-[30px] font-medium text-black dark:text-white">
        {count}
      </h4>
  <span className="text-[14px] font-medium text-black dark:text-white">
    {title}
  </span>    </div>
  </div>
);


};

export default CardTwo;
