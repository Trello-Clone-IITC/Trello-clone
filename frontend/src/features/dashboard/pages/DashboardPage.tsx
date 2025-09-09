import starIcon from "../../../assets/star-icon.svg";
import clockIcon from "../../../assets/clock-icon.svg";

export default function DashboardPage() {
  return (
    <div>
      <section className="flex items-center gap-2">
        <img src={starIcon} alt="Star" className="w-5 h-5" />
        <span>Starred boards</span>
      </section>
      <section className="flex items-center gap-2">
        <img src={clockIcon} alt="Clock" className="w-5 h-5" />
        <span>Recently viewed</span>
      </section>
    </div>
  );
}
