import {FC, useRef, useState} from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EllipsisVertical } from 'lucide-react';
import { Button } from './ui/button';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BlogModel } from "../nobox/record-structures/blog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose ,
  DialogTrigger,
  DialogFooter
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MiniLoader } from "./mini-loader";

import { useToast } from "@/hooks/use-toast"
type CardProps = {
  id: string;
    title: string;
    description: string;
    coverUrl?: string;
    author: string;
}
const UpdateBlogSchema = z.object({
  title: z.string().min(3, {
    message: "Title must have minimum 3 characters",
  }).optional(),
  content: z.string().min(10, {
    message: "Content must have minimum 10 characters",
  }).optional(),
  author: z.string().min(3, {
    message: "Author must have minimum 3 characters",
  }).optional(),
  // coverImage: z.string().optional(),
});
export const BlogCard: FC<CardProps> = ({id, title, coverUrl = "https://res.cloudinary.com/dgewykhor/image/upload/v1731750017/samples/animals/reindeer.jpg", author, description}) => {
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [newTitle, setNewTitle] = useState<undefined | string>(undefined)
  const [newAuthor, setNewAuthor] = useState<undefined | string>(undefined)
  const [newDescription, setNewDescription] = useState<undefined | string>(undefined)
   const {toast} = useToast();

  const closeRef = useRef<null | HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof UpdateBlogSchema>>({
    resolver: zodResolver(UpdateBlogSchema),
    defaultValues: {
      title: undefined,
      content: undefined,
      author: undefined
    },
  });
  // const { title: newTitle, content, author: newAuthor } = form.watch();

  
  const onSubmit = async(values: z.infer<typeof UpdateBlogSchema>) => {
    const {title, author, content} = values;

    if(!title && !author && !content){
      toast({variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "At least one field is required.",})
        return
    }
    const updatedValues = Object.fromEntries(
      Object.entries({ title, author, content }).filter(([_, value]) => value !== undefined)
    );
    try{
      setIsUpdatePending(true)
      const result = await BlogModel.updateOneById(id, updatedValues);
      if(!result?.title || !result?.author || !result?.content) {
        toast({variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",})
          return
       }
       setNewAuthor(result.author);
       setNewDescription(result.content);
       setNewTitle(result.title);
       toast({
        description: "Blog data updated successfully",
      });
      form.reset();
      if(closeRef && closeRef.current) {
        closeRef.current.click();
        
       }


    }catch(error){
      console.error(`Unable to update blog details: ${error}`);
      toast({variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",})
    } finally {
      setIsUpdatePending(false)
    }
  }
  return (
    <Card className="w-[350px] sm:min-h-[570px] ">
     
      <CardHeader className='relative'>
        <div className="top-7  absolute right-[23px]">
        <Dialog >
          <DialogTrigger asChild>
          <Button size="icon" variant="secondary" >
        <EllipsisVertical/>
      </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {" "}
                📝 Update Blog Items{" "}
              </DialogTitle>
              <DialogDescription>
              Update the details below to modify the title, content, or author as needed.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content *</FormLabel>
              <FormControl>
                <Textarea  {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author *</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit"  className="w-full" disabled={isUpdatePending }>{isUpdatePending ? <MiniLoader />: "Submit"}</Button>
      </form>
    </Form>
    <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="hidden" ref={closeRef}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      
      
        <img src={coverUrl}  alt={`${title} img`} className="w-full object-cover aspect-video" loading="lazy"/>
        <CardTitle className="text-lg font-bold">{newTitle || title}</CardTitle>
      </CardHeader>
      <CardContent>
        {newDescription || description}
      </CardContent>
      <CardFooter className="flex justify-end">
        <p>By {newAuthor || author}</p>
      </CardFooter>
    </Card>
  )
}
