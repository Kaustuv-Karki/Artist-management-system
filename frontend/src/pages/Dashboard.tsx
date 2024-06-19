import { getUsers } from "@/api/user";
import { TableComponent } from "@/components/TableComponent/TableComponent";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "@/api/user";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { deleteArtist, getArtists, importArtist } from "@/api/artists";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import axios from "axios";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export type Payment = {
  id: string;
  dob: Date;
  gender: "male" | "female" | "other";
  email: string;
  is_admin: boolean;
  first_name: string;
  last_name: string;
  phone: string;
};

const Dashboard = () => {
  const [inputClicked, setInputClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response.data;
    },
  });

  const { data: artistData, isLoading: artistLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const response = await getArtists();
      return response.data;
    },
  });

  console.log(artistData);
  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("first_name")}</div>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("last_name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: ({ row }) => <div>{row.getValue("dob")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

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
                onClick={() => navigate(`/edit-user/${user.id}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteUser(user.id);
                  queryClient.invalidateQueries(["users"]);
                }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const artistColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("dob")}</div>
      ),
    },
    {
      accessorKey: "first_release_year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            First Release Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("first_release_year")}</div>
      ),
    },
    {
      accessorKey: "no_of_albums_released",
      header: "Number of Albums",
      cell: ({ row }) => <div>{row.getValue("no_of_albums_released")}</div>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <div>{row.getValue("address")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const artist = row.original;

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
                onClick={() => navigate(`/edit-artist/${artist.id}`)}>
                Edit Artist
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/artist/songs/${artist.id}`)}>
                Songs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteArtist(artist.id);
                  queryClient.invalidateQueries(["artists"]);
                }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:5000/api/artist/upload", formData);
      queryClient.invalidateQueries(["artists"]);

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/artist/download",
        {
          method: "GET",
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "artists.csv");
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up the DOM
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Handle error as needed
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <Tabs defaultValue="users">
        <TabsList className="grid w-[200px] grid-cols-2 mx-auto">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <div className="max-w-[1000px] md:px-8 px-2 mx-auto mt-8">
            <h1 className="text-white text-[1.5rem]  font-semibold flex md:flex-row  flex-col items-center md:justify-between justify-center gap-4">
              <div>User Management </div>
              <div>
                <Button
                  type="submit"
                  variant="secondary"
                  onClick={() => navigate("/add-user")}>
                  <Plus />
                  Add User
                </Button>
              </div>
            </h1>
            <div className="bg-[#121418] px-4 mt-4">
              {!isLoading && data && (
                <TableComponent
                  data={data}
                  columns={columns}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="artists">
          <div className="max-w-[1000px] md:px-8 px-2 mx-auto mt-8">
            <h1 className="text-white text-[1.5rem]  font-semibold flex md:flex-row  flex-col items-center md:justify-between justify-center gap-4">
              <div>Artist Management </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  type="submit"
                  variant="secondary"
                  onClick={() => navigate("/add-artist")}>
                  <Plus />
                  Add Artist
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  onClick={handleDownload}>
                  Import Artist
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="text-black" variant="outline">
                      Upload Artist CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-300">
                    <DialogHeader>
                      <DialogTitle className="text-black">
                        Edit profile
                      </DialogTitle>
                      <DialogDescription className="text-black">
                        Upload Your CSV
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        className="bg-white text-black cursor-pointer h-[50px] "
                        type="file"
                        id="fileInput"
                        onChange={handleFileChange}
                      />
                    </div>
                    <Button
                      type="button"
                      className="bg-[#1DB954] hover:bg-[#1ed760] text-white w-full h-[50px]"
                      variant="secondary"
                      onClick={handleUpload}>
                      Upload CSV
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </h1>
            <div className="bg-[#121418] px-4 mt-4">
              <div className="bg-[#121418] px-4 mt-4">
                {!artistLoading && data && (
                  <TableComponent
                    data={artistData}
                    columns={artistColumns}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                  />
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
