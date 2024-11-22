import { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Toaster } from "@/components/ui/toaster"
import { Plus } from "lucide-react";
import { BlogCardSkeleton } from "./components/blog-card-skeleton";
import { BlogCard } from "./components/blog-card";
import { BlogModel } from "./nobox/record-structures/blog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose ,
  DialogTrigger,
  DialogFooter
} from "./components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form"
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { MiniLoader } from "./components/mini-loader";
import { useToast } from "@/hooks/use-toast"
const NewBlogSchema = z.object({
  title: z.string().min(3, {
    message: "Title must have minimum 3 characters",
  }),
  content: z.string().min(10, {
    message: "Content must have minimum 10 characters",
  }),
  author: z.string().min(3, {
    message: "Author must have minimum 3 characters",
  }),
  // coverImage: z.string().optional(),
});
export interface BlogType {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string; 
  tags?: string[];
  coverImage?: string;
}
function App() {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<undefined | string>(undefined);
  const [blogContent, setBlogContent] = useState<BlogType[]>([]);
  const [newDataLoading, setNewDataLoading] = useState(false)
  const form = useForm<z.infer<typeof NewBlogSchema>>({
    resolver: zodResolver(NewBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      author: ""
    },
  });
  const {toast} = useToast();
const closeRef = useRef<null | HTMLButtonElement>(null)
  const getAllData = async () => {
    try {
      setError(undefined);
      setIsPending(true);
     
      const results = await BlogModel.find({}, {});
      const isResultArray = Array.isArray(results)
      if(!isResultArray) {
        setError("Unexpected error occured. Please try again later.")
        return;
      }
      setBlogContent(results);
    } catch (error) {
      console.error(`Unable to get all users: ${error}`);
      setError("Unexpected error occured. Please try again later.");
    } finally {
      setIsPending(false);
    }
  };
  useEffect(() => {
    getAllData();
  }, []);
 async function onSubmit(values: z.infer<typeof NewBlogSchema>) {
   const {content, author, title} = values;
   const now = new Date().toString();

  
    const newData = {
      content,
      author,
      title,
      createdAt: now,
      updatedAt: now
    }

    try{
      setNewDataLoading(true);
     const result = await BlogModel.insertOne(newData);
     if(!result?.title || !result?.author || !result?.content) {
      toast({variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",})
        return
     }
     setBlogContent(prev => {
      return [...prev, result]
     });
     toast({
      description: "Blog data sent successfully",
    });
    form.reset();
    if(closeRef && closeRef.current) {
      closeRef.current.click();
      
     }
     window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    }catch(error){
      console.error(`Unable to create new blog data:${error}`)
      toast({variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",})
    }finally {
      setNewDataLoading(false)
    }
  }

  const skeletonArray = Array.from({ length: 10 }, (_, index) => index + 1);
  

  return (
    <main className="min-h-dvh flex gap-6 font-ubuntu px-[5%] py-8 flex-col items-center">
      <Toaster />
      <h1 className="text-center w-full font-bold text-2xl">
        Welcome to Priza
      </h1>
      <p className="text-center w-full ">Here are some of my blog contents</p>
      {error ? (
        <div className="flex flex-col items-center  gap-4">
          <p className="text-center w-full text-lg text-red-500">{error}</p>
          <Button onClick={getAllData} className="w-[100px]">Retry</Button>
        </div>
      ) : (
        <div className="flex flex-wrap w-full justify-center  gap-4">
          {isPending && (
            <>
              {skeletonArray.map((skeleton) => {
                return (
                  <div key={skeleton}>
                    <BlogCardSkeleton />
                  </div>
                );
              })}
            </>
          )}
          {!isPending && blogContent.length > 0 && (
            <>
              {blogContent.map((blog, index) => {
                return (
                  <div key={index}>
                    <BlogCard
                    id={blog.id}
                      title={blog.title}
                      description={blog.content}
                      author={blog.author}
                      coverUrl={blog.coverImage}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      <div className="fixed bottom-10 right-10">
        <Dialog >
          <DialogTrigger asChild>
            <Button variant="default" size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {" "}
                📝 Add Blog Items{" "}
              </DialogTitle>
              <DialogDescription>
                Create and share your stories with the world. Fill in the
                details below to add a new blog post to the collection.
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
        {/* <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit" className="w-full" disabled={newDataLoading}>{newDataLoading ? <MiniLoader />: "Submit"}</Button>
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
    </main>
  );
}

export default App;
