"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Home() {
	const router = useRouter();
	const [recentNames, setRecentNames] = useState<string[]>([]);
	const formik = useFormik({
		initialValues: {
			name: "",
		},
		validate: (values) => {
			const errors: Record<string, string> = {};

			if (!values.name) {
				errors.name = "Name is required";
			}

			return errors;
		},
		onSubmit: (values) => {
			sessionStorage.setItem("chat-username", values.name);
			setRecentNames((prev) => [...prev, values.name]);
			router.push("/chat");
		},
	});

	useEffect(() => {
		(async () => {
			const names = await JSON.parse(
				localStorage.getItem("recent-names") || "[]"
			);
			setRecentNames(names);
		})();
	}, []);

	return (
		<main className="w-full min-h-screen flex items-center pt-10">
			<section className="w-[50%] h-full flex flex-col justify-center items-center">
				{recentNames.length > 0 ? (
					<div>
						<h2 className="md:text-[32px]">Your recent selected names:</h2>
						<ul className="list-disc ml-10">
							{recentNames.map((name: string) => (
								<li key={name} className="text-[20px]">
									{name}
								</li>
							))}
						</ul>
					</div>
				) : (
					<div className="mt-10">
						<h2 className="md:text-[32px]">Examples names:</h2>
						<ul className="list-disc ml-10">
							{["John", "Doe", "Jane"].map((name: string) => (
								<li key={name} className="text-[20px]">
									{name}
								</li>
							))}
						</ul>
					</div>
				)}
			</section>
			<section className="w-[50%]">
				<h1 className="text-center md:text-6xl">Online-chat</h1>
				<section className="h-full w-full flex flex-col items-center justify-center mt-10">
					<form onSubmit={formik.handleSubmit} className="w-full flex flex-col">
						<input
							placeholder="Insert a name to join the chat..."
							id="name"
							value={formik.values.name}
							onChange={formik.handleChange}
							type="text"
							className={`border ${
								formik.errors.name ? "border-red-500" : "border-black"
							} text-black outline-none w-full max-w-[500px] p-2 rounded-lg mx-auto`}
						/>
						{formik.errors.name && (
							<p className="text-red-500 w-full max-w-[500px] mx-auto">
								{formik.errors.name}
							</p>
						)}
						<button
							className="mt-5 mx-auto w-full max-w-[500px] p-2 rounded-md bg-black text-white hover:bg-[#06b6d4]"
							type="submit"
						>
							Enter
						</button>
					</form>
				</section>
			</section>
		</main>
	);
}
