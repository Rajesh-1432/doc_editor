import { CircleArrowRight } from "lucide-react";

function Card({ title, description, icon: Icon, onClick }) {
  return (
    <div
      className="group bg-white p-8 rounded-lg border shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex justify-between"
      onClick={onClick}
    >
      <div className="text-left">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 group-hover:text-[#EB1700]">
          {title}
        </h2>
        <p className="text-gray-400 mb-6 group-hover:text-black">
          {description}
        </p>
      </div>
      <div className="flex flex-col items-center justify-between text-xl text-gray-700">
        <Icon />
        <CircleArrowRight />
      </div>
    </div>
  );
}

export default Card;
