"use client"

import axios from "axios";
import * as z from "zod";//Importing the Zod validation library
import { zodResolver } from "@hookform/resolvers/zod";//zodResolver is used for conjunction with form libraries like'react-hook-form'to integrate zod schemas for form validation.
import { useEffect,useState } from "react";
import { useForm } from "react-hook-form";//Custom react hook provided by the 'react-hook-form' library used to initialize and manage form state.

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({//is defined for form validation it specifies namd and image url.
    name: z.string().min(1,{
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1,{
        message: "Server image is required"
    })
});


export const InitialModal = () =>{//React funcitonal component  responsible for rendering the modal dialog
    const[isMounted,setIsMounted] = useState(false);

    const router = useRouter();

    useEffect(() =>{
        setIsMounted(true);
    },[]);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
            imageUrl:"",
        }
    });

    const isLoading = form.formState.isSubmitting;//checking if form is currently loading

    const onSubmit = async(values: z.infer<typeof formSchema>) =>{
        try{
            await axios.post("/api/servers",values);

            form.reset();
            router.refresh();
            window.location.reload();//use to refresh the page
        } catch (error) {
            console.log(error);
        }
    }

    if(!isMounted){//To solve hydration warning
        return null;
    }

    return(
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image .You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit = {form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                control = {form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            endpoint = "serverImage"
                                            value = {field.value}
                                            onChange = {field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                            <FormField
                                control={form.control}//Passes the 'control' object from react-hook-form to manage form state
                                name = "name" // species the name of the form field
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            disabled = {isLoading}//disables the input when onloading is true
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                                            focus-visibility:ring-offset-0" placeholder="Enter server name"
                                            {...field}/>

                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary"disabled={isLoading}>
                                Create 
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}