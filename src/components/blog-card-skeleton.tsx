import {FC} from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const BlogCardSkeleton: FC = () => {
  return (
    <Card className="max-w-[350px] w-full ">
      <CardHeader>
        <Skeleton className="w-full aspect-video"/>
        <CardTitle>
        <Skeleton className="h-4 w-[200px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="space-y-2 w-full">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
      </CardContent>
      <CardFooter className="flex justify-end">

        <Skeleton className="h-4 w-[100px]" />

      </CardFooter>
    </Card>
  )
}
