import { deleteSong, fetchSongsById } from "@/api/songs";
import { TableComponent } from "@/components/TableComponent/TableComponent";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";

const SongsList = () => {
  console.log("Songs list called");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { artistId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["songs", artistId],
    queryFn: () => fetchSongsById(artistId),
    enabled: !!artistId,
  });

  const songsColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "album_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Album name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("album_name")}</div>
      ),
    },
    {
      accessorKey: "genre",
      header: "Genre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("genre")}</div>
      ),
    },
    {
      accessorKey: "released_date",
      header: "Released Date",
      cell: ({ row }) => (
        <div>{row.getValue("released_date").slice(0, 10)}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const song = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate(`/edit-song/${song.id}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteSong(song.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  console.log("Song data", !isLoading && data.data);
  return (
    <div className="max-w-[1000px] md:px-8 px-2 mx-auto py-8 h-[calc(100vh-80px)]">
      <h1 className="text-white text-[1.5rem]  font-semibold flex items-center justify-between gap-4">
        <div>Song Management </div>
        <div>
          <Button
            type="submit"
            variant="secondary"
            onClick={() => navigate(`/add-song/${artistId}`)}>
            <Plus />
            Add Song
          </Button>
        </div>
      </h1>
      <div className="bg-[#121418] px-4 mt-4">
        {!isLoading && (
          <TableComponent
            columns={songsColumns}
            data={data.data}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            filterBy="album_name"
          />
        )}
      </div>
    </div>
  );
};

export default SongsList;
