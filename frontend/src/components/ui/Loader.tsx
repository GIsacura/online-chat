import MessagesIcon from "../icons/MessagesIcon";

const Loader = () => {
	return (
		<div className="flex-col gap-4 w-full flex items-center justify-center">
			<div className="w-28 h-28 border-8 text-[#06b6d4] text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-[#06b6d4] rounded-full">
				<MessagesIcon className="w-1/2 h-1/2" />
			</div>
		</div>
	);
};

export default Loader;
