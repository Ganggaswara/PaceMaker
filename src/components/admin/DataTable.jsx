export default function DataTable({ columns, data }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
            <tr>
                {columns.map((col) => (
                <th
                    key={col}
                    className="px-4 py-2 text-left font-medium text-gray-600 uppercase"
                >
                    {col}
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.length ? (
                data.map((row, i) => (
                <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition-colors"
                >
                    {Object.values(row).map((val, j) => (
                    <td key={j} className="px-4 py-2">
                        {val}
                    </td>
                    ))}
                </tr>
                ))
            ) : (
                <tr>
                <td
                    colSpan={columns.length}
                    className="text-center text-gray-500 py-4"
                >
                    No data available
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
}
