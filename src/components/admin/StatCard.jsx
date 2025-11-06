export default function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <div className="text-blue-600 text-3xl">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-xl font-semibold">{value}</h3>
        </div>
        </div>
    );
}
