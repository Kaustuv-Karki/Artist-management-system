import React from "react";
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
import { getSongById, updateSong } from "@/api/songs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long" }),
  album_name: z
    .string()
    .min(5, { message: "Album name must be at least 5 characters long" }),
  artist_id: z.string(),
  genre: z.enum(["rnb", "country", "classic", "rock", "jazz"]),
  released_date: z.string().min(1, { message: "Released date is required" }),
});

const EditSongForm = () => {
  const queryClient = useQueryClient();
  const { songId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["songs", songId],
    queryFn: () => getSongById(songId),
    enabled: !!songId,
    refetchOnWindowFocus: false,
  });
  console.log(data);
  const [date, setDate] = React.useState<Date>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      album_name: "",
      artist_id: "",
      genre: "rnb",
      released_date: "",
    },
  });

  useEffect(() => {
    console.log("Use effect called");
    if (!isLoading && data) {
      form.reset({
        title: data?.data?.title,
        album_name: data?.data?.album_name,
        artist_id: data?.data?.artist_id.toString(),
        genre: data?.data?.genre,
        released_date: data?.data?.released_date,
      });
      setDate(data?.data?.released_date);
    }
  }, [data, isLoading, form, songId]);

  useEffect(() => {
    form.setValue("released_date", date);
  }, [form, date]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Data", data, "ID", songId);
    updateSong(songId, data);
    queryClient.invalidateQueries(["songs", songId]);
    queryClient.refetchQueries(["songs", songId]);
  };

  console.log(form.formState.errors);
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12">
            <FormField
              control={form.control}
              name="album_name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Album Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Album Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <Input placeholder="Genre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              control={form.control}
              name="released_date"
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
                          <span>Released Date</span>
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
          <div className="col-span-12">
            <Button type="submit" variant="secondary" className="w-full">
              Update Song
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSongForm;
