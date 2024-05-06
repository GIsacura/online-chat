"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { config } from "../../config";
import { useFormik } from "formik";
import SendIcon from "@/components/ui/icons/SendIcon";

const name = localStorage.getItem("chat-username");

const socket = io(config.socket.url ?? "", {
	auth: {
		name,
	},
});

const Chat = () => {
	const router = useRouter();
	const [username, setUsername] = useState<string | null>(null);
	const [connected, setConnected] = useState<boolean>(false);
	const chatRef = useRef<HTMLDivElement>(null);

	const renderMessage = (payload: any) => {
		const { userId, message, name } = payload;
		console.log({ userId, message, name, socketId: socket.id });

		const divElement = document.createElement("div");
		divElement.classList.add("message");

		if (userId !== socket.id) {
			divElement.classList.add("incoming");
		}

		divElement.innerHTML = `
		  <small>${name}</small>
		  <p>${message}</p>
		`;

		if (chatRef.current) {
			chatRef.current.appendChild(divElement);

			//Scroll to the bottom of the chat
			chatRef.current.scrollTop = chatRef.current?.scrollHeight;
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
			socket.emit("send-message", values.message);
		},
	});

	useEffect(() => {
		const name = localStorage.getItem("chat-username");
		setUsername(name);
		if (!name) {
			router.replace("/");
			return;
			// throw new Error("Username is required");
		}

		socket.on("connect", () => {
			console.log("Connected to server");
			setConnected(true);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from server");
			setConnected(false);
		});

		socket.on("on-message", renderMessage);
	}, []);

	return (
		<main className="w-full h-screen">
			<div className="h-1/6 max-h-20">f</div>
			<div className="xs:block md:flex h-[84%]">
				{/* Connected users */}
				<section className=" h-full md:w-full md:max-w-[300px] border-r-[1px] border-black">
					f
				</section>

				{/* Chat */}
				<section className="w-full h-full">
					<div
						className=" w-full h-5/6 overflow-y-scroll scrollbar-none"
						ref={chatRef}
					></div>
					<form onSubmit={formik.handleSubmit} className="h-1/6">
						<div
							className={`border border-l-0 border-b-0 flex gap-x-2 border-black outline-none w-full p-2`}
						>
							<input
								placeholder="Insert a message..."
								id="message"
								value={formik.values.message}
								onChange={formik.handleChange}
								type="text"
								className="w-full outline-none bg-transparent"
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
