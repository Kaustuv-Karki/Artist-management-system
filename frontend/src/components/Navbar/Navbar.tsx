import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/user/userSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    try {
      const parsedUser = JSON.parse(state.user);
      setUserDetails(
        parsedUser && typeof parsedUser === "object" ? parsedUser : null
      );
    } catch (error) {
      setUserDetails(state.user || null);
    }
  }, [state.user]);

  console.log(userDetails);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    setUserDetails(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      {userDetails && (
        <div className="flex justify-between items-center py-4 md:px-12 px-6">
          <div
            className="text-white font-bold text-[1.2rem] hover:underline cursor-pointer"
            onClick={() => navigate("/")}>
            HOME
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#DBFD00]">
                    {userDetails.first_name[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userDetails.first_name} {userDetails.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userDetails.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleLogout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};

export default Navbar;
