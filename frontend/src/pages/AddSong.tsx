import AddSongForm from "@/components/AddSongForm/AddSongForm";
import { useParams } from "react-router-dom";

const AddSong = () => {
  const { artistId } = useParams();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center w-full">
        <div className="md:mb-[2rem] mb-[1rem] flex flex-col justify-center items-center">
          <h1 className="text-white font-semibold md:text-[3rem] text-[2rem]">
            Add Songs
          </h1>
        </div>
        <div className="max-w-[600px] w-full border md:px-8 md:py-10 px-4 py-5">
          <AddSongForm artistId={artistId} />
        </div>
      </div>
    </div>
  );
};

export default AddSong;
