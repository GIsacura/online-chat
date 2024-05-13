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
				<button>
					<MenuIcon />
				</button>
			</DrawerTrigger>
			<DrawerContent className="bg-[#333] scroll-y-auto h-1/2">
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
