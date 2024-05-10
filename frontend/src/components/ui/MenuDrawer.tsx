import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import MenuIcon from "../icons/MenuIcon";
import MessagesIcon from "../icons/MessagesIcon";
import UserIcon from "../icons/UserIcon";
import { Client } from "@/app/chat/page";

const MenuDrawer = ({ usersConnected }: { usersConnected: Client[] }) => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<MenuIcon />
			</DrawerTrigger>
			<DrawerContent>
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
			</DrawerContent>
		</Drawer>
	);
};

export default MenuDrawer;
