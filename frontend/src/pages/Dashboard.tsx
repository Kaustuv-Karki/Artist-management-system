import { getUsers } from "@/api/user";
import { TableComponent } from "@/components/TableComponent/TableComponent";
import { useQuery } from "@tanstack/react-query";

import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const columns = [
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
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
            <DropdownMenuItem onClick={() => console.log("Edit ID:", user.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response.data;
    },
  });

  const navigate = useNavigate();

  console.log(data);

  return (
    <div>
      <div className="max-w-[1000px] md:px-8 px-2 mx-auto mt-8">
        <h1 className="text-white text-[1.5rem]  font-semibold flex items-center justify-between gap-4">
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
            <TableComponent data={data} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
