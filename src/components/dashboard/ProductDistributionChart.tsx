
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartData } from "@/components/ordens/forms/types";

interface ProductDistributionChartProps {
  productDistribution: ChartData[];
}

const ProductDistributionChart: React.FC<ProductDistributionChartProps> = ({ productDistribution }) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Produtos Mais Comuns</CardTitle>
        <CardDescription>Os produtos mais instalados nos clientes</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {productDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={productDistribution}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={70} 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Quantidade" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-[300px] text-muted-foreground">
            Sem dados disponíveis
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDistributionChart;
