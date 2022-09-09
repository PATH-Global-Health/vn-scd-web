import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getExaminationStatusColor } from '@app/utils/helpers';

interface Props {
  data: { key: string; value: string; label: string }[];
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel: React.FC<CustomizedLabelProps> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ExaminationPieChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={500} height={500}>
        <Pie
          data={data
            .filter((d) => d.value)
            .map((d) => ({ ...d, Sum: d.value }))}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data
            .filter((d) => d.value)
            .map((d) => (
              <Cell key={d.key} fill={getExaminationStatusColor(d.key).hex} />
            ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExaminationPieChart;
