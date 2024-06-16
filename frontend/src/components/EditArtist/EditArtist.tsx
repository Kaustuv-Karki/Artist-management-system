import React from "react";
import { getArtistById } from "@/api/artists";
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

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";
import { postArtist } from "@/api/artists";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const EditArtistForm = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["artists", id],
    queryFn: () => getArtistById(id),
    enabled: !!id,
  });
  const [date, setDate] = React.useState<Date>();
  const form = useForm({
    defaultValues: {
      name: "",
      first_release_year: "",
      address: "",
      gender: "",
      dob: "",
      no_of_albums_released: "",
    },
  });

  useEffect(() => {
    console.log("Use effect called");
    if (!isLoading && data) {
      const artistData = data.data;
      console.log("Artist data", artistData);
      form.reset({
        name: artistData.name,
        first_release_year: artistData.first_release_year,
        address: artistData.address,
        gender: artistData.gender,
        dob: artistData.dob,
        no_of_albums_released: artistData.no_of_albums_released,
      });
    }
  }, [data, isLoading, form, id]);

  useEffect(() => {
    form.setValue("dob", date);
  }, [form, date]);

  const onSubmit = (data: any) => {
    const response = postArtist(data);
    form.reset();
    console.log(response);
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="no_of_albums_released"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>No of albums</FormLabel>
                  <FormControl>
                    <Input placeholder="Number of albums" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>Date of Birth</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="first_release_year"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>First Release Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First Release Year"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input placeholder="Gender" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <Button type="submit" variant="secondary" className="w-full">
              Update Artist Information
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditArtistForm;
