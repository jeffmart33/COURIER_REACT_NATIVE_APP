import React from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 80;

export default function EarningsChart({ data = [] }) {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data:
          data.length === 7
            ? data
            : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  return (
    <LineChart
      data={chartData}
      width={screenWidth}
      height={220}
      yAxisLabel="₦"
      withInnerLines={false}
      withOuterLines={false}
      withShadow={true}
      withDots={true}
      withVerticalLabels={true}
      withHorizontalLabels={true}
      bezier
      chartConfig={{
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",

        decimalPlaces: 0,

        color: (opacity = 1) =>
          `rgba(22,163,74,${opacity})`,

        labelColor: (opacity = 1) =>
          `rgba(107,114,128,${opacity})`,

        propsForDots: {
          r: "5",
          strokeWidth: "2",
          stroke: "#16a34a",
        },

        propsForBackgroundLines: {
          strokeDasharray: "",
        },
      }}
      style={{
        borderRadius: 18,
      }}
    />
  );
}