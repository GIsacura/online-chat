"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { config } from "../../config";
import { useFormik } from "formik";
import SendIcon from "@/components/icons/SendIcon";
import MessagesIcon from "@/components/icons/MessagesIcon";
import DotIcon from "@/components/icons/DotIcon";
import UserIcon from "@/components/icons/UserIcon";
import Loader from "@/components/ui/Loader";

export interface Client {
	id: string;
	name: string;
}

let name: string | null = null;
let socket: Socket | undefined = undefined;

const Chat = () => {
	const router = useRouter();
	const [username, setUsername] = useState<string | null>(null);
	const [connected, setConnected] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [usersConnected, setUsersConnected] = useState<Client[]>([]);
	const chatRef = useRef<HTMLDivElement>(null);

	const renderMessage = (payload: any) => {
		const { userId, message, name } = payload;
		if (socket) {
			console.log({ userId, message, name, socketId: socket.id });

			const divElement = document.createElement("div");
			divElement.classList.add("message");

			if (userId !== socket.id) {
				divElement.classList.add("incoming");
				divElement.innerHTML = `
					<small>${name}</small>
					<p>${message}</p>
				`;
			} else {
				divElement.innerHTML = `
					<p>${message}</p>
				`;
			}

			if (chatRef.current) {
				chatRef.current.appendChild(divElement);

				//Scroll to the bottom of the chat
				chatRef.current.scrollTop = chatRef.current?.scrollHeight;
			}
		}
	};

	const formik = useFormik({
		initialValues: {
			message: "",
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.message) {
				errors.message = "Message is required";
			}
			return errors;
		},
		onSubmit: (values) => {
			socket?.emit("send-message", values.message);
		},
	});

	useEffect(() => {
		name = sessionStorage.getItem("chat-username");
		setUsername(name);
		if (!name) {
			router.replace("/");
			return;
			// throw new Error("Username is required");
		}

		if (!socket) {
			socket = io(config.socket.url ?? "", {
				auth: {
					name,
				},
			});
		}

		setLoading(false);

		console.log("ENTRO");

		socket?.on("connect", () => {
			console.log("Connected to server");
			setConnected(true);
		});

		socket?.on("disconnect", () => {
			console.log("Disconnected from server");
			setConnected(false);
		});

		socket.on("on-clients-changed", (clients: Client[]) => {
			console.log({ clients });

			setUsersConnected([...clients]);
		});

		socket?.on("on-message", renderMessage);
	}, []);

	return loading ? (
		<main className="w-full h-screen flex justify-center items-center">
			<Loader />
		</main>
	) : (
		<main className="w-full h-screen">
			<div className="xs:block md:flex h-full">
				{/* Connected users */}
				<section className=" h-full md:w-full md:max-w-[300px] border-r-[1px] border-black">
					<section className="h-20 p-6 gap-x-2 flex items-center">
						<MessagesIcon className="md:w-12 md:h-12 bg-slate-700 rounded-full p-2" />
						<h2 className="text-[20px] min-w-max">Live chat</h2>
					</section>
					<section className="p-4">
						<p>Users connected ({usersConnected.length})</p>

						<ul className="mt-5">
							{usersConnected.map((user) => (
								<li key={user.name} className="p-2 flex items-center gap-x-2">
									<UserIcon className="bg-slate-400/50 rounded-full p-2 w-11 h-11" />
									{user.name}
								</li>
							))}
						</ul>
					</section>
				</section>

				{/* Chat */}
				<section className="w-full h-full grid grid-rows-[80px_1fr_80px]">
					<div className="h-full max-h-20 p-3 flex items-center gap-x-2 border-b border-black ">
						<UserIcon className="md:w-12 md:h-12 bg-slate-400/50 rounded-full p-2" />
						{connected ? (
							<span className="flex">
								{username}
								<DotIcon color="#00cd00" />
							</span>
						) : (
							<span className="flex">
								{username}
								<DotIcon color="#e60000" />
							</span>
						)}
					</div>
					<div
						className="w-full h-full overflow-y-scroll scrollbar-none"
						ref={chatRef}
					></div>
					<form onSubmit={formik.handleSubmit} className="h-full">
						<div
							className={`border border-l-0 border-b-0 flex gap-x-2 border-black outline-none w-full h-full p-2`}
						>
							<input
								placeholder="Insert a message..."
								name="message"
								id="message"
								value={formik.values.message}
								onChange={formik.handleChange}
								autoComplete="off"
								className="w-full outline-none bg-transparent h-full"
							/>
							<button
								disabled={
									Boolean(formik.errors.message) || !formik.values.message
								}
								className="rounded-full p-3"
								type="submit"
							>
								<SendIcon />
							</button>
						</div>
					</form>
				</section>
			</div>
		</main>
	);
};

export default Chat;
