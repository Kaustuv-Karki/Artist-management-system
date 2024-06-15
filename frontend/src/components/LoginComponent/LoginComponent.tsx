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

const LoginComponent = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    const userResponse = await loginUser(data.email, data.password);
    console.log(userResponse);
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
        <Button variant="link" className="w-full text-white">
          Create New Account
        </Button>
      </Form>
    </div>
  );
};

export default LoginComponent;
