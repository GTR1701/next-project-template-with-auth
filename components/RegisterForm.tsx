"use client";

import { RegisterSchema } from "@/schemas/UserSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { setCookie } from "cookies-next";
import { registerUser } from "@/actions/registerUser";
import { UserTypes } from "@prisma/client";
import Link from "next/link";

type Props = {
	userTypes: UserTypes[];
};

export default function RegisterForm({ userTypes }: Readonly<Props>) {
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			username: "",
			password: "",
			passwordConfirmation: "",
			userType: "",
		},
	});

	const router = useRouter();
	const updateUser = useUserStore((state) => state.setLoggedInUser);

	const [registerResponse, setRegisterResponse] = useState("");
	const [open, setOpen] = useState(false);

	const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
		const registerStatus = await registerUser(data);
		setRegisterResponse(registerStatus.message);
		if (registerStatus.message === "Logged in") {
			updateUser(registerStatus.uuid);
			setCookie("currentUser", registerStatus.uuid);
			router.push("/login");
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				method="post"
				className="space-y-8 mt-16 bg-neutral-900 custom-shadow m-20 py-10 px-10 rounded-md"
			>
				<h2 className="text-slate-100 font-medium text-3xl text-center">
					Załóż konto
				</h2>

				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="Username"
									type="text"
									className="w-[80%] mx-auto text-white placeholder:text-gray-400 focus:placeholder-transparent"
									{...field}
								/>
							</FormControl>
							<FormMessage className="w-[80%] mx-auto" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="Password"
									type="password"
									className="w-[80%] mx-auto text-white placeholder:text-gray-400 focus:placeholder-transparent"
									{...field}
								/>
							</FormControl>
							<FormMessage className="w-[80%] mx-auto" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="passwordConfirmation"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="Confirm Password"
									type="password"
									className="w-[80%] mx-auto text-white placeholder:text-gray-400 focus:placeholder-transparent"
									{...field}
								/>
							</FormControl>
							<FormMessage className="w-[80%] mx-auto" />
						</FormItem>
					)}
				/>

				<div className="mx-auto flex justify-center">
					<Link
						className="text-slate-100 hover:text-purple-500 text-justify"
						href="login"
					>
						Masz konto? Zaloguj się
					</Link>
				</div>

				{registerResponse && registerResponse !== "Logged in" && (
					<p className="text-sm mx-auto w-[80%] text-[#ef3f3b]">
						{registerResponse}
					</p>
				)}

				<Button
					variant="default"
					type="submit"
					className="mx-auto block w-[80%] mt-20"
				>
					Załóż konto
				</Button>
			</form>
		</Form>
	);
}
