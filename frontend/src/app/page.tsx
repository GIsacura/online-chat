"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
			const info = localStorage.getItem("recent-names");

			if (info) {
				const names = await JSON.parse(info);
				setRecentNames(names);
			}
		})();
	}, []);

	useEffect(() => {
		localStorage.setItem("recent-names", JSON.stringify(recentNames));
	}, [recentNames]);

	return (
		<main className="w-full max-w-7xl min-h-screen flex flex-col-reverse justify-center lg:flex-row items-center pt-10 mx-auto">
			<section className="lg:w-[40%] h-full flex flex-col justify-center items-center">
				{recentNames.length > 0 ? (
					<div>
						<h2 className="text-xl lg:text-[32px]">
							Your recent selected names:
						</h2>
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
						<h2 className="text-xl lg:text-[32px]">Examples names:</h2>
						<ul className="list-disc ml-5 lg:ml-10 mt-3">
							{["John", "Doe", "Jane"].map((name: string) => (
								<li key={name} className="text-[18px] lg:text-[20px]">
									{name}
								</li>
							))}
						</ul>
					</div>
				)}
			</section>
			<section className="w-[90%] lg:w-[60%]">
				<h1 className="text-center text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-title-gradient">
					Online-chat
				</h1>
				<section className="h-full w-full flex flex-col items-center justify-center mt-10">
					<form
						onSubmit={formik.handleSubmit}
						className="w-full lg:w-[90%] flex flex-col"
					>
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
