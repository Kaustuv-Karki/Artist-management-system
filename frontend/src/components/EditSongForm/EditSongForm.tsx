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
import { addSong, getSongById } from "@/api/songs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const EditSongForm = () => {
  const { artistId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["songs", artistId],
    queryFn: () => getSongById(artistId),
    enabled: !!artistId,
  });
  console.log(data);
  const [date, setDate] = React.useState<Date>();
  const form = useForm({
    defaultValues: {
      title: "",
      album_name: "",
      artist_id: artistId,
      genre: "",
      released_date: "",
    },
  });

  useEffect(() => {
    form.setValue("released_date", date ? format(date, "yyyy-MM-dd") : "");
  }, [form, date]);

  const onSubmit = (data: any) => {
    addSong(data);
    form.reset();
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
              Add Song
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSongForm;
