import LoginComponent from "@/components/LoginComponent/LoginComponent";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center w-full">
        <div className="md:mb-[5rem] mb-[3rem] flex flex-col justify-center items-center">
          <h1 className="text-white font-semibold md:text-[3rem] text-[2rem]">
            Login to Your Account
          </h1>
          <p className="text-gray-300 md:text-[1.2rem] text-[1rem]">
            Handle All the artist information
          </p>
        </div>
        <div className="max-w-[600px] w-full border md:px-8 md:py-10 px-4 py-5">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
};

export default Login;
