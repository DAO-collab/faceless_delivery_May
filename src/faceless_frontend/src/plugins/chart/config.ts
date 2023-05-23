import { graphic } from "echarts/core";

const load = {
  text: "",
  zlevel: 1,
  lineWidth: 4,
  color: "#958EFC",
  spinnerRadius: 13,
  maskColor: "rgba(25, 27, 33, 0.2)",
};

const noData = {
  zlevel: 1,
  fontSize: 14,
  text: "No Data",
  color: "#958EFC",
  showSpinner: false,
  textColor: "#9da0a9",
  fontFamily: "Ubuntu-Regular",
  maskColor: "rgba(25, 27, 33, 0.2)",
};

const line = ({ min, date, volumes }: any) => ({
  xAxis: {
    show: true,

    data: date,

    type: "category",

    boundaryGap: false,

    axisLabel: {
      show: true,
    },

    axisLine: {
      show: false,
    },

    axisTick: {
      show: false,
    },

    splitLine: {
      show: false,
    },
  },

  yAxis: {
    min,

    show: true,

    type: "value",

    position: "right",

    axisLabel: {
      show: true,
    },

    axisLine: {
      show: false,
    },

    axisTick: {
      show: false,
    },

    splitLine: {
      show: false,
    },
  },

  grid: [
    {
      top: 5,
      left: 5,
      right: 0,
      bottom: 0,
      containLabel: true,
    },
  ],

  tooltip: {
    trigger: "axis",
    showContent: false,

    axisPointer: {
      type: "line",

      lineStyle: {
        width: 1,
        type: "solid",
        color: "rgba(255,255,255,.1)",
      },
    },
  },

  series: [
    {
      type: "line",
      smooth: true,
      data: volumes,
      symbolSize: 8,
      symbol: "circle",
      showSymbol: false,

      itemStyle: {
        borderWidth: 2,
        color: "#958EFC",
        borderColor: "#fff",

        lineStyle: {
          width: 2,
          color: "#958EFC",
        },
      },

      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(149, 142, 252, 0.25555)",
          },

          {
            offset: 0.3,
            color: "rgba(149, 142, 252, 0.15)",
          },

          {
            offset: 1,
            color: "rgba(149, 142, 252, 0)",
          },
        ]),
      },
    },
  ],
});

const kind: any = {
  line,
};

export { load, noData, kind };
