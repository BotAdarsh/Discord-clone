"use client"

import axios from "axios";
import qs from "query-string";
import * as z from "zod";//Importing the Zod validation library
import { zodResolver } from "@hookform/resolvers/zod";//zodResolver is used for conjunction with form libraries like'react-hook-form'to integrate zod schemas for form validation.
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
    FormItem
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({//is defined for form validation it specifies namd and image url.
    fileUrl: z.string().min(1,{
        message: "Attachment is required."
    })
});


export const MessageFileModal = () =>{//React funcitonal component  responsible for rendering the modal dialog
    const { isOpen, onClose, type, data} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data; 

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            fileUrl:"",
        }
    });

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const isLoading = form.formState.isSubmitting;//checking if form is currently loading

    const onSubmit = async(values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });
            await axios.post(url,{
                ...values,
                content: values.fileUrl,
            });

            form.reset();
            router.refresh();
            handleClose();//reset our form
        } catch (error) {
            console.log(error);
        }
    }


    return(
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit = {form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                control = {form.control}
                                name="fileUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            endpoint = "messageFile"
                                            value = {field.value}
                                            onChange = {field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                            
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary"disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}