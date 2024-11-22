import { Space } from "nobox-client";
import { createRowSchema } from "../config";

export interface Blog {
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string; 
    tags?: string[];
    coverImage?: string;
}

export const BlogStructure: Space<Blog> = {
    space: "Blog",
    description: "A Record Space for Blogs",
    
    structure: {
        title: {
            description: "The title of the blog post",
            type: String,
            required: true,
        },
        content: {
            description: "The main content of the blog post",
            type: String,
            required: true,
        },
        author: {
            description: "The author of the blog post",
            type: String,
            required: true,
        },
        createdAt: {
            description: "The creation timestamp of the blog post",
            type: String, 
            required: true,
        },
        updatedAt: {
            description: "The last updated timestamp of the blog post",
            type: String, 
            required: true,
        },
        tags: {
            description: "Tags associated with the blog post",
            type: Array,
            required: false,
        },
        coverImage: {
            description: "URL for the cover image of the blog post",
            type: String,
            required: false,
        }
    }
}

export const BlogModel = createRowSchema<Blog>(BlogStructure);
