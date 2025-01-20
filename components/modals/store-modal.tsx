'use client';

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong"),
});

export const StoreModal = () => {
    const [loading, setLoading] = useState(false);

    const storeModal = useStoreModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post("/api/stores/", values);

            console.log(response.data);
            toast.success("Berhasil Menambahkan Data");
            window.location.assign(`/${response.data.id}`)
            form.reset();
            storeModal.onClose();
        } catch (error) {
            console.log(error);
            toast.error("Gagal Membuat Data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Buat Website"
            description="Tambahkan Template Website"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div className="space-y-6 py-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">
                                        Nama
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Masukkan Nama Framework"
                                            {...field}
                                            disabled={loading}
                                        />  
                                    </FormControl>
                                    <FormMessage className="text-sm text-red-500" />
                                </FormItem>
                            )}
                        />
                        <div className="pt-6 flex items-center justify-end space-x-4">
                            <Button
                                disabled={loading}
                                variant="outline"
                                onClick={storeModal.onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={loading}
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};
