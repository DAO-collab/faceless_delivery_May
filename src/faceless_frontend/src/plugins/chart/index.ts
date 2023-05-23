// @ts-nocheck
import { LineChart } from "echarts/charts";
import { load, noData, kind } from "./config";
import { use, init, ECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { TooltipComponent, GridComponent } from "echarts/components";

use([LineChart, GridComponent, CanvasRenderer, TooltipComponent]);

class EChart {
  raw: any;
  type: string;
  myEchart: ECharts;
  HTMLElement: HTMLElement;

  constructor(type: string, HTMLElement: HTMLElement) {
    this.type = type;
    this.HTMLElement = HTMLElement;
  }

  init() {
    this.myEchart = init(this.HTMLElement);
  }

  noData() {
    this.myEchart.showLoading(noData);
  }

  showLoading() {
    this.myEchart.showLoading(load);
  }

  hideLoading() {
    this.myEchart.hideLoading();
  }

  dispose() {
    this.myEchart.dispose();
  }

  clear() {
    this.myEchart.clear();
  }

  render({ min, date, volumes }: any) {
    this.raw = { min, date, volumes };
    this.myEchart.setOption(kind[this.type](this.raw));
    window.addEventListener("resize", () => this.myEchart.resize());
  }

  turnOnRealTime({ currentTime, currentValue }: any) {
    let { date, volumes } = this.raw;
    let latestTime = date[date.length - 1];
    let latestValue = volumes[volumes.length - 1];

    currentTime.value = latestTime;
    currentValue.value = latestValue;

    this.myEchart.getZr().on("mousemove", ({ offsetX, offsetY }) => {
      let index = { seriesIndex: 0 };
      let pointInPixel = [offsetX, offsetY];
      let grid = this.myEchart.convertFromPixel(index, pointInPixel);

      if (!grid) return;

      currentTime.value = date[grid[0]] || latestTime;
      currentValue.value = volumes[grid[0]] || latestValue;
    });

    this.myEchart.on("globalout", () => {
      currentTime.value = latestTime;
      currentValue.value = latestValue;
    });
  }
}

export { EChart };
