import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { loginUser } from "@/api/user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, setTokens } from "@/redux/user/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const userResponse = await loginUser(data.email, data.password);
      console.log("This is user response", userResponse.data.user);
      const { accessToken, refreshToken } = userResponse.data;
      dispatch(loginSuccess(userResponse.data.user));
      dispatch(setTokens({ accessToken, refreshToken }));
      navigate("/");
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="secondary" className="w-full">
            Log In
          </Button>
        </form>
        <Button
          onClick={() => navigate("/register")}
          variant="link"
          className="w-full text-white">
          Create New Account
        </Button>
      </Form>
    </div>
  );
};

export default LoginComponent;
