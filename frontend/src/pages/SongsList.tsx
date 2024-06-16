import { fetchSongsById } from "@/api/songs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const SongsList = () => {
  const { artistId } = useParams();
  const { data } = useQuery({
    queryKey: ["songs", artistId],
    queryFn: () => fetchSongsById(artistId),
    enabled: !!artistId,
  });
  console.log(data);
  return <div>SongsList</div>;
};

export default SongsList;
