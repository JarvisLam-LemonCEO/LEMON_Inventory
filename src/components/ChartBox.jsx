import { PieChart, Pie, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function ChartBox({ data }) {
  return (
    <div style={{ display: "flex", gap: "40px" }}>
      <BarChart width={300} height={200} data={data}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="sales" />
      </BarChart>

      <PieChart width={300} height={200}>
        <Pie data={data} dataKey="sales" nameKey="name" />
      </PieChart>
    </div>
  );
}