import Lottie from "lottie-react";
import loaderAnimation from "../../assets/loader.json"; // adjust path as needed

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center light:bg-white">
      <Lottie 
        animationData={loaderAnimation} 
        loop={true} 
        className="h-24 w-24" 
      />
    </div>
  );
};

export default Loader;

// const Loader = () => {
//   return (
//     <div className="flex h-screen items-center justify-center light:bg-white">
//       <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#C32033] border-t-transparent"></div>
//     </div>
//   );
// };

// export default Loader;
