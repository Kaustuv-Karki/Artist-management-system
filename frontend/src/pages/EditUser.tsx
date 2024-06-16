import AddUserComponent from "@/components/AddUser/AddUserComponent";
import { useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center w-full md:mx-8 mx-4">
        <div className="md:mb-[3rem] mb-[1rem] flex flex-col justify-center items-center">
          <h1 className="text-white font-semibold md:text-[3rem] text-[2rem]">
            Update User Done
          </h1>
        </div>
        <div className="max-w-[600px] w-full border md:px-8 md:py-10 px-4 py-5">
          <AddUserComponent id={id} />
        </div>
      </div>
    </div>
  );
};

export default EditUser;
